import { render, screen } from "@testing-library/react";
import { AchievementsContent } from "@/app/(app)/achievements/AchievementsContent";
import type { BadgeData } from "@/lib/api/badges";

// Mock the API module
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
    name: "Member",
    slug: "member",
    description: "Welcome to Jiki!",
    state: "revealed",
    num_awardees: 100,
    unlocked_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "First Lesson",
    slug: "first-lesson",
    description: "Complete your first lesson",
    state: "unrevealed",
    num_awardees: 50,
    unlocked_at: "2024-01-02T00:00:00Z"
  },
  {
    id: 3,
    name: "Locked Badge",
    slug: "locked-badge",
    description: "This badge is locked",
    state: "locked",
    num_awardees: 25
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
    expect(screen.getByText("First Lesson")).toBeInTheDocument();
    expect(screen.getByText("Locked Badge")).toBeInTheDocument();

    // Check descriptions are rendered
    expect(screen.getByText("Welcome to Jiki!")).toBeInTheDocument();
    expect(screen.getByText("Complete your first lesson")).toBeInTheDocument();
    expect(screen.getByText("This badge is locked")).toBeInTheDocument();

    // Check that NEW badge has the new indicator
    const newBadge = screen.getByText("First Lesson").closest("[data-type='achievement']");
    expect(newBadge).toHaveClass("new");

    // Check that revealed badge doesn't have new class
    const revealedBadge = screen.getByText("Member").closest("[data-type='achievement']");
    expect(revealedBadge).not.toHaveClass("new");

    // Check that locked badge has locked class
    const lockedBadge = screen.getByText("Locked Badge").closest("[data-type='achievement']");
    expect(lockedBadge).toHaveClass("locked");
  });
});
