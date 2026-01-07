import { test, expect } from "@playwright/test";

test.describe("Badge Reveal E2E", () => {
  test("reveals an unrevealed badge when clicked", async ({ page }) => {
    // Navigate to achievements page
    await page.goto("/achievements");

    // Wait for badges to load
    await page.locator('[data-type="achievement"]').first().waitFor();

    // Find an unrevealed badge (has "new" class)
    const unrevealedBadge = page.locator('[data-type="achievement"].new').first();

    // Click to reveal the badge
    await unrevealedBadge.click();

    // Verify the flip modal appears
    await page.locator('[data-modal="flip-badge-modal"]').waitFor();

    // Close modal (click backdrop or close button)
    await page.locator('[data-modal="flip-badge-modal"]').click();

    // Verify badge no longer has "new" class after reveal
    await expect(unrevealedBadge).not.toHaveClass(/new/);
  });
});
