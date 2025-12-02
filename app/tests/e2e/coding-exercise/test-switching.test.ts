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
      // Wait for test selector buttons to load
      await page.locator('[data-testid="test-selector-buttons"]').waitFor();

      // Click first test button
      const firstButton = page.locator('[data-testid="test-selector-buttons"] button').first();
      await firstButton.click();

      // Wait for pause button to appear (animation is playing)
      await page.locator('[data-ci="pause-button"]').waitFor();

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

      // Wait for state to update
      await page.waitForFunction(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator?.getStore().getState().currentTestTime === 100000;
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

      // Wait for pause button
      await page.locator('[data-ci="pause-button"]').waitFor();

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

      // Wait for pause button
      await page.locator('[data-ci="pause-button"]').waitFor();

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
      await page.waitForFunction(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator?.getStore().getState().currentTestTime === 100000;
      });

      // Click back to first test
      await firstButton.click();
      await page.waitForFunction(
        (expected) => {
          const orchestrator = (window as any).testOrchestrator;
          return orchestrator?.getStore().getState().currentTestTime === expected;
        },
        pausedTime
      );

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
      await page.locator('[data-testid="test-selector-buttons"]').waitFor();

      // Click first test (should auto-play)
      const firstButton = page.locator('[data-testid="test-selector-buttons"] button').first();
      await firstButton.click();

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
      await page.locator('[data-testid="test-selector-buttons"]').waitFor();

      // Click first test
      const firstButton = page.locator('[data-testid="test-selector-buttons"] button').first();
      await firstButton.click();

      // Wait for pause button
      await page.locator('[data-ci="pause-button"]').waitFor();

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

      // Wait for pause button and pause
      await page.locator('[data-ci="pause-button"]').waitFor();
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
      await page.waitForFunction(
        (expectedSlug) => {
          const orchestrator = (window as any).testOrchestrator;
          const times = orchestrator?.getStore().getState().testCurrentTimes;
          return Object.keys(times).length === 1 && Object.keys(times)[0] === expectedSlug;
        },
        firstTestSlug
      );

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

      // Wait for pause button and pause partway through
      await page.locator('[data-ci="pause-button"]').waitFor();
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

      // Wait for it to auto-play and then pause to check the reset worked
      await page.locator('[data-ci="pause-button"]').waitFor();
      await page.locator('[data-ci="pause-button"]').click();
      await page.waitForFunction(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator?.getStore().getState().isPlaying === false;
      });

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
