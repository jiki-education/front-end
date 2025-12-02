import { test, expect } from "@playwright/test";

test.describe("Scrubber Tooltip E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test/coding-exercise/scrubber-tooltip");
    await page.locator('[data-testid="scrubber"]').waitFor();
  });

  test.describe("Tooltip on code edit", () => {
    test("should show tooltip when code is edited", async ({ page }) => {
      // Initially, no tooltip should be visible
      const tooltipCount = await page.locator('[role="tooltip"]').count();
      expect(tooltipCount).toBe(0);

      // Click button to toggle code edited state
      await page.locator('[data-testid="toggle-code-edited"]').click();

      // Wait for state to update
      await expect(page.locator('[data-testid="code-edited-status"]')).toContainText("Yes");

      // Hover over the scrubber
      await page.locator('[data-testid="scrubber"]').hover();

      // Wait for tooltip to appear
      const tooltip = page.locator('[role="tooltip"]');
      await expect(tooltip).toBeVisible();

      // Check tooltip content
      await expect(tooltip).toContainText("Code has been edited");
      await expect(tooltip).toContainText("Run tests to re-enable");
    });
  });

  test.describe("Tooltip for insufficient frames", () => {
    test("should show tooltip when there are not enough frames", async ({ page }) => {
      // Click button to set single frame
      await page.locator('[data-testid="set-single-frame"]').click();

      // Wait for frame count to update
      await expect(page.locator('[data-testid="frames-count"]')).toContainText("1");

      // Hover over the scrubber
      await page.locator('[data-testid="scrubber"]').hover();

      // Wait for tooltip to appear
      const tooltip = page.locator('[role="tooltip"]');
      await expect(tooltip).toBeVisible();

      // Check tooltip content
      await expect(tooltip).toContainText("Not enough frames to scrub through");
    });
  });

  test.describe("Tooltip interaction", () => {
    test("should hide tooltip when mouse leaves scrubber", async ({ page }) => {
      // Click to set code as edited
      await page.locator('[data-testid="toggle-code-edited"]').click();
      await expect(page.locator('[data-testid="code-edited-status"]')).toContainText("Yes");

      // Hover to show tooltip
      await page.locator('[data-testid="scrubber"]').hover();
      await expect(page.locator('[role="tooltip"]')).toBeVisible();

      // Move mouse away
      await page.mouse.move(0, 0);

      // Wait for tooltip to disappear
      await expect(page.locator('[role="tooltip"]')).not.toBeVisible();
    });
  });
});
