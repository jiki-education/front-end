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
    return <div data-testid="sidebar">Sidebar - {activeItem}</div>;
  };
});

const mockRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockFetchChallenges = fetchChallenges as jest.MockedFunction<typeof fetchChallenges>;

describe("ChallengesPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockRouter.mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn()
    });
  });

  it("should render challenges page with sidebar", async () => {
    const mockChallenges = {
      results: [
        {
          slug: "challenge-1",
          title: "Challenge 1",
          description: "First challenge",
          status: "unlocked" as const
        },
        {
          slug: "challenge-2",
          title: "Challenge 2",
          description: "Second challenge",
          status: "locked" as const
        }
      ],
      meta: {
        current_page: 1,
        total_count: 2,
        total_pages: 1
      }
    };

    mockFetchChallenges.mockResolvedValue(mockChallenges);

    render(<ChallengesPage />);

    // Wait for challenge content to load (accounts for deferred loading pattern)
    await waitFor(() => {
      expect(screen.getAllByText("Challenge 1")).toHaveLength(2); // One in hero, one in content
    });

    expect(screen.getByTestId("sidebar")).toHaveTextContent("Sidebar - challenges");
    expect(screen.getByText(/Build real applications and games to practice your coding skills/)).toBeInTheDocument();
    expect(screen.getAllByText("Challenge 2")).toHaveLength(2);
  });

  it("should show message when no challenges available", async () => {
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
      expect(screen.getByText("No challenges available yet.")).toBeInTheDocument();
    });
  });

  it("should show error state when fetch fails", async () => {
    mockFetchChallenges.mockRejectedValue(new Error("Failed to fetch"));

    render(<ChallengesPage />);

    await waitFor(() => {
      expect(screen.getByText("Error: Failed to fetch")).toBeInTheDocument();
    });

    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("should render locked challenge as disabled", async () => {
    const mockChallenges = {
      results: [
        {
          slug: "locked-challenge",
          title: "Locked Challenge",
          description: "This challenge is locked",
          status: "locked" as const
        }
      ],
      meta: {
        current_page: 1,
        total_count: 1,
        total_pages: 1
      }
    };

    mockFetchChallenges.mockResolvedValue(mockChallenges);

    render(<ChallengesPage />);

    await waitFor(() => {
      expect(screen.getAllByText("Locked Challenge")).toHaveLength(2); // One in hero, one in content
    });

    // The locked challenge should not be wrapped in a link
    const challengeCard = screen.getAllByText("Locked Challenge")[0].closest("div");
    expect(challengeCard).not.toHaveAttribute("href");
  });

  it("should render unlocked challenge as clickable", async () => {
    const mockChallenges = {
      results: [
        {
          slug: "unlocked-challenge",
          title: "Unlocked Challenge",
          description: "This challenge is unlocked",
          status: "unlocked" as const
        }
      ],
      meta: {
        current_page: 1,
        total_count: 1,
        total_pages: 1
      }
    };

    mockFetchChallenges.mockResolvedValue(mockChallenges);

    render(<ChallengesPage />);

    await waitFor(() => {
      expect(screen.getAllByText("Unlocked Challenge")).toHaveLength(2); // One in hero, one in content
    });

    const link = screen
      .getAllByRole("link")
      .find((link) => link.getAttribute("href") === "/challenges/unlocked-challenge");
    expect(link).toHaveAttribute("href", "/challenges/unlocked-challenge");
  });
});
