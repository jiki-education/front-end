import { render, screen, waitFor } from "@testing-library/react";
import { AchievementsContent } from "@/app/(app)/achievements/AchievementsContent";
import type { BadgeData } from "@/lib/api/badges";
import { RequestAbortedError } from "@/lib/api/client";

// Mock the API module
jest.mock("@/lib/api/curriculum-copy", () => {
  const actual = jest.requireActual("@/lib/api/curriculum-copy");
  return {
    ...actual,
    fetchBadgeCopy: jest.fn().mockResolvedValue({
      member: { name: "Member", description: "Welcome to Jiki!", funFact: "First badge ever" },
      "first-lesson": { name: "First Lesson", description: "Complete your first lesson", funFact: "Day one" },
      "locked-badge": { name: "Locked Badge", description: "This badge is locked", funFact: "Rare" }
    })
  };
});

jest.mock("@/lib/api/badges", () => ({
  fetchBadges: jest.fn(),
  revealBadge: jest.fn()
}));

// Mock the modal module
jest.mock("@/lib/modal", () => ({
  showModal: jest.fn()
}));

const mockBadges: BadgeData[] = [
  {
    id: 1,
    slug: "member",
    state: "revealed",
    unlocked_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    slug: "first-lesson",
    state: "unrevealed",
    unlocked_at: "2024-01-02T00:00:00Z"
  },
  {
    id: 3,
    slug: "locked-badge",
    state: "locked"
  }
];

describe("AchievementsContent", () => {
  it("renders correct badges with proper states", async () => {
    const { fetchBadges } = await import("@/lib/api/badges");

    // Mock successful API response
    (fetchBadges as jest.Mock).mockResolvedValueOnce({
      badges: mockBadges,
      num_locked_secret_badges: 2
    });

    render(<AchievementsContent />);

    // Wait for loading to finish and badges to render
    expect(await screen.findByText("Member")).toBeInTheDocument();
    expect(screen.getAllByText("First Lesson")[0]).toBeInTheDocument();
    expect(screen.getByText("Locked Badge")).toBeInTheDocument();

    // Check descriptions are rendered
    expect(screen.getByText("Welcome to Jiki!")).toBeInTheDocument();
    expect(screen.getAllByText("Complete your first lesson")[0]).toBeInTheDocument();
    expect(screen.getByText("This badge is locked")).toBeInTheDocument();

    // Check that NEW badge has the new indicator
    const newBadge = screen.getAllByText("First Lesson")[0].closest("[data-type='achievement']");
    expect(newBadge).toHaveClass("new");

    // Check that revealed badge doesn't have new class
    const revealedBadge = screen.getByText("Member").closest("[data-type='achievement']");
    expect(revealedBadge).not.toHaveClass("new");

    // Check that locked badge has locked class
    const lockedBadge = screen.getByText("Locked Badge").closest("[data-type='achievement']");
    expect(lockedBadge).toHaveClass("locked");
  });

  it("does not show the error state when the request is aborted (user navigated away)", async () => {
    const { fetchBadges } = await import("@/lib/api/badges");
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

    (fetchBadges as jest.Mock).mockRejectedValueOnce(new RequestAbortedError());

    render(<AchievementsContent />);

    // Loading resolves, but no error message is shown and nothing is logged - aborts are benign.
    await waitFor(() => expect(screen.queryByText(/Error:/)).not.toBeInTheDocument());
    expect(consoleError).not.toHaveBeenCalled();

    consoleError.mockRestore();
  });
});
