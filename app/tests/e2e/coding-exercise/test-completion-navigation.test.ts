import { test, expect } from "@playwright/test";

test.describe("Test Completion and Navigation E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test/coding-exercise/test-runner");
    await page.locator(".cm-editor").waitFor();

    // Enter valid code to get test results
    await page.locator(".cm-content").click();
    const modifier = process.platform === "darwin" ? "Meta" : "Control";
    await page.keyboard.press(`${modifier}+a`);
    await page.locator(".cm-content").pressSequentially("move()\nmove()\nmove()\nmove()\nmove()");

    // Run tests
    await page.locator('[data-testid="run-button"]').click();
    await page.locator('[data-ci="inspected-test-result-view"]').waitFor();
  });

  test("should NOT restart scenario when navigating away and back after completion", async ({ page }) => {
    // Wait for animation to complete (first test auto-plays by default)
    await page.waitForFunction(() => {
      const orchestrator = (window as any).testOrchestrator;
      return !orchestrator.getStore().getState().isPlaying;
    });

    // Verify animation has stopped (completed)
    const isPlayingAfterCompletion = await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator.getStore().getState().isPlaying;
    });
    expect(isPlayingAfterCompletion).toBe(false);

    // Get the scrubber value at the end
    const scrubberValueAtEnd = await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator.getStore().getState().currentTestTime;
    });

    // Verify we're at the last frame (scrubber should be at max)
    expect(scrubberValueAtEnd).toBeGreaterThan(0);

    // Wait for test selector buttons to load
    await page.locator('[data-testid="test-selector-buttons"]').waitFor();

    // Switch to second test
    await page.locator("[data-testid='test-selector-buttons'] button").nth(1).click();

    // Wait for state to update
    await page.waitForFunction(() => {
      const orchestrator = (window as any).testOrchestrator;
      const currentTest = orchestrator.getStore().getState().currentTest;
      return currentTest?.slug !== "test-1";
    });

    // Switch back to first test
    await page.locator("[data-testid='test-selector-buttons'] button").first().click();

    // Wait for state to update - just check that we have a currentTest
    await page.waitForFunction(() => {
      const orchestrator = (window as any).testOrchestrator;
      const currentTest = orchestrator.getStore().getState().currentTest;
      // Just check that we have a currentTest, don't rely on slug matching
      return currentTest !== null && currentTest !== undefined;
    });

    // Verify immediately (don't wait for animation to potentially play)
    const stateAfterReturn = await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      const state = orchestrator.getStore().getState();
      return {
        currentTestTime: state.currentTestTime
      };
    });

    // The key assertion: scrubber value should remain at the end (not reset to beginning)
    // This proves the animation did NOT auto-restart
    expect(stateAfterReturn.currentTestTime).toBe(scrubberValueAtEnd);
  });

  test("should auto-play when switching between scenarios during initial playback", async ({ page }) => {
    // Wait for test selector buttons to load
    await page.locator('[data-testid="test-selector-buttons"]').waitFor();

    // First test should auto-play by default
    await page.waitForFunction(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator.getStore().getState().isPlaying;
    });

    // Verify first test is auto-playing
    const isPlayingFirst = await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator.getStore().getState().isPlaying;
    });
    expect(isPlayingFirst).toBe(true);

    // Quickly switch to second test while first is still playing
    await page.locator("[data-testid='test-selector-buttons'] button").nth(1).click();

    // Wait for state to update
    await page.waitForFunction(() => {
      const orchestrator = (window as any).testOrchestrator;
      const currentTest = orchestrator.getStore().getState().currentTest;
      return currentTest?.slug !== "test-1";
    });

    // Second test should also auto-play (this is correct behavior)
    const isPlayingSecond = await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator.getStore().getState().isPlaying;
    });
    expect(isPlayingSecond).toBe(true);
  });
});
