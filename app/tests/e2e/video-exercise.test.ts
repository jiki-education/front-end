/**
 * E2E tests for VideoExercise autoplay handling.
 *
 * The /dev/video-exercise page mounts VideoExercise directly with a real Mux
 * playback ID, so we don't need to authenticate or stub the lesson page.
 * We only need to stub the lesson-status API and (for the blocked test)
 * override HTMLMediaElement.play to reject with NotAllowedError.
 */

import type { Page } from "@playwright/test";
import { test, expect } from "./helpers/test";
import { API_BASE } from "./helpers/api-mocks";

const LESSON_SLUG = "welcome-video";

async function mockLessonStatus(page: Page) {
  await page.route(`${API_BASE}/internal/user_lessons/${LESSON_SLUG}`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ user_lesson: { lesson_slug: LESSON_SLUG, status: "not_started", data: {} } })
    })
  );
}

test.describe("VideoExercise autoplay", () => {
  // Warm up the page compilation before running tests in parallel
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await mockLessonStatus(page);
    await page.goto("/dev/video-exercise", { timeout: 30000 });
    await page.locator("mux-player").waitFor({ state: "attached" });
    await page.close();
  });

  test("reveals the player when autoplay is blocked by the browser", async ({ page }) => {
    await mockLessonStatus(page);

    // Force every <video>.play() to reject with NotAllowedError, simulating
    // a browser that blocks autoplay (Safari, iOS, Chrome with low MEI).
    await page.addInitScript(() => {
      const NotAllowed = class extends Error {
        name = "NotAllowedError";
      };

      const originalPlay = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function () {
        return Promise.reject(new NotAllowed("autoplay blocked by test"));
      };
      // Stash for debugging if needed
      (window as unknown as { __originalPlay: typeof originalPlay }).__originalPlay = originalPlay;
    });

    const consoleWarnings: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "warning") consoleWarnings.push(msg.text());
    });

    await page.goto("/dev/video-exercise");

    const muxPlayer = page.locator("mux-player");
    await muxPlayer.waitFor({ state: "attached" });

    // The hook should catch the rejection and reveal the player UI.
    await expect(muxPlayer).toBeVisible();
    await expect.poll(() => consoleWarnings.some((w) => w.includes("Autoplay was prevented"))).toBe(true);
  });

  test("plays the video when the browser allows autoplay", async ({ page }) => {
    await mockLessonStatus(page);

    // Stub play() to resolve immediately and report a successful playback start.
    await page.addInitScript(() => {
      HTMLMediaElement.prototype.play = function () {
        this.dispatchEvent(new Event("play"));
        return Promise.resolve();
      };
    });

    const consoleWarnings: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "warning") consoleWarnings.push(msg.text());
    });

    await page.goto("/dev/video-exercise");

    const muxPlayer = page.locator("mux-player");
    await muxPlayer.waitFor({ state: "attached" });
    await expect(muxPlayer).toBeVisible();

    // No autoplay-prevented warning should have fired.
    expect(consoleWarnings.some((w) => w.includes("Autoplay was prevented"))).toBe(false);
  });
});
