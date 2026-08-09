import ChallengesSidebar from "@/components/dashboard/challenges-sidebar/ChallengesSidebar";
import { fetchBadges } from "@/lib/api/badges";
import type { ChallengeSlug } from "@jiki/curriculum";
import { fetchChallenges, type ChallengeWithCopy, type ChallengeStatus } from "@/lib/api/challenges";
import { fetchProfile } from "@/lib/api/profile";
import { createMockUser } from "@/tests/mocks/user";
import { act, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/lib/api/profile", () => ({ fetchProfile: jest.fn() }));
jest.mock("@/lib/api/challenges", () => ({ fetchChallenges: jest.fn() }));
jest.mock("@/lib/api/badges", () => ({ fetchBadges: jest.fn() }));

jest.mock("@/lib/auth/authStore", () => {
  const { createMockUser: makeUser } = jest.requireActual("@/tests/mocks/user");
  let state = { user: makeUser({ membership_type: "premium" }) };
  return {
    useAuthStore: jest.fn((selector?: (s: typeof state) => unknown) => (selector ? selector(state) : state)),
    __setUser: (user: unknown) => {
      state = { user: user as ReturnType<typeof makeUser> };
    }
  };
});

jest.mock("@/components/dashboard/challenges-sidebar/ui/UserProfile", () => ({
  UserProfile: ({ profile }: { profile: { name: string } | null }) => (
    <div data-testid="user-profile">{profile?.name ?? "loading"}</div>
  )
}));

jest.mock("@/components/dashboard/challenges-sidebar/ui/ChallengesUpsellCard", () => ({
  ChallengesUpsellCard: () => <div data-testid="upsell-card">upsell</div>
}));

jest.mock("@/components/dashboard/challenges-sidebar/ui/RecentChallenges", () => ({
  RecentChallenges: ({ challenges, unlockedCount }: { challenges: ChallengeWithCopy[]; unlockedCount: number }) => (
    <div data-testid="recent-challenges" data-unlocked={unlockedCount}>
      {challenges.map((p) => (
        <div key={p.slug} data-testid={`challenge-${p.slug}`} data-status={p.status}>
          {p.title}
        </div>
      ))}
    </div>
  )
}));

const mockFetchProfile = fetchProfile as jest.MockedFunction<typeof fetchProfile>;
const mockFetchChallenges = fetchChallenges as jest.MockedFunction<typeof fetchChallenges>;
const mockFetchBadges = fetchBadges as jest.MockedFunction<typeof fetchBadges>;

const authStoreMock = jest.requireMock("@/lib/auth/authStore");

function makeChallenge(slug: ChallengeSlug, status: ChallengeStatus): ChallengeWithCopy {
  return { slug, title: slug, description: `${slug} desc`, status };
}

function mockChallenges(list: ChallengeWithCopy[]) {
  mockFetchChallenges.mockResolvedValue({
    results: list,
    meta: { current_page: 1, total_count: list.length, total_pages: 1 }
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  authStoreMock.__setUser(createMockUser({ membership_type: "premium" }));
  mockFetchProfile.mockResolvedValue({
    profile: { avatar_url: "", icon: "", streaks_enabled: false, total_active_days: 0 }
  });
  mockFetchBadges.mockResolvedValue({ badges: [], num_locked_secret_badges: 0 });
  mockChallenges([]);
});

describe("ChallengesSidebar", () => {
  describe("non-premium users", () => {
    it("renders the upsell card and does not call fetchChallenges", async () => {
      authStoreMock.__setUser(createMockUser({ membership_type: "standard" }));

      render(<ChallengesSidebar />);

      await waitFor(() => expect(mockFetchProfile).toHaveBeenCalled());
      expect(screen.getByTestId("upsell-card")).toBeInTheDocument();
      expect(mockFetchChallenges).not.toHaveBeenCalled();
    });
  });

  describe("premium users", () => {
    it("fires profile, badges, and challenges requests in parallel on mount", async () => {
      let resolveProfile: () => void = () => {};
      mockFetchProfile.mockReturnValue(
        new Promise((resolve) => {
          resolveProfile = () =>
            resolve({
              profile: { avatar_url: "", icon: "", streaks_enabled: false, total_active_days: 0 }
            });
        })
      );

      render(<ChallengesSidebar />);

      // All three fire on mount, regardless of profile resolving
      expect(mockFetchProfile).toHaveBeenCalledTimes(1);
      expect(mockFetchBadges).toHaveBeenCalledTimes(1);
      expect(mockFetchChallenges).toHaveBeenCalledTimes(1);

      await act(async () => {
        resolveProfile();
        await Promise.resolve();
      });
    });

    it("passes the count of non-locked challenges as unlockedCount", async () => {
      mockChallenges([
        makeChallenge("structured-house", "started"),
        makeChallenge("sprouting-flower", "unlocked"),
        makeChallenge("rainbow-ball", "completed"),
        makeChallenge("checkerboard", "locked"),
        makeChallenge("acronym", "locked")
      ]);

      render(<ChallengesSidebar />);

      await screen.findByTestId("challenge-structured-house");
      const recent = screen.getByTestId("recent-challenges");
      expect(recent.getAttribute("data-unlocked")).toBe("3");
    });
  });

  describe("recentChallenges padding", () => {
    it("returns up to 3 active (started/unlocked) challenges when available", async () => {
      mockChallenges([
        makeChallenge("matching-socks", "started"),
        makeChallenge("tic-tac-toe", "started"),
        makeChallenge("sieve", "unlocked"),
        makeChallenge("cityscape-skyline", "unlocked"),
        makeChallenge("acronym", "locked"),
        makeChallenge("structured-house", "completed")
      ]);

      render(<ChallengesSidebar />);

      await screen.findByTestId("challenge-matching-socks");
      expect(screen.getByTestId("challenge-tic-tac-toe")).toBeInTheDocument();
      expect(screen.getByTestId("challenge-sieve")).toBeInTheDocument();
      expect(screen.queryByTestId("challenge-cityscape-skyline")).not.toBeInTheDocument();
      expect(screen.queryByTestId("challenge-acronym")).not.toBeInTheDocument();
      expect(screen.queryByTestId("challenge-structured-house")).not.toBeInTheDocument();
    });

    it("pads with completed challenges after active ones", async () => {
      mockChallenges([
        makeChallenge("matching-socks", "started"),
        makeChallenge("structured-house", "completed"),
        makeChallenge("sprouting-flower", "completed"),
        makeChallenge("rainbow-ball", "completed"),
        makeChallenge("acronym", "locked")
      ]);

      render(<ChallengesSidebar />);

      await screen.findByTestId("challenge-matching-socks");
      expect(screen.getByTestId("challenge-structured-house")).toBeInTheDocument();
      expect(screen.getByTestId("challenge-sprouting-flower")).toBeInTheDocument();
      expect(screen.queryByTestId("challenge-rainbow-ball")).not.toBeInTheDocument();
      expect(screen.queryByTestId("challenge-acronym")).not.toBeInTheDocument();
    });

    it("prefers completed over locked when both are available for padding", async () => {
      // Regression: previously the widget padded with locked before completed,
      // hiding recently-finished challenges behind locked-but-not-started ones.
      mockChallenges([
        makeChallenge("matching-socks", "started"),
        makeChallenge("acronym", "locked"),
        makeChallenge("caesar-cipher", "locked"),
        makeChallenge("structured-house", "completed")
      ]);

      render(<ChallengesSidebar />);

      await screen.findByTestId("challenge-matching-socks");
      expect(screen.getByTestId("challenge-structured-house")).toBeInTheDocument();
      expect(screen.getByTestId("challenge-acronym")).toBeInTheDocument();
      expect(screen.queryByTestId("challenge-caesar-cipher")).not.toBeInTheDocument();
    });

    it("pads with locked challenges after completed when fewer than 3 active+completed exist", async () => {
      mockChallenges([
        makeChallenge("matching-socks", "started"),
        makeChallenge("structured-house", "completed"),
        makeChallenge("acronym", "locked"),
        makeChallenge("caesar-cipher", "locked")
      ]);

      render(<ChallengesSidebar />);

      await screen.findByTestId("challenge-matching-socks");
      expect(screen.getByTestId("challenge-structured-house")).toBeInTheDocument();
      expect(screen.getByTestId("challenge-acronym")).toBeInTheDocument();
      expect(screen.queryByTestId("challenge-caesar-cipher")).not.toBeInTheDocument();
    });

    it("falls back to locked challenges only when nothing else exists", async () => {
      mockChallenges([
        makeChallenge("acronym", "locked"),
        makeChallenge("caesar-cipher", "locked"),
        makeChallenge("run-length-encoding", "locked"),
        makeChallenge("alien-detector", "locked")
      ]);

      render(<ChallengesSidebar />);

      await screen.findByTestId("challenge-acronym");
      expect(screen.getByTestId("challenge-caesar-cipher")).toBeInTheDocument();
      expect(screen.getByTestId("challenge-run-length-encoding")).toBeInTheDocument();
      expect(screen.queryByTestId("challenge-alien-detector")).not.toBeInTheDocument();
    });

    it("falls back to completed challenges only when nothing else exists", async () => {
      mockChallenges([
        makeChallenge("structured-house", "completed"),
        makeChallenge("sprouting-flower", "completed"),
        makeChallenge("rainbow-ball", "completed"),
        makeChallenge("checkerboard", "completed")
      ]);

      render(<ChallengesSidebar />);

      await screen.findByTestId("challenge-structured-house");
      expect(screen.getByTestId("challenge-sprouting-flower")).toBeInTheDocument();
      expect(screen.getByTestId("challenge-rainbow-ball")).toBeInTheDocument();
      expect(screen.queryByTestId("challenge-checkerboard")).not.toBeInTheDocument();
    });

    it("returns fewer than 3 if there aren't enough challenges of any status", async () => {
      mockChallenges([makeChallenge("matching-socks", "started"), makeChallenge("structured-house", "completed")]);

      render(<ChallengesSidebar />);

      await screen.findByTestId("challenge-matching-socks");
      expect(screen.getByTestId("challenge-structured-house")).toBeInTheDocument();
      expect(screen.queryByTestId("challenge-acronym")).not.toBeInTheDocument();
    });
  });
});
