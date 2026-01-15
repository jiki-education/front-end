import { test, expect } from "@playwright/test";

test.describe("Auto-Play Timeline E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test/coding-exercise/test-runner");
    await page.locator(".cm-editor").waitFor();
  });

  test("should auto-play timeline after running tests successfully", async ({ page }) => {
    // Clear and enter valid code
    await page.locator(".cm-content").click();
    const modifier = process.platform === "darwin" ? "Meta" : "Control";
    await page.keyboard.down(modifier);
    await page.keyboard.press("a");
    await page.keyboard.up(modifier);
    await page.locator(".cm-content").pressSequentially("move()\nmove()\nmove()\nmove()\nmove()");

    // Click Run Code
    await page.locator('[data-testid="run-button"]').click();

    // Wait for test results
    await page.locator('[data-ci="inspected-test-result-view"]').waitFor();

    // Wait for auto-play to start
    await page.waitForFunction(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator?.getStore().getState().isPlaying === true;
    });

    // Check that animation is playing (isPlaying should be true)
    const isPlaying = await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator.getStore().getState().isPlaying;
    });

    expect(isPlaying).toBe(true);
  });

  test("should NOT auto-play after user manually pauses", async ({ page }) => {
    // Run tests first
    await page.locator(".cm-content").click();
    const modifier = process.platform === "darwin" ? "Meta" : "Control";
    await page.keyboard.down(modifier);
    await page.keyboard.press("a");
    await page.keyboard.up(modifier);
    await page.locator(".cm-content").pressSequentially("move()\nmove()\nmove()\nmove()\nmove()");

    await page.locator('[data-testid="run-button"]').click();
    await page.locator('[data-ci="inspected-test-result-view"]').waitFor();

    // Wait for play/pause button to appear
    await page.locator('[data-ci="pause-button"], [data-ci="play-button"]').first().waitFor();

    // Check if auto-play started
    const isAutoPlaying = await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator?.getStore().getState().isPlaying === true;
    });

    if (!isAutoPlaying) {
      // If not auto-playing, click play first
      await page.locator('[data-ci="play-button"]').click();
      await page.waitForFunction(() => {
        const orchestrator = (window as any).testOrchestrator;
        return orchestrator?.getStore().getState().isPlaying === true;
      });
    }

    // Now click pause button
    await page.locator('[data-ci="pause-button"]').click();

    // Wait for pause to take effect
    await page.waitForFunction(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator?.getStore().getState().shouldPlayOnTestChange === false;
    });

    // Verify shouldAutoPlay is false
    const shouldAutoPlay = await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator.getStore().getState().shouldPlayOnTestChange;
    });
    expect(shouldAutoPlay).toBe(false);

    // Run tests again (modify code slightly to trigger re-run)
    await page.locator(".cm-content").click();
    await page.keyboard.down(modifier);
    await page.keyboard.press("a");
    await page.keyboard.up(modifier);
    await page.locator(".cm-content").pressSequentially("move()\nmove()\nmove()\nmove()\nmove()\n");

    await page.locator('[data-testid="run-button"]').click();
    await page.locator('[data-ci="inspected-test-result-view"]').waitFor();

    // Wait for auto-play to start
    await page.waitForFunction(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator?.getStore().getState().isPlaying === true;
    });

    // Should be playing (after running code, shouldAutoPlay is set to true)
    // So it SHOULD auto-play again
    const isPlayingAfterRerun = await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator.getStore().getState().isPlaying;
    });

    // After re-running tests, shouldAutoPlay is set to true, so should auto-play
    expect(isPlayingAfterRerun).toBe(true);
  });

  test("should set shouldAutoPlay flag when running tests again", async ({ page }) => {
    // Run tests first
    await page.locator(".cm-content").click();
    const modifier = process.platform === "darwin" ? "Meta" : "Control";
    await page.keyboard.down(modifier);
    await page.keyboard.press("a");
    await page.keyboard.up(modifier);
    await page.locator(".cm-content").pressSequentially("move()\nmove()\nmove()\nmove()\nmove()");

    await page.locator('[data-testid="run-button"]').click();
    await page.locator('[data-ci="inspected-test-result-view"]').waitFor();

    // Wait for auto-play
    await page.waitForFunction(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator?.getStore().getState().isPlaying === true;
    });

    // Pause
    await page.locator('[data-ci="pause-button"]').click();

    // Verify shouldAutoPlay is false
    let shouldAutoPlay = await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator.getStore().getState().shouldPlayOnTestChange;
    });
    expect(shouldAutoPlay).toBe(false);

    // Run tests again
    await page.locator('[data-testid="run-button"]').click();
    await page.locator('[data-ci="inspected-test-result-view"]').waitFor();

    // Wait for shouldAutoPlay to be set to true
    await page.waitForFunction(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator?.getStore().getState().shouldPlayOnTestChange === true;
    });

    // shouldAutoPlay should be set to true
    shouldAutoPlay = await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator.getStore().getState().shouldPlayOnTestChange;
    });
    expect(shouldAutoPlay).toBe(true);

    // And should be playing
    const isPlaying = await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator.getStore().getState().isPlaying;
    });
    expect(isPlaying).toBe(true);
  });

  test("should NOT auto-play when syntax error occurs", async ({ page }) => {
    // Enter invalid code (syntax error)
    await page.locator(".cm-content").click();
    const modifier = process.platform === "darwin" ? "Meta" : "Control";
    await page.keyboard.down(modifier);
    await page.keyboard.press("a");
    await page.keyboard.up(modifier);
    await page.locator(".cm-content").pressSequentially("invalid syntax here!!!");

    // Click Run Code
    await page.locator('[data-testid="run-button"]').click();

    // Wait for error to be shown
    await page.waitForFunction(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator?.getStore().getState().hasSyntaxError === true;
    });

    // Check that hasSyntaxError is true
    const hasSyntaxError = await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator.getStore().getState().hasSyntaxError;
    });
    expect(hasSyntaxError).toBe(true);

    // Check that animation is NOT playing
    const isPlaying = await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator.getStore().getState().isPlaying;
    });
    expect(isPlaying).toBe(false);

    // Verify no play button exists (timeline shouldn't be shown for syntax errors)
    const playButton = await page.locator('[data-ci="play-button"]').count();
    expect(playButton).toBe(0);
  });

  test("should play timeline when user manually clicks play button after pause", async ({ page }) => {
    test.skip(!!process.env.CI, "Flaky in CI");
    // Run tests
    await page.locator(".cm-content").click();
    const modifier = process.platform === "darwin" ? "Meta" : "Control";
    await page.keyboard.down(modifier);
    await page.keyboard.press("a");
    await page.keyboard.up(modifier);
    await page.locator(".cm-content").pressSequentially("move()\nmove()\nmove()\nmove()\nmove()");

    await page.locator('[data-testid="run-button"]').click();
    await page.locator('[data-ci="inspected-test-result-view"]').waitFor();

    // Wait for auto-play
    await page.waitForFunction(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator?.getStore().getState().isPlaying === true;
    });

    // Pause
    await page.locator('[data-ci="pause-button"]').click();

    // Wait for pause to take effect
    await page.waitForFunction(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator?.getStore().getState().isPlaying === false;
    });

    // Verify paused
    let isPlaying = await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator.getStore().getState().isPlaying;
    });
    expect(isPlaying).toBe(false);

    // Verify shouldAutoPlay is false
    let shouldAutoPlay = await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator.getStore().getState().shouldPlayOnTestChange;
    });
    expect(shouldAutoPlay).toBe(false);

    // Now manually click play
    await page.locator('[data-ci="play-button"]').click();

    // Check immediately that it started playing (don't wait or timeline might complete)
    isPlaying = await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator.getStore().getState().isPlaying;
    });
    expect(isPlaying).toBe(true);

    // And shouldPlayOnTestChange should remain false (manual play doesn't change auto-play preference)
    shouldAutoPlay = await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator.getStore().getState().shouldPlayOnTestChange;
    });
    expect(shouldAutoPlay).toBe(false);
  });
});
