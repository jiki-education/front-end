import ChallengesSidebar from "@/components/dashboard/challenges-sidebar/ChallengesSidebar";
import { fetchBadges } from "@/lib/api/badges";
import { fetchChallenges, type ChallengeData, type ChallengeStatus } from "@/lib/api/challenges";
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
  RecentChallenges: ({ challenges, unlockedCount }: { challenges: ChallengeData[]; unlockedCount: number }) => (
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

function makeChallenge(slug: string, status: ChallengeStatus): ChallengeData {
  return { slug, title: slug, description: `${slug} desc`, status };
}

function mockChallenges(list: ChallengeData[]) {
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
        makeChallenge("a", "started"),
        makeChallenge("b", "unlocked"),
        makeChallenge("c", "completed"),
        makeChallenge("d", "locked"),
        makeChallenge("e", "locked")
      ]);

      render(<ChallengesSidebar />);

      await screen.findByTestId("challenge-a");
      const recent = screen.getByTestId("recent-challenges");
      expect(recent.getAttribute("data-unlocked")).toBe("3");
    });
  });

  describe("recentChallenges padding", () => {
    it("returns up to 3 active (started/unlocked) challenges when available", async () => {
      mockChallenges([
        makeChallenge("s1", "started"),
        makeChallenge("s2", "started"),
        makeChallenge("u1", "unlocked"),
        makeChallenge("u2", "unlocked"),
        makeChallenge("l1", "locked"),
        makeChallenge("c1", "completed")
      ]);

      render(<ChallengesSidebar />);

      await screen.findByTestId("challenge-s1");
      expect(screen.getByTestId("challenge-s2")).toBeInTheDocument();
      expect(screen.getByTestId("challenge-u1")).toBeInTheDocument();
      expect(screen.queryByTestId("challenge-u2")).not.toBeInTheDocument();
      expect(screen.queryByTestId("challenge-l1")).not.toBeInTheDocument();
      expect(screen.queryByTestId("challenge-c1")).not.toBeInTheDocument();
    });

    it("pads with completed challenges after active ones", async () => {
      mockChallenges([
        makeChallenge("s1", "started"),
        makeChallenge("c1", "completed"),
        makeChallenge("c2", "completed"),
        makeChallenge("c3", "completed"),
        makeChallenge("l1", "locked")
      ]);

      render(<ChallengesSidebar />);

      await screen.findByTestId("challenge-s1");
      expect(screen.getByTestId("challenge-c1")).toBeInTheDocument();
      expect(screen.getByTestId("challenge-c2")).toBeInTheDocument();
      expect(screen.queryByTestId("challenge-c3")).not.toBeInTheDocument();
      expect(screen.queryByTestId("challenge-l1")).not.toBeInTheDocument();
    });

    it("prefers completed over locked when both are available for padding", async () => {
      // Regression: previously the widget padded with locked before completed,
      // hiding recently-finished challenges behind locked-but-not-started ones.
      mockChallenges([
        makeChallenge("s1", "started"),
        makeChallenge("l1", "locked"),
        makeChallenge("l2", "locked"),
        makeChallenge("c1", "completed")
      ]);

      render(<ChallengesSidebar />);

      await screen.findByTestId("challenge-s1");
      expect(screen.getByTestId("challenge-c1")).toBeInTheDocument();
      expect(screen.getByTestId("challenge-l1")).toBeInTheDocument();
      expect(screen.queryByTestId("challenge-l2")).not.toBeInTheDocument();
    });

    it("pads with locked challenges after completed when fewer than 3 active+completed exist", async () => {
      mockChallenges([
        makeChallenge("s1", "started"),
        makeChallenge("c1", "completed"),
        makeChallenge("l1", "locked"),
        makeChallenge("l2", "locked")
      ]);

      render(<ChallengesSidebar />);

      await screen.findByTestId("challenge-s1");
      expect(screen.getByTestId("challenge-c1")).toBeInTheDocument();
      expect(screen.getByTestId("challenge-l1")).toBeInTheDocument();
      expect(screen.queryByTestId("challenge-l2")).not.toBeInTheDocument();
    });

    it("falls back to locked challenges only when nothing else exists", async () => {
      mockChallenges([
        makeChallenge("l1", "locked"),
        makeChallenge("l2", "locked"),
        makeChallenge("l3", "locked"),
        makeChallenge("l4", "locked")
      ]);

      render(<ChallengesSidebar />);

      await screen.findByTestId("challenge-l1");
      expect(screen.getByTestId("challenge-l2")).toBeInTheDocument();
      expect(screen.getByTestId("challenge-l3")).toBeInTheDocument();
      expect(screen.queryByTestId("challenge-l4")).not.toBeInTheDocument();
    });

    it("falls back to completed challenges only when nothing else exists", async () => {
      mockChallenges([
        makeChallenge("c1", "completed"),
        makeChallenge("c2", "completed"),
        makeChallenge("c3", "completed"),
        makeChallenge("c4", "completed")
      ]);

      render(<ChallengesSidebar />);

      await screen.findByTestId("challenge-c1");
      expect(screen.getByTestId("challenge-c2")).toBeInTheDocument();
      expect(screen.getByTestId("challenge-c3")).toBeInTheDocument();
      expect(screen.queryByTestId("challenge-c4")).not.toBeInTheDocument();
    });

    it("returns fewer than 3 if there aren't enough challenges of any status", async () => {
      mockChallenges([makeChallenge("s1", "started"), makeChallenge("c1", "completed")]);

      render(<ChallengesSidebar />);

      await screen.findByTestId("challenge-s1");
      expect(screen.getByTestId("challenge-c1")).toBeInTheDocument();
      expect(screen.queryByTestId("challenge-l1")).not.toBeInTheDocument();
    });
  });
});
