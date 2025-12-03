import { test, expect } from "@playwright/test";

test.describe("FrameStepper Buttons E2E", () => {
  // Warm up the page compilation before running tests in parallel
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto("/test/coding-exercise/frame-stepper-buttons");
    await page.locator('[data-testid="frame-stepper-container"]').waitFor();
    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/test/coding-exercise/frame-stepper-buttons");
    await page.locator('[data-testid="frame-stepper-container"]').waitFor();
  });

  test("should render with initial state - prev button disabled, next button enabled", async ({ page }) => {
    // Wait for the buttons to be rendered by waiting for one of them
    await page.locator('button[aria-label="Previous frame"]').waitFor();

    // Get the buttons by their aria labels
    const prevButtonCount = await page.locator('button[aria-label="Previous frame"]').count();
    const nextButtonCount = await page.locator('button[aria-label="Next frame"]').count();
    expect(prevButtonCount).toBeGreaterThan(0);
    expect(nextButtonCount).toBeGreaterThan(0);

    // Check initial state - prev button should be disabled (at first frame)
    const prevButtonDisabled = await page.locator('button[aria-label="Previous frame"]').isDisabled();
    expect(prevButtonDisabled).toBe(true);

    // Next button should be enabled (frames available)
    const nextButtonDisabled = await page.locator('button[aria-label="Next frame"]').isDisabled();
    expect(nextButtonDisabled).toBe(false);

    // Verify initial frame info
    const frameDescription = await page.locator('[data-testid="current-frame"]').textContent();
    expect(frameDescription).toContain("Frame 1");

    const frameLine = await page.locator('[data-testid="frame-line"]').textContent();
    expect(frameLine).toContain("Line: 1");

    const frameTime = await page.locator('[data-testid="frame-time"]').textContent();
    expect(frameTime).toContain("Timeline Time: 0");
  });

  test("should navigate forward through frames with next button", async ({ page }) => {
    await page.locator('button[aria-label="Next frame"]').waitFor();

    const nextButton = page.locator('button[aria-label="Next frame"]');

    // Click next button to go to frame 2
    await nextButton.click();
    await page.waitForTimeout(100); // Allow state update

    let frameDescription = await page.locator('[data-testid="current-frame"]').textContent();
    expect(frameDescription).toContain("Frame 2");

    let frameLine = await page.locator('[data-testid="frame-line"]').textContent();
    expect(frameLine).toContain("Line: 2");

    let frameTime = await page.locator('[data-testid="frame-time"]').textContent();
    expect(frameTime).toContain("Timeline Time: 100");

    // Click next button to go to frame 3
    await nextButton.click();
    await page.waitForTimeout(100);

    frameDescription = await page.locator('[data-testid="current-frame"]').textContent();
    expect(frameDescription).toContain("Frame 3");

    frameLine = await page.locator('[data-testid="frame-line"]').textContent();
    expect(frameLine).toContain("Line: 3");

    frameTime = await page.locator('[data-testid="frame-time"]').textContent();
    expect(frameTime).toContain("Timeline Time: 200");
  });

  test("should navigate backward through frames with prev button", async ({ page }) => {
    await page.locator('button[aria-label="Previous frame"]').waitFor();

    const nextButton = page.locator('button[aria-label="Next frame"]');
    const prevButton = page.locator('button[aria-label="Previous frame"]');

    // First navigate to frame 3
    await nextButton.click();
    await page.waitForTimeout(100);
    await nextButton.click();
    await page.waitForTimeout(100);

    // Verify we're at frame 3
    let frameDescription = await page.locator('[data-testid="current-frame"]').textContent();
    expect(frameDescription).toContain("Frame 3");

    // Now test going back with prev button
    await prevButton.click();
    await page.waitForTimeout(100);

    frameDescription = await page.locator('[data-testid="current-frame"]').textContent();
    expect(frameDescription).toContain("Frame 2");

    let frameLine = await page.locator('[data-testid="frame-line"]').textContent();
    expect(frameLine).toContain("Line: 2");

    // Go back to frame 1
    await prevButton.click();
    await page.waitForTimeout(100);

    frameDescription = await page.locator('[data-testid="current-frame"]').textContent();
    expect(frameDescription).toContain("Frame 1");

    frameLine = await page.locator('[data-testid="frame-line"]').textContent();
    expect(frameLine).toContain("Line: 1");
  });

  test("should disable next button at last frame", async ({ page }) => {
    await page.locator('button[aria-label="Previous frame"]').waitFor();

    const nextButton = page.locator('button[aria-label="Next frame"]');

    // Navigate to the last frame (frame 5)
    for (let i = 0; i < 4; i++) {
      await nextButton.click();
      await page.waitForTimeout(100);
    }

    // Verify we're at the last frame
    const frameDescription = await page.locator('[data-testid="current-frame"]').textContent();
    expect(frameDescription).toContain("Frame 5");

    const frameLine = await page.locator('[data-testid="frame-line"]').textContent();
    expect(frameLine).toContain("Line: 5");

    // Check that next button is now disabled
    const nextButtonDisabled = await page.locator('button[aria-label="Next frame"]').isDisabled();
    expect(nextButtonDisabled).toBe(true);

    // Prev button should still be enabled
    const prevButtonDisabled = await page.locator('button[aria-label="Previous frame"]').isDisabled();
    expect(prevButtonDisabled).toBe(false);
  });

  test("should properly enable/disable buttons during navigation", async ({ page }) => {
    await page.locator('button[aria-label="Previous frame"]').waitFor();

    const nextButton = page.locator('button[aria-label="Next frame"]');
    const prevButton = page.locator('button[aria-label="Previous frame"]');

    // Initially: prev disabled, next enabled
    let prevDisabled = await prevButton.isDisabled();
    let nextDisabled = await nextButton.isDisabled();
    expect(prevDisabled).toBe(true);
    expect(nextDisabled).toBe(false);

    // Go to frame 2
    await nextButton.click();
    await page.waitForTimeout(100);

    // Both buttons should be enabled in middle frames
    prevDisabled = await prevButton.isDisabled();
    nextDisabled = await nextButton.isDisabled();
    expect(prevDisabled).toBe(false);
    expect(nextDisabled).toBe(false);

    // Navigate to last frame
    for (let i = 0; i < 3; i++) {
      await nextButton.click();
      await page.waitForTimeout(100);
    }

    // At last frame: prev enabled, next disabled
    prevDisabled = await prevButton.isDisabled();
    nextDisabled = await nextButton.isDisabled();
    expect(prevDisabled).toBe(false);
    expect(nextDisabled).toBe(true);

    // Go back to first frame
    for (let i = 0; i < 4; i++) {
      await prevButton.click();
      await page.waitForTimeout(100);
    }

    // Back at first frame: prev disabled, next enabled
    prevDisabled = await prevButton.isDisabled();
    nextDisabled = await nextButton.isDisabled();
    expect(prevDisabled).toBe(true);
    expect(nextDisabled).toBe(false);
  });

  test("should handle complete forward and backward navigation cycle", async ({ page }) => {
    await page.locator('button[aria-label="Previous frame"]').waitFor();

    const nextButton = page.locator('button[aria-label="Next frame"]');
    const prevButton = page.locator('button[aria-label="Previous frame"]');

    // Track all frame descriptions during forward navigation
    const forwardFrames: string[] = [];

    // Get initial frame
    let frameDescription = await page.locator('[data-testid="current-frame"]').textContent();
    forwardFrames.push(frameDescription || "");

    // Navigate forward through all frames
    for (let i = 1; i <= 4; i++) {
      await nextButton.click();
      await page.waitForTimeout(100);

      frameDescription = await page.locator('[data-testid="current-frame"]').textContent();
      forwardFrames.push(frameDescription || "");
    }

    // Verify we visited all 5 frames
    expect(forwardFrames).toHaveLength(5);
    expect(forwardFrames[0]).toContain("Frame 1");
    expect(forwardFrames[1]).toContain("Frame 2");
    expect(forwardFrames[2]).toContain("Frame 3");
    expect(forwardFrames[3]).toContain("Frame 4");
    expect(forwardFrames[4]).toContain("Frame 5");

    // Track all frames during backward navigation
    const backwardFrames: string[] = [];

    // Navigate backward through all frames
    for (let i = 4; i >= 1; i--) {
      await prevButton.click();
      await page.waitForTimeout(100);

      frameDescription = await page.locator('[data-testid="current-frame"]').textContent();
      backwardFrames.push(frameDescription || "");
    }

    // Verify backward navigation
    expect(backwardFrames).toHaveLength(4);
    expect(backwardFrames[0]).toContain("Frame 4");
    expect(backwardFrames[1]).toContain("Frame 3");
    expect(backwardFrames[2]).toContain("Frame 2");
    expect(backwardFrames[3]).toContain("Frame 1");
  });

  test("should not navigate when buttons are disabled", async ({ page }) => {
    await page.locator('button[aria-label="Previous frame"]').waitFor();

    // At initial state, prev button should be disabled
    const prevButton = page.locator('button[aria-label="Previous frame"]');

    // Try to click the disabled prev button
    await prevButton.click({ force: true });
    await page.waitForTimeout(100);

    // Should still be at frame 1
    let frameDescription = await page.locator('[data-testid="current-frame"]').textContent();
    expect(frameDescription).toContain("Frame 1");

    // Navigate to last frame
    const nextButton = page.locator('button[aria-label="Next frame"]');
    for (let i = 0; i < 4; i++) {
      await nextButton.click();
      await page.waitForTimeout(100);
    }

    // Verify at last frame
    frameDescription = await page.locator('[data-testid="current-frame"]').textContent();
    expect(frameDescription).toContain("Frame 5");

    // Try to click the disabled next button
    await nextButton.click({ force: true });
    await page.waitForTimeout(100);

    // Should still be at frame 5
    frameDescription = await page.locator('[data-testid="current-frame"]').textContent();
    expect(frameDescription).toContain("Frame 5");
  });

  test.describe("Line Folding Integration", () => {
    test("should skip folded lines when navigating with next button", async ({ page }) => {
      await page.locator('[data-testid="fold-line-2"]').waitFor();

      // Fold line 2
      await page.locator('[data-testid="fold-line-2"]').click();
      await page.waitForTimeout(100);

      // Verify line 2 is folded
      const foldedLines = await page.locator('[data-testid="folded-lines"]').textContent();
      expect(foldedLines).toContain("2");

      // Navigate with next button - should skip from frame 1 to frame 3
      const nextButton = page.locator('button[aria-label="Next frame"]');
      await nextButton.click();
      await page.waitForTimeout(100);

      // Should be at frame 3 (skipping frame 2)
      const frameDescription = await page.locator('[data-testid="current-frame"]').textContent();
      expect(frameDescription).toContain("Frame 3");

      const frameLine = await page.locator('[data-testid="frame-line"]').textContent();
      expect(frameLine).toContain("Line: 3");
    });

    test("should skip folded lines when navigating with prev button", async ({ page }) => {
      await page.locator('[data-testid="fold-line-3"]').waitFor();

      // First navigate to frame 4
      const nextButton = page.locator('button[aria-label="Next frame"]');
      for (let i = 0; i < 3; i++) {
        await nextButton.click();
        await page.waitForTimeout(100);
      }

      // Verify at frame 4
      let frameDescription = await page.locator('[data-testid="current-frame"]').textContent();
      expect(frameDescription).toContain("Frame 4");

      // Now fold line 3
      await page.locator('[data-testid="fold-line-3"]').click();
      await page.waitForTimeout(100);

      // Navigate back with prev button
      const prevButton = page.locator('button[aria-label="Previous frame"]');
      await prevButton.click();
      await page.waitForTimeout(100);

      // Should be at frame 2 (skipping frame 3)
      frameDescription = await page.locator('[data-testid="current-frame"]').textContent();
      expect(frameDescription).toContain("Frame 2");

      const frameLine = await page.locator('[data-testid="frame-line"]').textContent();
      expect(frameLine).toContain("Line: 2");
    });

    test("should handle multiple folded lines", async ({ page }) => {
      await page.locator('[data-testid="fold-lines-2-3"]').waitFor();

      // Fold lines 2 and 3
      await page.locator('[data-testid="fold-lines-2-3"]').click();
      await page.waitForTimeout(100);

      // Verify both lines are folded
      const foldedLines = await page.locator('[data-testid="folded-lines"]').textContent();
      expect(foldedLines).toContain("2");
      expect(foldedLines).toContain("3");

      // Navigate with next button - should skip from frame 1 to frame 4
      const nextButton = page.locator('button[aria-label="Next frame"]');
      await nextButton.click();
      await page.waitForTimeout(100);

      // Should be at frame 4 (skipping frames 2 and 3)
      const frameDescription = await page.locator('[data-testid="current-frame"]').textContent();
      expect(frameDescription).toContain("Frame 4");

      const frameLine = await page.locator('[data-testid="frame-line"]').textContent();
      expect(frameLine).toContain("Line: 4");
    });

    test("should update navigation when lines are unfolded", async ({ page }) => {
      await page.locator('[data-testid="fold-line-2"]').waitFor();

      // Fold line 2
      await page.locator('[data-testid="fold-line-2"]').click();
      await page.waitForTimeout(100);

      // Navigate to frame 3 (skipping frame 2)
      const nextButton = page.locator('button[aria-label="Next frame"]');
      await nextButton.click();
      await page.waitForTimeout(100);

      let frameDescription = await page.locator('[data-testid="current-frame"]').textContent();
      expect(frameDescription).toContain("Frame 3");

      // Unfold line 2
      await page.locator('[data-testid="unfold-line-2"]').click();
      await page.waitForTimeout(100);

      // Navigate back with prev button
      const prevButton = page.locator('button[aria-label="Previous frame"]');
      await prevButton.click();
      await page.waitForTimeout(100);

      // Should now be at frame 2 (no longer skipped)
      frameDescription = await page.locator('[data-testid="current-frame"]').textContent();
      expect(frameDescription).toContain("Frame 2");

      const frameLine = await page.locator('[data-testid="frame-line"]').textContent();
      expect(frameLine).toContain("Line: 2");
    });

    test("should clear all folded lines", async ({ page }) => {
      await page.locator('[data-testid="fold-lines-2-3"]').waitFor();

      // Fold multiple lines
      await page.locator('[data-testid="fold-lines-2-3"]').click();
      await page.waitForTimeout(100);

      // Verify lines are folded
      let foldedLines = await page.locator('[data-testid="folded-lines"]').textContent();
      expect(foldedLines).toContain("2");
      expect(foldedLines).toContain("3");

      // Clear all folds
      await page.locator('[data-testid="clear-folded-lines"]').click();
      await page.waitForTimeout(100);

      // Verify no lines are folded
      foldedLines = await page.locator('[data-testid="folded-lines"]').textContent();
      expect(foldedLines).toContain("None");

      // Navigate should now visit all frames normally
      const nextButton = page.locator('button[aria-label="Next frame"]');
      await nextButton.click();
      await page.waitForTimeout(100);

      // Should be at frame 2 (not skipped)
      const frameDescription = await page.locator('[data-testid="current-frame"]').textContent();
      expect(frameDescription).toContain("Frame 2");
    });

    test("should properly disable buttons when all intermediate frames are folded", async ({ page }) => {
      await page.locator('[data-testid="fold-lines-2-3"]').waitFor();

      // Navigate to frame 5
      const nextButton = page.locator('button[aria-label="Next frame"]');
      for (let i = 0; i < 4; i++) {
        await nextButton.click();
        await page.waitForTimeout(100);
      }

      // Fold lines 2, 3, and 4
      await page.locator('[data-testid="fold-lines-2-3"]').click();
      await page.waitForTimeout(100);
      await page.locator('[data-testid="fold-line-2"]').click(); // This shouldn't duplicate since 2 is already folded
      await page.waitForTimeout(100);

      // Add folding for line 4
      await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        const store = orchestrator.getStore();
        const currentState = store.getState();
        const newFoldedLines = [...new Set([...currentState.foldedLines, 4])];
        store.getState().setFoldedLines(newFoldedLines);
      });
      await page.waitForTimeout(100);

      // Navigate back to frame 1
      const prevButton = page.locator('button[aria-label="Previous frame"]');
      await prevButton.click();
      await page.waitForTimeout(100);

      // Should jump directly to frame 1
      const frameDescription = await page.locator('[data-testid="current-frame"]').textContent();
      expect(frameDescription).toContain("Frame 1");

      // Now next button should take us directly to frame 5
      await nextButton.click();
      await page.waitForTimeout(100);

      const finalFrame = await page.locator('[data-testid="current-frame"]').textContent();
      expect(finalFrame).toContain("Frame 5");
    });
  });
});
