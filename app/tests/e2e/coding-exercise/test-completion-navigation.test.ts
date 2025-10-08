describe("Test Completion and Navigation E2E", () => {
  beforeEach(async () => {
    await page.goto("http://localhost:3070/test/coding-exercise/test-runner");
    await page.waitForSelector(".cm-editor", { timeout: 5000 });

    // Enter valid code to get test results
    await page.click(".cm-content");
    const modifier = process.platform === "darwin" ? "Meta" : "Control";
    await page.keyboard.down(modifier);
    await page.keyboard.press("a");
    await page.keyboard.up(modifier);
    await page.type(".cm-content", "move()\nmove()\nmove()\nmove()\nmove()");

    // Run tests
    await page.click('[data-testid="run-button"]');
    await page.waitForSelector('[data-ci="inspected-test-result-view"]', { timeout: 5000 });
  }, 20000);

  it("should NOT restart scenario when navigating away and back after completion", async () => {
    // Wait for animation to complete (first test auto-plays by default)
    await new Promise((resolve) => setTimeout(resolve, 2000));

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
    await page.waitForSelector(".test-selector-buttons", { timeout: 5000 });

    // Switch to second test
    const secondButton = await page.$(".test-selector-buttons button:nth-child(2)");
    await secondButton?.click();

    // Wait a bit for state to update
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Switch back to first test
    const firstButton = await page.$(".test-selector-buttons button:first-child");
    await firstButton?.click();

    // Wait a bit for state to update
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify animation is NOT playing (should not have restarted)
    const stateAfterReturn = await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      return {
        isPlaying: orchestrator.getStore().getState().isPlaying,
        currentTestTime: orchestrator.getStore().getState().currentTestTime,
      };
    });

    // These assertions demonstrate the bug:
    // - isPlaying should be false, but it's true (scenario restarted)
    // - currentTestTime might have changed from the end value
    expect(stateAfterReturn.isPlaying).toBe(false);
    expect(stateAfterReturn.currentTestTime).toBe(scrubberValueAtEnd);
  });

  it("should auto-play when switching between scenarios during initial playback", async () => {
    // Wait for test selector buttons to load
    await page.waitForSelector(".test-selector-buttons", { timeout: 5000 });

    // First test should auto-play by default
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify first test is auto-playing
    const isPlayingFirst = await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator.getStore().getState().isPlaying;
    });
    expect(isPlayingFirst).toBe(true);

    // Quickly switch to second test while first is still playing
    const secondButton = await page.$(".test-selector-buttons button:nth-child(2)");
    await secondButton?.click();

    // Wait a bit for state to update
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Second test should also auto-play (this is correct behavior)
    const isPlayingSecond = await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator.getStore().getState().isPlaying;
    });
    expect(isPlayingSecond).toBe(true);
  });
});
