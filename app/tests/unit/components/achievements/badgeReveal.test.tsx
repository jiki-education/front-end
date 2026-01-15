import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
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
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("reveals badge when clicked and shows modal with onClose callback", async () => {
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

    // Verify badge has "new" class initially (unrevealed state shows as new)
    const badgeCard = badgeElement.closest("[data-type='achievement']");
    expect(badgeCard).toHaveClass("new");

    // Click the badge to reveal it
    fireEvent.click(badgeCard!);

    // Verify revealBadge API was called
    await waitFor(() => {
      expect(revealBadge).toHaveBeenCalledWith(42);
    });

    // Verify modal was shown with correct type for new badge and onClose callback
    expect(showModal).toHaveBeenCalledWith("flip-badge-modal", {
      badgeData: expect.objectContaining({
        title: "Test Badge",
        description: "A test badge for revealing",
        stat: "10 learners have earned this badge",
        isNew: true
      }),
      onClose: expect.any(Function)
    });

    // Get the onClose callback and simulate modal close
    const modalCall = (showModal as jest.Mock).mock.calls[0];
    const onCloseCallback = modalCall[1].onClose;

    // Simulate modal close which triggers spin animation
    act(() => {
      onCloseCallback();
    });

    // Badge should still have "new" class during spinning
    expect(badgeCard).toHaveClass("new");

    // Fast-forward time to complete the animation (1500ms)
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    // After animation completes, badge should no longer have "new" class
    await waitFor(() => {
      expect(badgeCard).not.toHaveClass("new");
    });
  });

  it("handles reveal API error gracefully and still shows modal", async () => {
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

    // Modal should still be shown even if reveal fails
    const { showModal } = await import("@/lib/modal");
    expect(showModal).toHaveBeenCalledWith(
      "flip-badge-modal",
      expect.objectContaining({
        badgeData: expect.objectContaining({
          isNew: true
        })
      })
    );

    consoleSpy.mockRestore();
  });

  it("shows NEW ribbon only after badge is revealed", async () => {
    const { fetchBadges, revealBadge } = await import("@/lib/api/badges");
    const { showModal } = await import("@/lib/modal");

    // Mock initial fetch with unrevealed badge
    (fetchBadges as jest.Mock).mockResolvedValueOnce({
      badges: [mockUnrevealedBadge],
      num_locked_secret_badges: 0
    });

    // Mock successful reveal
    (revealBadge as jest.Mock).mockResolvedValueOnce({
      badge: { ...mockUnrevealedBadge, revealed: true }
    });

    render(<AchievementsContent />);

    // Wait for badge to load
    const badgeElement = await screen.findByText("Test Badge");
    const badgeCard = badgeElement.closest("[data-type='achievement']");

    // NEW ribbon should NOT be visible for unrevealed badge
    expect(screen.queryByText("NEW")).not.toBeInTheDocument();

    // Click to reveal
    fireEvent.click(badgeCard!);

    await waitFor(() => {
      expect(showModal).toHaveBeenCalled();
    });

    // Get and execute the onClose callback
    const modalCall = (showModal as jest.Mock).mock.calls[0];
    const onCloseCallback = modalCall[1].onClose;

    act(() => {
      onCloseCallback();
    });

    // Fast-forward time to complete the animation (1500ms)
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    // After animation completes, NEW ribbon should appear
    await waitFor(() => {
      expect(screen.getByText("NEW")).toBeInTheDocument();
    });
  });
});
