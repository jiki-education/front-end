import { test, expect } from "@playwright/test";

test.describe("BreakpointStepper Buttons E2E", () => {
  // Warm up the page compilation before running tests in parallel
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto("/test/coding-exercise/breakpoint-stepper-buttons");
    await page.locator('[data-testid="breakpoint-stepper-container"]').waitFor();
    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/test/coding-exercise/breakpoint-stepper-buttons");
    // Wait for the page to be ready
    await page.locator('[data-testid="breakpoint-stepper-container"]').waitFor();
  });

  test.describe("Initial State", () => {
    test("should render with initial breakpoints and navigation state", async ({ page }) => {
      // Check initial breakpoints first (as suggested)
      await page.locator('[data-testid="breakpoints"]').waitFor();
      const breakpointsText = await page.locator('[data-testid="breakpoints"]').textContent();
      expect(breakpointsText).toBe("2, 4, 6");

      // Wait for the buttons
      await page.locator('button[aria-label="Previous breakpoint"]').waitFor();

      // Get the buttons
      const buttons = await page.locator('button[aria-label*="breakpoint"]').count();
      expect(buttons).toBe(2);

      // Check initial state - at frame 1, no prev breakpoint, next is line 2
      const currentFrame = await page.locator('[data-testid="current-frame"]').textContent();
      expect(currentFrame).toContain("Frame 1");

      const prevBreakpoint = await page.locator('[data-testid="prev-breakpoint"]').textContent();
      expect(prevBreakpoint).toContain("None");

      const nextBreakpoint = await page.locator('[data-testid="next-breakpoint"]').textContent();
      expect(nextBreakpoint).toContain("2");

      // Prev button should be disabled (no previous breakpoint)
      const prevButtonDisabled = await page.locator('button[aria-label="Previous breakpoint"]').isDisabled();
      expect(prevButtonDisabled).toBe(true);

      // Next button should be enabled (next breakpoint exists)
      const nextButtonDisabled = await page.locator('button[aria-label="Next breakpoint"]').isDisabled();
      expect(nextButtonDisabled).toBe(false);
    });
  });

  test.describe("Basic Navigation", () => {
    test("should navigate to next breakpoint", async ({ page }) => {
      await page.locator('button[aria-label="Previous breakpoint"]').waitFor();

      const nextButton = page.locator('button[aria-label="Next breakpoint"]');

      // Click next to go to line 2
      await nextButton.click();
      await page.waitForTimeout(100);

      let currentFrame = await page.locator('[data-testid="current-frame"]').textContent();
      expect(currentFrame).toContain("Frame 2");

      let frameLine = await page.locator('[data-testid="frame-line"]').textContent();
      expect(frameLine).toContain("Line: 2");

      // Click next to go to line 4
      await nextButton.click();
      await page.waitForTimeout(100);

      currentFrame = await page.locator('[data-testid="current-frame"]').textContent();
      expect(currentFrame).toContain("Frame 4");

      frameLine = await page.locator('[data-testid="frame-line"]').textContent();
      expect(frameLine).toContain("Line: 4");

      // Click next to go to line 6
      await nextButton.click();
      await page.waitForTimeout(100);

      currentFrame = await page.locator('[data-testid="current-frame"]').textContent();
      expect(currentFrame).toContain("Frame 6");

      frameLine = await page.locator('[data-testid="frame-line"]').textContent();
      expect(frameLine).toContain("Line: 6");
    });

    test("should navigate to previous breakpoint", async ({ page }) => {
      await page.locator('button[aria-label="Previous breakpoint"]').waitFor();

      // First navigate to line 6
      await page.locator('[data-testid="goto-frame-6"]').click();
      await page.waitForTimeout(100);

      const prevButton = page.locator('button[aria-label="Previous breakpoint"]');

      // Click prev to go to line 4
      await prevButton.click();
      await page.waitForTimeout(100);

      let currentFrame = await page.locator('[data-testid="current-frame"]').textContent();
      expect(currentFrame).toContain("Frame 4");

      // Click prev to go to line 2
      await prevButton.click();
      await page.waitForTimeout(100);

      currentFrame = await page.locator('[data-testid="current-frame"]').textContent();
      expect(currentFrame).toContain("Frame 2");

      // Now prev button should be disabled
      const prevButtonDisabled = await page.locator('button[aria-label="Previous breakpoint"]').isDisabled();
      expect(prevButtonDisabled).toBe(true);
    });
  });

  test.describe("Breakpoint Management", () => {
    test("should update navigation when breakpoints are added", async ({ page }) => {
      await page.locator('[data-testid="toggle-breakpoint-3"]').waitFor();

      // Start at frame 2
      await page.locator('[data-testid="goto-frame-2"]').click();
      await page.waitForTimeout(100);

      // Initially next breakpoint is line 4
      let nextBreakpoint = await page.locator('[data-testid="next-breakpoint"]').textContent();
      expect(nextBreakpoint).toContain("4");

      // Add breakpoint at line 3
      await page.locator('[data-testid="toggle-breakpoint-3"]').click();
      await page.waitForTimeout(100);

      // Now next breakpoint should be line 3
      nextBreakpoint = await page.locator('[data-testid="next-breakpoint"]').textContent();
      expect(nextBreakpoint).toContain("3");

      // Navigate to line 3
      const nextButton = page.locator('button[aria-label="Next breakpoint"]');
      await nextButton.click();
      await page.waitForTimeout(100);

      const currentFrame = await page.locator('[data-testid="current-frame"]').textContent();
      expect(currentFrame).toContain("Frame 3");
    });

    test("should update navigation when breakpoints are removed", async ({ page }) => {
      await page.locator('[data-testid="toggle-breakpoint-4"]').waitFor();

      // Start at frame 2
      await page.locator('[data-testid="goto-frame-2"]').click();
      await page.waitForTimeout(100);

      // Initially next breakpoint is line 4
      let nextBreakpoint = await page.locator('[data-testid="next-breakpoint"]').textContent();
      expect(nextBreakpoint).toContain("4");

      // Remove breakpoint at line 4
      await page.locator('[data-testid="toggle-breakpoint-4"]').click();
      await page.waitForTimeout(100);

      // Now next breakpoint should be line 6
      nextBreakpoint = await page.locator('[data-testid="next-breakpoint"]').textContent();
      expect(nextBreakpoint).toContain("6");
    });

    test("should handle clearing all breakpoints", async ({ page }) => {
      await page.locator('[data-testid="clear-breakpoints"]').waitFor();

      // Verify breakpoints exist initially
      let breakpointsText = await page.locator('[data-testid="breakpoints"]').textContent();
      expect(breakpointsText).not.toBe("None");

      // Clear all breakpoints
      await page.locator('[data-testid="clear-breakpoints"]').click();
      await page.waitForTimeout(100);

      // Verify breakpoints are cleared
      breakpointsText = await page.locator('[data-testid="breakpoints"]').textContent();
      expect(breakpointsText).toBe("None");

      // Buttons should not be visible when no breakpoints
      const buttons = await page.locator('button[aria-label*="breakpoint"]').count();
      expect(buttons).toBe(0);
    });

    test("should handle setting all breakpoints", async ({ page }) => {
      await page.locator('[data-testid="set-all-breakpoints"]').waitFor();

      // Set all breakpoints
      await page.locator('[data-testid="set-all-breakpoints"]').click();
      await page.waitForTimeout(100);

      // Verify all lines have breakpoints
      const breakpointsText = await page.locator('[data-testid="breakpoints"]').textContent();
      expect(breakpointsText).toBe("1, 2, 3, 4, 5, 6, 7, 8");

      // From line 1, next should be line 2
      const nextBreakpoint = await page.locator('[data-testid="next-breakpoint"]').textContent();
      expect(nextBreakpoint).toContain("2");

      // Navigate should go through every frame
      const nextButton = page.locator('button[aria-label="Next breakpoint"]');

      for (let i = 2; i <= 8; i++) {
        await nextButton.click();
        await page.waitForTimeout(100);

        const frameLine = await page.locator('[data-testid="frame-line"]').textContent();
        expect(frameLine).toContain(`Line: ${i}`);
      }
    });
  });

  test.describe("Folded Lines Integration", () => {
    test("should skip folded breakpoints when navigating forward", async ({ page }) => {
      await page.locator('[data-testid="toggle-fold-2"]').waitFor();

      // Fold line 2
      await page.locator('[data-testid="toggle-fold-2"]').click();
      await page.waitForTimeout(100);

      // Verify line 2 is folded
      const foldedLines = await page.locator('[data-testid="folded-lines"]').textContent();
      expect(foldedLines).toContain("2");

      // From line 1, next breakpoint should skip line 2 and go to line 4
      const nextBreakpoint = await page.locator('[data-testid="next-breakpoint"]').textContent();
      expect(nextBreakpoint).toContain("4");

      // Navigate with next button
      const nextButton = page.locator('button[aria-label="Next breakpoint"]');
      await nextButton.click();
      await page.waitForTimeout(100);

      // Should be at line 4, skipping line 2
      const frameLine = await page.locator('[data-testid="frame-line"]').textContent();
      expect(frameLine).toContain("Line: 4");
    });

    test("should skip folded breakpoints when navigating backward", async ({ page }) => {
      await page.locator('[data-testid="toggle-fold-4"]').waitFor();

      // Navigate to line 6
      await page.locator('[data-testid="goto-frame-6"]').click();
      await page.waitForTimeout(100);

      // Fold line 4
      await page.locator('[data-testid="toggle-fold-4"]').click();
      await page.waitForTimeout(100);

      // From line 6, prev breakpoint should skip line 4 and go to line 2
      const prevBreakpoint = await page.locator('[data-testid="prev-breakpoint"]').textContent();
      expect(prevBreakpoint).toContain("2");

      // Navigate with prev button
      const prevButton = page.locator('button[aria-label="Previous breakpoint"]');
      await prevButton.click();
      await page.waitForTimeout(100);

      // Should be at line 2, skipping line 4
      const frameLine = await page.locator('[data-testid="frame-line"]').textContent();
      expect(frameLine).toContain("Line: 2");
    });

    test("should update navigation when lines are unfolded", async ({ page }) => {
      await page.locator('[data-testid="toggle-fold-4"]').waitFor();

      // Fold line 4
      await page.locator('[data-testid="toggle-fold-4"]').click();
      await page.waitForTimeout(100);

      // Navigate to line 2
      await page.locator('[data-testid="goto-frame-2"]').click();
      await page.waitForTimeout(100);

      // Next breakpoint should be line 6 (skipping folded line 4)
      let nextBreakpoint = await page.locator('[data-testid="next-breakpoint"]').textContent();
      expect(nextBreakpoint).toContain("6");

      // Unfold line 4
      await page.locator('[data-testid="toggle-fold-4"]').click();
      await page.waitForTimeout(100);

      // Now next breakpoint should be line 4
      nextBreakpoint = await page.locator('[data-testid="next-breakpoint"]').textContent();
      expect(nextBreakpoint).toContain("4");
    });

    test("should disable buttons when all breakpoints are folded", async ({ page }) => {
      await page.locator('[data-testid="toggle-fold-2"]').waitFor();

      // Fold all breakpoint lines
      await page.locator('[data-testid="toggle-fold-2"]').click();
      await page.locator('[data-testid="toggle-fold-4"]').click();
      await page.locator('[data-testid="toggle-fold-6"]').click();
      await page.waitForTimeout(100);

      // Both navigation breakpoints should be None
      const prevBreakpoint = await page.locator('[data-testid="prev-breakpoint"]').textContent();
      expect(prevBreakpoint).toContain("None");

      const nextBreakpoint = await page.locator('[data-testid="next-breakpoint"]').textContent();
      expect(nextBreakpoint).toContain("None");

      // Both buttons should be disabled
      const prevButtonDisabled = await page.locator('button[aria-label="Previous breakpoint"]').isDisabled();
      expect(prevButtonDisabled).toBe(true);

      const nextButtonDisabled = await page.locator('button[aria-label="Next breakpoint"]').isDisabled();
      expect(nextButtonDisabled).toBe(true);
    });
  });

  test.describe("Complex Scenarios", () => {
    test("should handle navigation with mixed breakpoints and folds", async ({ page }) => {
      await page.locator('[data-testid="set-all-breakpoints"]').waitFor();

      // Set all breakpoints
      await page.locator('[data-testid="set-all-breakpoints"]').click();
      await page.waitForTimeout(100);

      // Fold lines 3, 5, 7
      await page.locator('[data-testid="toggle-fold-3"]').click();
      await page.locator('[data-testid="toggle-fold-5"]').click();
      await page.locator('[data-testid="toggle-fold-7"]').click();
      await page.waitForTimeout(100);

      const nextButton = page.locator('button[aria-label="Next breakpoint"]');

      // Navigate forward - should visit 1 -> 2 -> 4 -> 6 -> 8
      const expectedSequence = [2, 4, 6, 8];

      for (const expectedLine of expectedSequence) {
        await nextButton.click();
        await page.waitForTimeout(100);

        const frameLine = await page.locator('[data-testid="frame-line"]').textContent();
        expect(frameLine).toContain(`Line: ${expectedLine}`);
      }

      // Navigate back
      const prevButton = page.locator('button[aria-label="Previous breakpoint"]');
      const reverseSequence = [6, 4, 2, 1];

      for (const expectedLine of reverseSequence) {
        await prevButton.click();
        await page.waitForTimeout(100);

        const frameLine = await page.locator('[data-testid="frame-line"]').textContent();
        expect(frameLine).toContain(`Line: ${expectedLine}`);
      }
    });

    test("should maintain button state during rapid navigation", async ({ page }) => {
      await page.locator('button[aria-label="Previous breakpoint"]').waitFor();

      const nextButton = page.locator('button[aria-label="Next breakpoint"]');
      const prevButton = page.locator('button[aria-label="Previous breakpoint"]');

      // Navigate to line 2 (first breakpoint)
      await page.locator('[data-testid="goto-frame-2"]').click();
      await page.waitForTimeout(100);

      // Prev should be disabled (at first breakpoint), next should be enabled
      let prevDisabled = await prevButton.isDisabled();
      let nextDisabled = await nextButton.isDisabled();
      expect(prevDisabled).toBe(true);
      expect(nextDisabled).toBe(false);

      // Click next twice rapidly to go from line 2 -> 4 -> 6
      await nextButton.click();
      await page.waitForTimeout(100); // Wait for first navigation to complete
      await nextButton.click();
      await page.waitForTimeout(200);

      // Should be at last breakpoint (line 6)
      const frameLine = await page.locator('[data-testid="frame-line"]').textContent();
      expect(frameLine).toContain("Line: 6");

      // Next should be disabled, prev enabled
      prevDisabled = await prevButton.isDisabled();
      nextDisabled = await nextButton.isDisabled();
      expect(prevDisabled).toBe(false);
      expect(nextDisabled).toBe(true);
    });

    test("should handle navigation when current position is between breakpoints", async ({ page }) => {
      await page.locator('[data-testid="goto-frame-3"]').waitFor();

      // Navigate to line 3 (not a breakpoint initially)
      await page.locator('[data-testid="goto-frame-3"]').click();
      await page.waitForTimeout(100);

      // Prev breakpoint should be line 2, next should be line 4
      const prevBreakpoint = await page.locator('[data-testid="prev-breakpoint"]').textContent();
      const nextBreakpoint = await page.locator('[data-testid="next-breakpoint"]').textContent();
      expect(prevBreakpoint).toContain("2");
      expect(nextBreakpoint).toContain("4");

      // Navigate to prev breakpoint
      const prevButton = page.locator('button[aria-label="Previous breakpoint"]');
      await prevButton.click();
      await page.waitForTimeout(100);

      const frameLine = await page.locator('[data-testid="frame-line"]').textContent();
      expect(frameLine).toContain("Line: 2");
    });
  });

  test.describe("Button States", () => {
    test("should properly enable/disable buttons at boundaries", async ({ page }) => {
      await page.locator('button[aria-label="Previous breakpoint"]').waitFor();

      // At first frame - prev disabled, next enabled
      let prevDisabled = await page.locator('button[aria-label="Previous breakpoint"]').isDisabled();
      let nextDisabled = await page.locator('button[aria-label="Next breakpoint"]').isDisabled();
      expect(prevDisabled).toBe(true);
      expect(nextDisabled).toBe(false);

      // Navigate to last breakpoint (line 6)
      await page.locator('[data-testid="goto-frame-6"]').click();
      await page.waitForTimeout(100);

      // At last breakpoint - prev enabled, next disabled
      prevDisabled = await page.locator('button[aria-label="Previous breakpoint"]').isDisabled();
      nextDisabled = await page.locator('button[aria-label="Next breakpoint"]').isDisabled();
      expect(prevDisabled).toBe(false);
      expect(nextDisabled).toBe(true);

      // Navigate to middle breakpoint (line 4)
      await page.locator('[data-testid="goto-frame-4"]').click();
      await page.waitForTimeout(100);

      // In middle - both enabled
      prevDisabled = await page.locator('button[aria-label="Previous breakpoint"]').isDisabled();
      nextDisabled = await page.locator('button[aria-label="Next breakpoint"]').isDisabled();
      expect(prevDisabled).toBe(false);
      expect(nextDisabled).toBe(false);
    });
  });
});
