describe("BreakpointStepper Buttons E2E", () => {
  beforeEach(async () => {
    await page.goto("http://localhost:3070/test/coding-exercise/breakpoint-stepper-buttons");
    // Wait for the page to be ready
    await page.waitForSelector('[data-testid="breakpoint-stepper-container"]', { timeout: 5000 });
  }, 20000);

  describe("Initial State", () => {
    it("should render with initial breakpoints and navigation state", async () => {
      // Wait for basic page elements first
      await page.waitForSelector("body");

      // Check initial breakpoints first (as suggested)
      await page.waitForSelector('[data-testid="breakpoints"]', { timeout: 3000 });
      const breakpointsText = await page.$eval('[data-testid="breakpoints"]', (el) => el.textContent);
      expect(breakpointsText).toBe("2, 4, 6");

      // Now wait for the container
      await page.waitForSelector('[data-testid="breakpoint-stepper-container"]', { timeout: 3000 });

      // Wait for the buttons
      await page.waitForSelector('[data-testid="breakpoint-stepper-buttons"]', { timeout: 3000 });

      // Get the buttons
      const buttons = await page.$$('[data-testid="breakpoint-stepper-buttons"] button');
      expect(buttons).toHaveLength(2);

      // Check initial state - at frame 1, no prev breakpoint, next is line 2
      const currentFrame = await page.$eval('[data-testid="current-frame"]', (el) => el.textContent);
      expect(currentFrame).toContain("Frame 1");

      const prevBreakpoint = await page.$eval('[data-testid="prev-breakpoint"]', (el) => el.textContent);
      expect(prevBreakpoint).toContain("None");

      const nextBreakpoint = await page.$eval('[data-testid="next-breakpoint"]', (el) => el.textContent);
      expect(nextBreakpoint).toContain("2");

      // Prev button should be disabled (no previous breakpoint)
      const prevButtonDisabled = await page.$eval(
        '[data-testid="breakpoint-stepper-buttons"] button[aria-label="Previous breakpoint"]',
        (el) => el.hasAttribute("disabled")
      );
      expect(prevButtonDisabled).toBe(true);

      // Next button should be enabled (next breakpoint exists)
      const nextButtonDisabled = await page.$eval(
        '[data-testid="breakpoint-stepper-buttons"] button[aria-label="Next breakpoint"]',
        (el) => el.hasAttribute("disabled")
      );
      expect(nextButtonDisabled).toBe(false);
    });
  });

  describe("Basic Navigation", () => {
    it("should navigate to next breakpoint", async () => {
      await page.waitForSelector('[data-testid="breakpoint-stepper-buttons"]');

      const nextButton = await page.$(
        '[data-testid="breakpoint-stepper-buttons"] button[aria-label="Next breakpoint"]'
      );

      // Click next to go to line 2
      await nextButton?.click();
      await new Promise((resolve) => setTimeout(resolve, 100));

      let currentFrame = await page.$eval('[data-testid="current-frame"]', (el) => el.textContent);
      expect(currentFrame).toContain("Frame 2");

      let frameLine = await page.$eval('[data-testid="frame-line"]', (el) => el.textContent);
      expect(frameLine).toContain("Line: 2");

      // Click next to go to line 4
      await nextButton?.click();
      await new Promise((resolve) => setTimeout(resolve, 100));

      currentFrame = await page.$eval('[data-testid="current-frame"]', (el) => el.textContent);
      expect(currentFrame).toContain("Frame 4");

      frameLine = await page.$eval('[data-testid="frame-line"]', (el) => el.textContent);
      expect(frameLine).toContain("Line: 4");

      // Click next to go to line 6
      await nextButton?.click();
      await new Promise((resolve) => setTimeout(resolve, 100));

      currentFrame = await page.$eval('[data-testid="current-frame"]', (el) => el.textContent);
      expect(currentFrame).toContain("Frame 6");

      frameLine = await page.$eval('[data-testid="frame-line"]', (el) => el.textContent);
      expect(frameLine).toContain("Line: 6");
    });

    it("should navigate to previous breakpoint", async () => {
      await page.waitForSelector('[data-testid="breakpoint-stepper-buttons"]');

      // First navigate to line 6
      await page.click('[data-testid="goto-frame-6"]');
      await new Promise((resolve) => setTimeout(resolve, 100));

      const prevButton = await page.$(
        '[data-testid="breakpoint-stepper-buttons"] button[aria-label="Previous breakpoint"]'
      );

      // Click prev to go to line 4
      await prevButton?.click();
      await new Promise((resolve) => setTimeout(resolve, 100));

      let currentFrame = await page.$eval('[data-testid="current-frame"]', (el) => el.textContent);
      expect(currentFrame).toContain("Frame 4");

      // Click prev to go to line 2
      await prevButton?.click();
      await new Promise((resolve) => setTimeout(resolve, 100));

      currentFrame = await page.$eval('[data-testid="current-frame"]', (el) => el.textContent);
      expect(currentFrame).toContain("Frame 2");

      // Now prev button should be disabled
      const prevButtonDisabled = await page.$eval(
        '[data-testid="breakpoint-stepper-buttons"] button[aria-label="Previous breakpoint"]',
        (el) => el.hasAttribute("disabled")
      );
      expect(prevButtonDisabled).toBe(true);
    });
  });

  describe("Breakpoint Management", () => {
    it("should update navigation when breakpoints are added", async () => {
      await page.waitForSelector('[data-testid="toggle-breakpoint-3"]');

      // Start at frame 2
      await page.click('[data-testid="goto-frame-2"]');
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Initially next breakpoint is line 4
      let nextBreakpoint = await page.$eval('[data-testid="next-breakpoint"]', (el) => el.textContent);
      expect(nextBreakpoint).toContain("4");

      // Add breakpoint at line 3
      await page.click('[data-testid="toggle-breakpoint-3"]');
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Now next breakpoint should be line 3
      nextBreakpoint = await page.$eval('[data-testid="next-breakpoint"]', (el) => el.textContent);
      expect(nextBreakpoint).toContain("3");

      // Navigate to line 3
      const nextButton = await page.$(
        '[data-testid="breakpoint-stepper-buttons"] button[aria-label="Next breakpoint"]'
      );
      await nextButton?.click();
      await new Promise((resolve) => setTimeout(resolve, 100));

      const currentFrame = await page.$eval('[data-testid="current-frame"]', (el) => el.textContent);
      expect(currentFrame).toContain("Frame 3");
    });

    it("should update navigation when breakpoints are removed", async () => {
      await page.waitForSelector('[data-testid="toggle-breakpoint-4"]');

      // Start at frame 2
      await page.click('[data-testid="goto-frame-2"]');
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Initially next breakpoint is line 4
      let nextBreakpoint = await page.$eval('[data-testid="next-breakpoint"]', (el) => el.textContent);
      expect(nextBreakpoint).toContain("4");

      // Remove breakpoint at line 4
      await page.click('[data-testid="toggle-breakpoint-4"]');
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Now next breakpoint should be line 6
      nextBreakpoint = await page.$eval('[data-testid="next-breakpoint"]', (el) => el.textContent);
      expect(nextBreakpoint).toContain("6");
    });

    it("should handle clearing all breakpoints", async () => {
      await page.waitForSelector('[data-testid="clear-breakpoints"]');

      // Verify breakpoints exist initially
      let breakpointsText = await page.$eval('[data-testid="breakpoints"]', (el) => el.textContent);
      expect(breakpointsText).not.toBe("None");

      // Clear all breakpoints
      await page.click('[data-testid="clear-breakpoints"]');
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify breakpoints are cleared
      breakpointsText = await page.$eval('[data-testid="breakpoints"]', (el) => el.textContent);
      expect(breakpointsText).toBe("None");

      // Buttons should not be visible when no breakpoints
      const buttons = await page.$$('[data-testid="breakpoint-stepper-buttons"] button');
      expect(buttons).toHaveLength(0);
    });

    it("should handle setting all breakpoints", async () => {
      await page.waitForSelector('[data-testid="set-all-breakpoints"]');

      // Set all breakpoints
      await page.click('[data-testid="set-all-breakpoints"]');
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify all lines have breakpoints
      const breakpointsText = await page.$eval('[data-testid="breakpoints"]', (el) => el.textContent);
      expect(breakpointsText).toBe("1, 2, 3, 4, 5, 6, 7, 8");

      // From line 1, next should be line 2
      const nextBreakpoint = await page.$eval('[data-testid="next-breakpoint"]', (el) => el.textContent);
      expect(nextBreakpoint).toContain("2");

      // Navigate should go through every frame
      const nextButton = await page.$(
        '[data-testid="breakpoint-stepper-buttons"] button[aria-label="Next breakpoint"]'
      );

      for (let i = 2; i <= 8; i++) {
        await nextButton?.click();
        await new Promise((resolve) => setTimeout(resolve, 100));

        const frameLine = await page.$eval('[data-testid="frame-line"]', (el) => el.textContent);
        expect(frameLine).toContain(`Line: ${i}`);
      }
    });
  });

  describe("Folded Lines Integration", () => {
    it("should skip folded breakpoints when navigating forward", async () => {
      await page.waitForSelector('[data-testid="toggle-fold-2"]');

      // Fold line 2
      await page.click('[data-testid="toggle-fold-2"]');
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify line 2 is folded
      const foldedLines = await page.$eval('[data-testid="folded-lines"]', (el) => el.textContent);
      expect(foldedLines).toContain("2");

      // From line 1, next breakpoint should skip line 2 and go to line 4
      const nextBreakpoint = await page.$eval('[data-testid="next-breakpoint"]', (el) => el.textContent);
      expect(nextBreakpoint).toContain("4");

      // Navigate with next button
      const nextButton = await page.$(
        '[data-testid="breakpoint-stepper-buttons"] button[aria-label="Next breakpoint"]'
      );
      await nextButton?.click();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Should be at line 4, skipping line 2
      const frameLine = await page.$eval('[data-testid="frame-line"]', (el) => el.textContent);
      expect(frameLine).toContain("Line: 4");
    });

    it("should skip folded breakpoints when navigating backward", async () => {
      await page.waitForSelector('[data-testid="toggle-fold-4"]');

      // Navigate to line 6
      await page.click('[data-testid="goto-frame-6"]');
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Fold line 4
      await page.click('[data-testid="toggle-fold-4"]');
      await new Promise((resolve) => setTimeout(resolve, 100));

      // From line 6, prev breakpoint should skip line 4 and go to line 2
      const prevBreakpoint = await page.$eval('[data-testid="prev-breakpoint"]', (el) => el.textContent);
      expect(prevBreakpoint).toContain("2");

      // Navigate with prev button
      const prevButton = await page.$(
        '[data-testid="breakpoint-stepper-buttons"] button[aria-label="Previous breakpoint"]'
      );
      await prevButton?.click();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Should be at line 2, skipping line 4
      const frameLine = await page.$eval('[data-testid="frame-line"]', (el) => el.textContent);
      expect(frameLine).toContain("Line: 2");
    });

    it("should update navigation when lines are unfolded", async () => {
      await page.waitForSelector('[data-testid="toggle-fold-4"]');

      // Fold line 4
      await page.click('[data-testid="toggle-fold-4"]');
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Navigate to line 2
      await page.click('[data-testid="goto-frame-2"]');
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Next breakpoint should be line 6 (skipping folded line 4)
      let nextBreakpoint = await page.$eval('[data-testid="next-breakpoint"]', (el) => el.textContent);
      expect(nextBreakpoint).toContain("6");

      // Unfold line 4
      await page.click('[data-testid="toggle-fold-4"]');
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Now next breakpoint should be line 4
      nextBreakpoint = await page.$eval('[data-testid="next-breakpoint"]', (el) => el.textContent);
      expect(nextBreakpoint).toContain("4");
    });

    it("should disable buttons when all breakpoints are folded", async () => {
      await page.waitForSelector('[data-testid="toggle-fold-2"]');

      // Fold all breakpoint lines
      await page.click('[data-testid="toggle-fold-2"]');
      await page.click('[data-testid="toggle-fold-4"]');
      await page.click('[data-testid="toggle-fold-6"]');
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Both navigation breakpoints should be None
      const prevBreakpoint = await page.$eval('[data-testid="prev-breakpoint"]', (el) => el.textContent);
      expect(prevBreakpoint).toContain("None");

      const nextBreakpoint = await page.$eval('[data-testid="next-breakpoint"]', (el) => el.textContent);
      expect(nextBreakpoint).toContain("None");

      // Both buttons should be disabled
      const prevButtonDisabled = await page.$eval(
        '[data-testid="breakpoint-stepper-buttons"] button[aria-label="Previous breakpoint"]',
        (el) => el.hasAttribute("disabled")
      );
      expect(prevButtonDisabled).toBe(true);

      const nextButtonDisabled = await page.$eval(
        '[data-testid="breakpoint-stepper-buttons"] button[aria-label="Next breakpoint"]',
        (el) => el.hasAttribute("disabled")
      );
      expect(nextButtonDisabled).toBe(true);
    });
  });

  describe("Complex Scenarios", () => {
    it("should handle navigation with mixed breakpoints and folds", async () => {
      await page.waitForSelector('[data-testid="set-all-breakpoints"]');

      // Set all breakpoints
      await page.click('[data-testid="set-all-breakpoints"]');
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Fold lines 3, 5, 7
      await page.click('[data-testid="toggle-fold-3"]');
      await page.click('[data-testid="toggle-fold-5"]');
      await page.click('[data-testid="toggle-fold-7"]');
      await new Promise((resolve) => setTimeout(resolve, 100));

      const nextButton = await page.$(
        '[data-testid="breakpoint-stepper-buttons"] button[aria-label="Next breakpoint"]'
      );

      // Navigate forward - should visit 1 -> 2 -> 4 -> 6 -> 8
      const expectedSequence = [2, 4, 6, 8];

      for (const expectedLine of expectedSequence) {
        await nextButton?.click();
        await new Promise((resolve) => setTimeout(resolve, 100));

        const frameLine = await page.$eval('[data-testid="frame-line"]', (el) => el.textContent);
        expect(frameLine).toContain(`Line: ${expectedLine}`);
      }

      // Navigate back
      const prevButton = await page.$(
        '[data-testid="breakpoint-stepper-buttons"] button[aria-label="Previous breakpoint"]'
      );
      const reverseSequence = [6, 4, 2, 1];

      for (const expectedLine of reverseSequence) {
        await prevButton?.click();
        await new Promise((resolve) => setTimeout(resolve, 100));

        const frameLine = await page.$eval('[data-testid="frame-line"]', (el) => el.textContent);
        expect(frameLine).toContain(`Line: ${expectedLine}`);
      }
    });

    it("should maintain button state during rapid navigation", async () => {
      await page.waitForSelector('[data-testid="breakpoint-stepper-buttons"]');

      const nextButton = await page.$(
        '[data-testid="breakpoint-stepper-buttons"] button[aria-label="Next breakpoint"]'
      );
      const prevButton = await page.$(
        '[data-testid="breakpoint-stepper-buttons"] button[aria-label="Previous breakpoint"]'
      );

      // Navigate to line 4 (middle breakpoint)
      await page.click('[data-testid="goto-frame-4"]');
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Both buttons should be enabled
      let prevDisabled = await prevButton?.evaluate((el) => el.hasAttribute("disabled"));
      let nextDisabled = await nextButton?.evaluate((el) => el.hasAttribute("disabled"));
      expect(prevDisabled).toBe(false);
      expect(nextDisabled).toBe(false);

      // Rapidly click next twice
      await nextButton?.click();
      await nextButton?.click();
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Should be at last breakpoint (line 6)
      const frameLine = await page.$eval('[data-testid="frame-line"]', (el) => el.textContent);
      expect(frameLine).toContain("Line: 6");

      // Next should be disabled, prev enabled
      prevDisabled = await prevButton?.evaluate((el) => el.hasAttribute("disabled"));
      nextDisabled = await nextButton?.evaluate((el) => el.hasAttribute("disabled"));
      expect(prevDisabled).toBe(false);
      expect(nextDisabled).toBe(true);
    });

    it("should handle navigation when current position is between breakpoints", async () => {
      await page.waitForSelector('[data-testid="goto-frame-3"]');

      // Navigate to line 3 (not a breakpoint initially)
      await page.click('[data-testid="goto-frame-3"]');
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Prev breakpoint should be line 2, next should be line 4
      const prevBreakpoint = await page.$eval('[data-testid="prev-breakpoint"]', (el) => el.textContent);
      const nextBreakpoint = await page.$eval('[data-testid="next-breakpoint"]', (el) => el.textContent);
      expect(prevBreakpoint).toContain("2");
      expect(nextBreakpoint).toContain("4");

      // Navigate to prev breakpoint
      const prevButton = await page.$(
        '[data-testid="breakpoint-stepper-buttons"] button[aria-label="Previous breakpoint"]'
      );
      await prevButton?.click();
      await new Promise((resolve) => setTimeout(resolve, 100));

      const frameLine = await page.$eval('[data-testid="frame-line"]', (el) => el.textContent);
      expect(frameLine).toContain("Line: 2");
    });
  });

  describe("Button States", () => {
    it("should properly enable/disable buttons at boundaries", async () => {
      await page.waitForSelector('[data-testid="breakpoint-stepper-buttons"]');

      // At first frame - prev disabled, next enabled
      let prevDisabled = await page.$eval(
        '[data-testid="breakpoint-stepper-buttons"] button[aria-label="Previous breakpoint"]',
        (el) => el.hasAttribute("disabled")
      );
      let nextDisabled = await page.$eval(
        '[data-testid="breakpoint-stepper-buttons"] button[aria-label="Next breakpoint"]',
        (el) => el.hasAttribute("disabled")
      );
      expect(prevDisabled).toBe(true);
      expect(nextDisabled).toBe(false);

      // Navigate to last breakpoint (line 6)
      await page.click('[data-testid="goto-frame-6"]');
      await new Promise((resolve) => setTimeout(resolve, 100));

      // At last breakpoint - prev enabled, next disabled
      prevDisabled = await page.$eval(
        '[data-testid="breakpoint-stepper-buttons"] button[aria-label="Previous breakpoint"]',
        (el) => el.hasAttribute("disabled")
      );
      nextDisabled = await page.$eval(
        '[data-testid="breakpoint-stepper-buttons"] button[aria-label="Next breakpoint"]',
        (el) => el.hasAttribute("disabled")
      );
      expect(prevDisabled).toBe(false);
      expect(nextDisabled).toBe(true);

      // Navigate to middle breakpoint (line 4)
      await page.click('[data-testid="goto-frame-4"]');
      await new Promise((resolve) => setTimeout(resolve, 100));

      // In middle - both enabled
      prevDisabled = await page.$eval(
        '[data-testid="breakpoint-stepper-buttons"] button[aria-label="Previous breakpoint"]',
        (el) => el.hasAttribute("disabled")
      );
      nextDisabled = await page.$eval(
        '[data-testid="breakpoint-stepper-buttons"] button[aria-label="Next breakpoint"]',
        (el) => el.hasAttribute("disabled")
      );
      expect(prevDisabled).toBe(false);
      expect(nextDisabled).toBe(false);
    });
  });
});
