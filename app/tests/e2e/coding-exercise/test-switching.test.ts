describe("Test Switching E2E", () => {
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

  describe("Test switching with pause state", () => {
    it("should show scrubber at beginning when switching to second test after pausing first", async () => {
      // Wait for test selector buttons to load
      await page.waitForSelector(".test-selector-buttons", { timeout: 5000 });

      // Click first test button
      const firstButton = await page.$(".test-selector-buttons button:first-child");
      await firstButton?.click();

      // Wait for pause button to appear (animation is playing)
      await page.waitForSelector('[data-ci="pause-button"]', { timeout: 2000 });

      // Pause the first test
      await page.click('[data-ci="pause-button"]');

      // Wait a bit
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Click second test button
      const secondButton = await page.$(".test-selector-buttons button:nth-child(2)");
      await secondButton?.click();

      // Wait a bit for state to update
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check that the scrubber shows beginning time (first frame time, typically 100000 microseconds)
      const currentTime = await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator.getStore().getState().currentTestTime;
      });

      // First frame is at 100000 microseconds (100ms * 1000)
      expect(currentTime).toBe(100000);
    });

    it("should not auto-play when switching to second test after pausing first", async () => {
      await page.waitForSelector(".test-selector-buttons", { timeout: 5000 });

      // Click first test
      const firstButton = await page.$(".test-selector-buttons button:first-child");
      await firstButton?.click();

      // Wait for pause button
      await page.waitForSelector('[data-ci="pause-button"]', { timeout: 2000 });

      // Pause
      await page.click('[data-ci="pause-button"]');
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Click second test
      const secondButton = await page.$(".test-selector-buttons button:nth-child(2)");
      await secondButton?.click();

      // Wait a bit
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Should NOT be playing
      const isPlaying = await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator.getStore().getState().isPlaying;
      });

      expect(isPlaying).toBe(false);
    });
  });

  describe("Test switching with saved positions", () => {
    it("should restore saved position when switching back to first test", async () => {
      await page.waitForSelector(".test-selector-buttons", { timeout: 5000 });

      // Click first test
      const firstButton = await page.$(".test-selector-buttons button:first-child");
      await firstButton?.click();

      // Wait for pause button
      await page.waitForSelector('[data-ci="pause-button"]', { timeout: 2000 });

      // Pause at current position
      await page.click('[data-ci="pause-button"]');
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Get the paused time
      const pausedTime = await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator.getStore().getState().currentTestTime;
      });

      // Click second test
      const secondButton = await page.$(".test-selector-buttons button:nth-child(2)");
      await secondButton?.click();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Click back to first test
      await firstButton?.click();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Should restore to paused position
      const restoredTime = await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator.getStore().getState().currentTestTime;
      });

      expect(restoredTime).toBe(pausedTime);
    });
  });

  describe("Test switching with auto-play", () => {
    it("should auto-play second test when switching while first test is playing", async () => {
      await page.waitForSelector(".test-selector-buttons", { timeout: 5000 });

      // Click first test (should auto-play)
      const firstButton = await page.$(".test-selector-buttons button:first-child");
      await firstButton?.click();

      // Wait for auto-play to start
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify first test is playing
      let isPlaying = await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator.getStore().getState().isPlaying;
      });
      expect(isPlaying).toBe(true);

      // Click second test while first is playing
      const secondButton = await page.$(".test-selector-buttons button:nth-child(2)");
      await secondButton?.click();

      // Wait a bit
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Second test should also auto-play
      isPlaying = await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator.getStore().getState().isPlaying;
      });

      expect(isPlaying).toBe(true);
    });

    it("should NOT auto-play second test after pausing first test", async () => {
      await page.waitForSelector(".test-selector-buttons", { timeout: 5000 });

      // Click first test
      const firstButton = await page.$(".test-selector-buttons button:first-child");
      await firstButton?.click();

      // Wait for pause button
      await page.waitForSelector('[data-ci="pause-button"]', { timeout: 2000 });

      // Pause first test
      await page.click('[data-ci="pause-button"]');
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Manually click play
      await page.click('[data-ci="play-button"]');
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify shouldPlayOnTestChange remains false (manual play doesn't change auto-play preference)
      const shouldAutoPlay = await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator.getStore().getState().shouldPlayOnTestChange;
      });
      expect(shouldAutoPlay).toBe(false);

      // Pause again
      await page.click('[data-ci="pause-button"]');
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Click second test
      const secondButton = await page.$(".test-selector-buttons button:nth-child(2)");
      await secondButton?.click();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Second test should NOT auto-play (pause disabled auto-play)
      const isPlaying = await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator.getStore().getState().isPlaying;
      });

      expect(isPlaying).toBe(false);
    });
  });

  describe("Running code resets positions", () => {
    it("should clear saved positions when running tests again", async () => {
      await page.waitForSelector(".test-selector-buttons", { timeout: 5000 });

      // Click first test
      const firstButton = await page.$(".test-selector-buttons button:first-child");
      await firstButton?.click();

      // Wait for pause button and pause
      await page.waitForSelector('[data-ci="pause-button"]', { timeout: 2000 });
      await page.click('[data-ci="pause-button"]');
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify we have saved times for the first test
      let testCurrentTimes = await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator.getStore().getState().testCurrentTimes;
      });
      const firstTestSlug = Object.keys(testCurrentTimes)[0];
      expect(Object.keys(testCurrentTimes).length).toBeGreaterThan(0);

      // Run tests again
      await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        void orchestrator.runCode();
      });

      // Wait for tests to complete
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Saved times should be cleared except for the first test (which gets reset immediately)
      testCurrentTimes = await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator.getStore().getState().testCurrentTimes;
      });
      // Should only have first test's time
      expect(Object.keys(testCurrentTimes)).toEqual([firstTestSlug]);
    });

    it("should start from beginning after running tests again", async () => {
      await page.waitForSelector(".test-selector-buttons", { timeout: 5000 });

      // Click first test
      const firstButton = await page.$(".test-selector-buttons button:first-child");
      await firstButton?.click();

      // Wait for pause button and pause partway through
      await page.waitForSelector('[data-ci="pause-button"]', { timeout: 2000 });
      await page.click('[data-ci="pause-button"]');
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Run tests again
      await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        void orchestrator.runCode();
      });

      // Wait for tests to complete and animation to start
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Wait for it to auto-play and then pause to check the reset worked
      await page.waitForSelector('[data-ci="pause-button"]', { timeout: 2000 });
      await page.click('[data-ci="pause-button"]');
      await new Promise((resolve) => setTimeout(resolve, 100));

      // First test should be at the paused position (which proves it restarted from beginning)
      const currentTime = await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator.getStore().getState().currentTestTime;
      });

      // Should be at a small time (less than 250ms), proving it restarted
      // Using 250ms threshold to account for E2E timing variability
      expect(currentTime).toBeLessThan(250000);
    });
  });
});
