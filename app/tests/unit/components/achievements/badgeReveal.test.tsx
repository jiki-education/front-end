import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

const mockUnrevealedBadge: BadgeData = {
  id: 42,
  name: "Test Badge",
  icon: "/test-icon.png",
  description: "A test badge for revealing",
  state: "unrevealed",
  num_awardees: 10,
  unlocked_at: "2024-01-01T00:00:00Z"
};

describe("Badge Reveal Functionality", () => {
  it("reveals badge when clicked and shows modal", async () => {
    const { fetchBadges, revealBadge } = await import("@/lib/api/badges");
    const { showModal } = await import("@/lib/modal");

    // Mock initial fetch with unrevealed badge
    (fetchBadges as jest.Mock).mockResolvedValueOnce({
      badges: [mockUnrevealedBadge],
      num_locked_secret_badges: 0
    });

    // Mock successful reveal response
    (revealBadge as jest.Mock).mockResolvedValueOnce({
      badge: {
        id: 42,
        name: "Test Badge",
        icon: "/test-icon.png",
        description: "A test badge for revealing",
        revealed: true,
        unlocked_at: "2024-01-01T00:00:00Z"
      }
    });

    render(<AchievementsContent />);

    // Wait for badge to load
    const badgeElement = await screen.findByText("Test Badge");
    expect(badgeElement).toBeInTheDocument();

    // Verify badge has "new" state initially
    const badgeCard = badgeElement.closest("[data-type='achievement']");
    expect(badgeCard).toHaveClass("new");

    // Click the badge to reveal it
    fireEvent.click(badgeCard!);

    // Verify revealBadge API was called
    await waitFor(() => {
      expect(revealBadge).toHaveBeenCalledWith(42);
    });

    // Verify modal was shown with correct type for new badge
    expect(showModal).toHaveBeenCalledWith("flip-badge-modal", {
      badgeData: expect.objectContaining({
        title: "Test Badge",
        description: "A test badge for revealing",
        stat: "10 learners have earned this badge",
        isNew: true
      })
    });

    // Verify badge no longer has "new" class after reveal
    await waitFor(() => {
      expect(badgeCard).not.toHaveClass("new");
    });
  });

  it("handles reveal API error gracefully", async () => {
    const { fetchBadges, revealBadge } = await import("@/lib/api/badges");

    // Mock initial fetch
    (fetchBadges as jest.Mock).mockResolvedValueOnce({
      badges: [mockUnrevealedBadge],
      num_locked_secret_badges: 0
    });

    // Mock API error
    (revealBadge as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

    // Spy on console.error
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<AchievementsContent />);

    // Wait for badge to load and click it
    const badgeElement = await screen.findByText("Test Badge");
    const badgeCard = badgeElement.closest("[data-type='achievement']");
    fireEvent.click(badgeCard!);

    // Verify error was logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Failed to reveal badge:", expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});
