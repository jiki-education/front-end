import { test, expect } from "@playwright/test";

test.describe("Test Switching E2E", () => {
  // Warm up the page compilation before running tests in parallel
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto("/test/coding-exercise/test-runner");
    await page.locator(".cm-editor").waitFor();
    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/test/coding-exercise/test-runner");
    await page.locator(".cm-editor").waitFor();

    // Enter valid code to get test results
    await page.locator(".cm-content").click();
    const modifier = process.platform === "darwin" ? "Meta" : "Control";
    await page.keyboard.down(modifier);
    await page.keyboard.press("a");
    await page.keyboard.up(modifier);
    await page.locator(".cm-content").pressSequentially("move()\nmove()\nmove()\nmove()\nmove()");

    // Run tests
    await page.locator('[data-testid="run-button"]').click();
    await page.locator('[data-ci="inspected-test-result-view"]').waitFor();
  });

  test.describe("Test switching with pause state", () => {
    test("should show scrubber at beginning when switching to second test after pausing first", async ({ page }) => {
      test.skip(!!process.env.CI, "Flaky in CI - animation timing race conditions");
      // Wait for test selector buttons to load
      await page.locator('[data-testid="test-selector-buttons"]').waitFor();

      // Click first test button
      const firstButton = page.locator('[data-testid="test-selector-buttons"] button').first();
      await firstButton.click();

      // Wait for the test to be set and animation timeline to be available
      await page.waitForFunction(() => {
        const orchestrator = (window as any).testOrchestrator;
        const state = orchestrator?.getStore().getState();
        return state.currentTest && state.currentTest.animationTimeline && state.currentTest.type === "visual";
      });

      // Wait for play/pause button to appear (could be either depending on auto-play state)
      // Use a longer timeout and state: 'visible' to ensure the button is rendered
      await page
        .locator('[data-ci="pause-button"], [data-ci="play-button"]')
        .first()
        .waitFor({ state: "visible", timeout: 5000 });

      // If it's a play button, click it to start playing
      const playButton = await page.locator('[data-ci="play-button"]').isVisible();
      if (playButton) {
        await page.locator('[data-ci="play-button"]').click();
        await page.locator('[data-ci="pause-button"]').waitFor({ state: "visible", timeout: 5000 });
      }

      // Pause the first test
      await page.locator('[data-ci="pause-button"]').click();

      // Wait for pause to take effect
      await page.waitForFunction(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator?.getStore().getState().isPlaying === false;
      });

      // Click second test button
      const secondButton = page.locator('[data-testid="test-selector-buttons"] button').nth(1);
      await secondButton.click();

      // Wait for the second test to be fully loaded by checking its slug.
      // We intentionally avoid checking currentTestTime === 100000 (the first frame time)
      // because it creates a race condition - the exact value may only be present momentarily.
      await page.waitForFunction(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator?.getStore().getState().currentTest?.slug === "test-scenario-2";
      });

      // Check that the scrubber shows beginning time (first frame time, typically 100000 microseconds)
      const currentTime = await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator.getStore().getState().currentTestTime;
      });

      // First frame is at 100000 microseconds (100ms * 1000)
      expect(currentTime).toBe(100000);
    });

    test("should not auto-play when switching to second test after pausing first", async ({ page }) => {
      await page.locator('[data-testid="test-selector-buttons"]').waitFor();

      // Click first test
      const firstButton = page.locator('[data-testid="test-selector-buttons"] button').first();
      await firstButton.click();

      // Wait for the test to be set and animation timeline to be available
      await page.waitForFunction(() => {
        const orchestrator = (window as any).testOrchestrator;
        const state = orchestrator?.getStore().getState();
        return state.currentTest && state.currentTest.animationTimeline && state.currentTest.type === "visual";
      });

      // Wait for play/pause button to appear
      await page.locator('[data-ci="pause-button"], [data-ci="play-button"]').first().waitFor();

      // Start playing if needed
      const playButton = await page.locator('[data-ci="play-button"]').isVisible();
      if (playButton) {
        await page.locator('[data-ci="play-button"]').click();
        await page.locator('[data-ci="pause-button"]').waitFor();
      }

      // Pause
      await page.locator('[data-ci="pause-button"]').click();
      await page.waitForFunction(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator?.getStore().getState().isPlaying === false;
      });

      // Click second test
      const secondButton = page.locator('[data-testid="test-selector-buttons"] button').nth(1);
      await secondButton.click();

      // Wait for state to update
      await page.waitForFunction(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator?.getStore().getState().isPlaying === false;
      });

      // Should NOT be playing
      const isPlaying = await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator.getStore().getState().isPlaying;
      });

      expect(isPlaying).toBe(false);
    });
  });

  test.describe("Test switching with saved positions", () => {
    test("should restore saved position when switching back to first test", async ({ page }) => {
      await page.locator('[data-testid="test-selector-buttons"]').waitFor();

      // Click first test
      const firstButton = page.locator('[data-testid="test-selector-buttons"] button').first();
      await firstButton.click();

      // Wait for the test to be set and animation timeline to be available
      await page.waitForFunction(() => {
        const orchestrator = (window as any).testOrchestrator;
        const state = orchestrator?.getStore().getState();
        return state.currentTest && state.currentTest.animationTimeline && state.currentTest.type === "visual";
      });

      // Wait for play/pause button to appear
      await page.locator('[data-ci="pause-button"], [data-ci="play-button"]').first().waitFor();

      // Start playing if needed
      const playButton = await page.locator('[data-ci="play-button"]').isVisible();
      if (playButton) {
        await page.locator('[data-ci="play-button"]').click();
        await page.locator('[data-ci="pause-button"]').waitFor();
      }

      // Pause at current position
      await page.locator('[data-ci="pause-button"]').click();
      await page.waitForFunction(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator?.getStore().getState().isPlaying === false;
      });

      // Get the paused time
      const pausedTime = await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator.getStore().getState().currentTestTime;
      });

      // Click second test
      const secondButton = page.locator('[data-testid="test-selector-buttons"] button').nth(1);
      await secondButton.click();
      // Wait for the second test to be fully loaded by checking its slug.
      // We intentionally avoid checking currentTestTime === 100000 (the first frame time)
      // because auto-play starts immediately and advances the time past that value,
      // creating a race condition where the exact value is only present momentarily.
      await page.waitForFunction(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator?.getStore().getState().currentTest?.slug === "test-scenario-2";
      });

      // Click back to first test
      await firstButton.click();
      await page.waitForFunction((expected) => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator?.getStore().getState().currentTestTime === expected;
      }, pausedTime);

      // Should restore to paused position
      const restoredTime = await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator.getStore().getState().currentTestTime;
      });

      expect(restoredTime).toBe(pausedTime);
    });
  });

  test.describe("Test switching with auto-play", () => {
    test("should auto-play second test when switching while first test is playing", async ({ page }) => {
      test.skip(!!process.env.CI, "Flaky in CI - animation timing race conditions");
      await page.locator('[data-testid="test-selector-buttons"]').waitFor();

      // Click first test (should auto-play)
      const firstButton = page.locator('[data-testid="test-selector-buttons"] button').first();
      await firstButton.click();

      // Wait for the test to be set and animation timeline to be available
      await page.waitForFunction(() => {
        const orchestrator = (window as any).testOrchestrator;
        const state = orchestrator?.getStore().getState();
        return state.currentTest && state.currentTest.animationTimeline && state.currentTest.type === "visual";
      });

      // Wait for auto-play to start
      await page.waitForFunction(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator?.getStore().getState().isPlaying === true;
      });

      // Verify first test is playing
      let isPlaying = await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator.getStore().getState().isPlaying;
      });
      expect(isPlaying).toBe(true);

      // Click second test while first is playing
      const secondButton = page.locator('[data-testid="test-selector-buttons"] button').nth(1);
      await secondButton.click();

      // Wait for second test to start playing
      await page.waitForFunction(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator?.getStore().getState().isPlaying === true;
      });

      // Second test should also auto-play
      isPlaying = await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator.getStore().getState().isPlaying;
      });

      expect(isPlaying).toBe(true);
    });

    test("should NOT auto-play second test after pausing first test", async ({ page }) => {
      test.skip(!!process.env.CI, "Flaky in CI");
      await page.locator('[data-testid="test-selector-buttons"]').waitFor();

      // Click first test
      const firstButton = page.locator('[data-testid="test-selector-buttons"] button').first();
      await firstButton.click();

      // Wait for play/pause button to appear
      await page.locator('[data-ci="pause-button"], [data-ci="play-button"]').first().waitFor();

      // Start playing if needed
      const playButton = await page.locator('[data-ci="play-button"]').isVisible();
      if (playButton) {
        await page.locator('[data-ci="play-button"]').click();
        await page.locator('[data-ci="pause-button"]').waitFor();
      }

      // Pause first test
      await page.locator('[data-ci="pause-button"]').click();
      await page.waitForFunction(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator?.getStore().getState().isPlaying === false;
      });

      // Manually click play
      await page.locator('[data-ci="play-button"]').click();
      await page.waitForFunction(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator?.getStore().getState().isPlaying === true;
      });

      // Verify shouldPlayOnTestChange remains false (manual play doesn't change auto-play preference)
      const shouldAutoPlay = await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator.getStore().getState().shouldPlayOnTestChange;
      });
      expect(shouldAutoPlay).toBe(false);

      // Pause again
      await page.locator('[data-ci="pause-button"]').click();
      await page.waitForFunction(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator?.getStore().getState().isPlaying === false;
      });

      // Click second test
      const secondButton = page.locator('[data-testid="test-selector-buttons"] button').nth(1);
      await secondButton.click();

      // Wait for state to stabilize
      await page.waitForFunction(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator?.getStore().getState().isPlaying === false;
      });

      // Second test should NOT auto-play (pause disabled auto-play)
      const isPlaying = await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator.getStore().getState().isPlaying;
      });

      expect(isPlaying).toBe(false);
    });
  });

  test.describe("Running code resets positions", () => {
    test("should clear saved positions when running tests again", async ({ page }) => {
      await page.locator('[data-testid="test-selector-buttons"]').waitFor();

      // Click first test
      const firstButton = page.locator('[data-testid="test-selector-buttons"] button').first();
      await firstButton.click();

      // Wait for the test to be set and animation timeline to be available
      await page.waitForFunction(() => {
        const orchestrator = (window as any).testOrchestrator;
        const state = orchestrator?.getStore().getState();
        return state.currentTest && state.currentTest.animationTimeline && state.currentTest.type === "visual";
      });

      // Wait for play/pause button and ensure playing
      await page.locator('[data-ci="pause-button"], [data-ci="play-button"]').first().waitFor();

      // Start playing if needed
      const playButton = await page.locator('[data-ci="play-button"]').isVisible();
      if (playButton) {
        await page.locator('[data-ci="play-button"]').click();
        await page.locator('[data-ci="pause-button"]').waitFor();
      }
      await page.locator('[data-ci="pause-button"]').click();
      await page.waitForFunction(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator?.getStore().getState().isPlaying === false;
      });

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
      await page.waitForFunction((expectedSlug) => {
        const orchestrator = (window as any).testOrchestrator;
        const times = orchestrator?.getStore().getState().testCurrentTimes;
        return Object.keys(times).length === 1 && Object.keys(times)[0] === expectedSlug;
      }, firstTestSlug);

      // Saved times should be cleared except for the first test (which gets reset immediately)
      testCurrentTimes = await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator.getStore().getState().testCurrentTimes;
      });
      // Should only have first test's time
      expect(Object.keys(testCurrentTimes)).toEqual([firstTestSlug]);
    });

    test("should start from beginning after running tests again", async ({ page }) => {
      await page.locator('[data-testid="test-selector-buttons"]').waitFor();

      // Click first test
      const firstButton = page.locator('[data-testid="test-selector-buttons"] button').first();
      await firstButton.click();

      // Wait for the test to be set and animation timeline to be available
      await page.waitForFunction(() => {
        const orchestrator = (window as any).testOrchestrator;
        const state = orchestrator?.getStore().getState();
        return state.currentTest && state.currentTest.animationTimeline && state.currentTest.type === "visual";
      });

      // Wait for play/pause button and ensure playing before pausing partway through
      await page.locator('[data-ci="pause-button"], [data-ci="play-button"]').first().waitFor();

      // Start playing if needed
      const playButton = await page.locator('[data-ci="play-button"]').isVisible();
      if (playButton) {
        await page.locator('[data-ci="play-button"]').click();
        await page.locator('[data-ci="pause-button"]').waitFor();
      }
      await page.locator('[data-ci="pause-button"]').click();
      await page.waitForFunction(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator?.getStore().getState().isPlaying === false;
      });

      // Run tests again
      await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        void orchestrator.runCode();
      });

      // Wait for the test to be loaded, then immediately pause via API.
      // We use API-based pause instead of clicking the UI button because UI latency
      // (~200ms for button render + click) would let the animation advance too far,
      // making it impossible to verify the time reset to the beginning.
      await page.waitForFunction(() => {
        const orchestrator = (window as any).testOrchestrator;
        const state = orchestrator?.getStore().getState();
        return state.currentTest && state.currentTest.animationTimeline && state.currentTest.type === "visual";
      });
      await page.evaluate(() => {
        (window as any).testOrchestrator.pause();
      });

      // Verify time is near the beginning (first frame is at 100000μs = 100ms)
      const currentTime = await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator.getStore().getState().currentTestTime;
      });

      // Should be at or very near the first frame time (100000μs), proving it restarted.
      // Allow small margin for timing, but much tighter than the old 250000 threshold.
      expect(currentTime).toBeLessThan(150000);
    });
  });
});
