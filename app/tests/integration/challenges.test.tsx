import ChallengesPage from "@/app/(app)/challenges/page";
import { fetchChallenges } from "@/lib/api/challenges";
import { render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn()
}));

jest.mock("@/lib/api/challenges", () => ({
  fetchChallenges: jest.fn()
}));

jest.mock("@/lib/auth/authStore", () => {
  const { createMockUser } = jest.requireActual("@/tests/mocks/user");
  const user = createMockUser({ membership_type: "premium" });
  const state = { isAuthenticated: true, hasCheckedAuth: true, user };
  return {
    useAuthStore: jest.fn((selector?: (s: typeof state) => unknown) => (selector ? selector(state) : state))
  };
});

jest.mock("@/components/layout/sidebar/Sidebar", () => {
  return function MockSidebar({ activeItem }: { activeItem: string }) {
    return (
      <div data-testid="sidebar">
        <nav>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/dashboard">Exercises</a>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/challenges" data-active={activeItem === "challenges"}>
            Challenges
          </a>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/blog">Blog</a>
        </nav>
      </div>
    );
  };
});

const mockRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockFetchChallenges = fetchChallenges as jest.MockedFunction<typeof fetchChallenges>;

describe("Challenges Integration", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn()
    });
  });

  it("should display challenges with different status states", async () => {
    const mockChallenges = {
      results: [
        {
          slug: "beginner-challenge",
          title: "Beginner Challenge",
          description: "Start here - learn the basics",
          status: "unlocked" as const
        },
        {
          slug: "intermediate-challenge",
          title: "Intermediate Challenge",
          description: "More challenging exercises",
          status: "started" as const
        },
        {
          slug: "advanced-challenge",
          title: "Advanced Challenge",
          description: "Complex algorithms and data structures",
          status: "completed" as const
        },
        {
          slug: "expert-challenge",
          title: "Expert Challenge",
          description: "Master-level challenges",
          status: "locked" as const
        }
      ],
      meta: {
        current_page: 1,
        total_count: 4,
        total_pages: 1
      }
    };

    mockFetchChallenges.mockResolvedValue(mockChallenges);

    render(<ChallengesPage />);

    // Wait for challenge content to load (accounts for deferred loading pattern)
    await waitFor(() => {
      expect(screen.getAllByText("Beginner Challenge")).toHaveLength(2); // One in hero, one in content
    });
    expect(screen.getAllByText("Intermediate Challenge")).toHaveLength(2);
    expect(screen.getAllByText("Advanced Challenge")).toHaveLength(2);
    expect(screen.getAllByText("Expert Challenge")).toHaveLength(2);

    // Check status badges (using updated display text)
    expect(screen.getAllByText("Not started").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("In Progress").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Completed").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Locked").length).toBeGreaterThanOrEqual(1);

    // Check that unlocked, started, and completed challenges are clickable
    const unlockedChallenge = screen.getAllByText("Beginner Challenge")[0].closest("a");
    const startedChallenge = screen.getAllByText("Intermediate Challenge")[0].closest("a");
    const completedChallenge = screen.getAllByText("Advanced Challenge")[0].closest("a");
    const lockedChallengeCard = screen.getAllByText("Expert Challenge")[0].closest("div")?.parentElement;

    expect(unlockedChallenge).toHaveAttribute("href", "/challenges/beginner-challenge");
    expect(startedChallenge).toHaveAttribute("href", "/challenges/intermediate-challenge");
    expect(completedChallenge).toHaveAttribute("href", "/challenges/advanced-challenge");

    // Locked challenge should not be a link (no <a> wrapper)
    expect(lockedChallengeCard).not.toHaveAttribute("href");
    // The locked styling is applied via CSS data-state="locked", not classes
  });

  it("should show active state in sidebar", async () => {
    mockFetchChallenges.mockResolvedValue({
      results: [],
      meta: {
        current_page: 1,
        total_count: 0,
        total_pages: 1
      }
    });

    render(<ChallengesPage />);

    await waitFor(() => {
      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    });

    const challengesLink = screen.getByRole("link", { name: "Challenges" });
    expect(challengesLink).toHaveAttribute("data-active", "true");
  });

  it("should handle retry on error", async () => {
    // Mock fetch to fail
    mockFetchChallenges.mockRejectedValueOnce(new Error("Network error"));

    render(<ChallengesPage />);

    await waitFor(() => {
      expect(screen.getByText("Error: Network error")).toBeInTheDocument();
    });

    // Retry button should be present
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("should maintain responsive grid layout", async () => {
    // Reset mocks to avoid interference from previous tests
    mockFetchChallenges.mockReset();

    const mockChallenges = {
      results: Array.from({ length: 6 }, (_, i) => ({
        slug: `challenge-${i + 1}`,
        title: `Challenge ${i + 1}`,
        description: `Description for challenge ${i + 1}`,
        status: "unlocked" as const
      })),
      meta: {
        current_page: 1,
        total_count: 6,
        total_pages: 1
      }
    };

    mockFetchChallenges.mockResolvedValue(mockChallenges);

    render(<ChallengesPage />);

    await waitFor(
      () => {
        expect(screen.getAllByText("Challenge 1")).toHaveLength(2); // One in hero, one in content
      },
      { timeout: 3000 }
    );

    // Check that the grid container has correct classes
    // The grid container should contain the challenge cards
    const gridContainer = screen.getAllByText("Challenge 1")[0].closest("a")?.parentElement;
    expect(gridContainer).toHaveClass("grid");
  });
});
