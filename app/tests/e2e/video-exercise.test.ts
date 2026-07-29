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
    await page.locator("video").waitFor({ state: "attached" });
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

    const videoPlayer = page.locator("video");
    await videoPlayer.waitFor({ state: "attached" });

    // The hook should catch the rejection and reveal the player UI.
    await expect(videoPlayer).toBeVisible();
    await expect.poll(() => consoleWarnings.some((w) => w.includes("Autoplay was prevented"))).toBe(true);
  });

  test("plays the video when the browser allows autoplay", async ({ page }) => {
    await mockLessonStatus(page);

    // Stub play() to resolve immediately and report a successful playback start.
    // Video.js v10's store derives `paused` by reading `media.paused` on the DOM
    // `play` event (it doesn't trust the event alone), so the stub must actually
    // flip the element's `paused` getter to false before dispatching — otherwise
    // the store stays paused, onPlay never fires, and the player is never revealed.
    await page.addInitScript(() => {
      const pausedState = new WeakMap<HTMLMediaElement, boolean>();
      Object.defineProperty(HTMLMediaElement.prototype, "paused", {
        configurable: true,
        get(this: HTMLMediaElement) {
          return pausedState.get(this) ?? true;
        }
      });
      HTMLMediaElement.prototype.play = function () {
        pausedState.set(this, false);
        this.dispatchEvent(new Event("play"));
        return Promise.resolve();
      };
      HTMLMediaElement.prototype.pause = function () {
        pausedState.set(this, true);
        this.dispatchEvent(new Event("pause"));
      };
    });

    const consoleWarnings: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "warning") consoleWarnings.push(msg.text());
    });

    await page.goto("/dev/video-exercise");

    const videoPlayer = page.locator("video");
    await videoPlayer.waitFor({ state: "attached" });
    await expect(videoPlayer).toBeVisible();

    // No autoplay-prevented warning should have fired.
    expect(consoleWarnings.some((w) => w.includes("Autoplay was prevented"))).toBe(false);
  });
});
