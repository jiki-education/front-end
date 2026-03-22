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
    // Wait for test results to actually be populated (inspected-test-result-view also renders in pending state)
    await page.waitForFunction(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator?.getStore().getState().testSuiteResult !== null;
    });
  });

  test("should NOT restart scenario when navigating away and back after completion", async ({ page }) => {
    // Smart selection picks the last test when all pass. Wait for animation to complete.
    await page.waitForFunction(() => {
      const orchestrator = (window as any).testOrchestrator;
      return !orchestrator.getStore().getState().isPlaying;
    });

    // Record which test was initially selected and its scrubber position
    const initialState = await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      const state = orchestrator.getStore().getState();
      return {
        slug: state.currentTest?.slug,
        idx: state.currentTestIdx,
        time: state.currentTestTime
      };
    });

    // Verify animation completed with scrubber past the start
    expect(initialState.time).toBeGreaterThan(0);

    // Wait for test selector buttons to load
    await page.locator('[data-testid="test-selector-buttons"]').waitFor();

    // Switch to a different test (first button, which is different from the last test)
    await page.locator("[data-testid='test-selector-buttons'] button").first().click();

    // Wait for state to update to a different test
    await page.waitForFunction((slug) => {
      const orchestrator = (window as any).testOrchestrator;
      const currentTest = orchestrator.getStore().getState().currentTest;
      return currentTest?.slug !== slug;
    }, initialState.slug);

    // Switch back to the original test
    await page.locator("[data-testid='test-selector-buttons'] button").nth(initialState.idx).click();

    // Wait for state to update back to the original test
    await page.waitForFunction((slug) => {
      const orchestrator = (window as any).testOrchestrator;
      const currentTest = orchestrator.getStore().getState().currentTest;
      return currentTest?.slug === slug;
    }, initialState.slug);

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
    expect(stateAfterReturn.currentTestTime).toBe(initialState.time);
  });

  test("should auto-play when switching between scenarios during initial playback", async ({ page }) => {
    // Wait for test selector buttons to load
    await page.locator('[data-testid="test-selector-buttons"]').waitFor();

    // Initially selected test should auto-play
    await page.waitForFunction(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator.getStore().getState().isPlaying;
    });

    // Record which test is initially playing
    const initialSlug = await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator.getStore().getState().currentTest?.slug;
    });

    // Quickly switch to a different test while current is still playing
    await page.locator("[data-testid='test-selector-buttons'] button").first().click();

    // Wait for state to update to a different test
    await page.waitForFunction((slug) => {
      const orchestrator = (window as any).testOrchestrator;
      const currentTest = orchestrator.getStore().getState().currentTest;
      return currentTest?.slug !== slug;
    }, initialSlug);

    // Switched test should also auto-play (this is correct behavior)
    const isPlayingAfterSwitch = await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator.getStore().getState().isPlaying;
    });
    expect(isPlayingAfterSwitch).toBe(true);
  });
});
