import type { Page } from "@playwright/test";
import { test, expect } from "./helpers/test";

/**
 * A concept page's recap video, served from the front-end-owned video index.
 *
 * This is server-rendered, so the assertion is on the VideoObject JSON-LD in the
 * initial HTML rather than on a player: that markup is fed from the same
 * resolved source the player gets, and it is what search engines read, so if the
 * video failed to resolve this is where it shows first.
 *
 * Two failures are being guarded against, both of which have happened:
 *
 *   - a concept borrowing the video of whatever unlocked it, which is why Type
 *     Conversion used to play the for/while/break/continue video despite
 *     covering none of it. It is asserted below to have none at all.
 *   - the video living in a copy catalog, which the i18n repo republishes as a
 *     closed literal, so it was present in English and silently gone in every
 *     other locale.
 */

interface VideoObjectSchema {
  "@type": string;
  embedUrl?: string;
  contentUrl?: string;
  uploadDate?: string;
  duration?: string;
}

async function videoSchemas(page: Page): Promise<VideoObjectSchema[]> {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  return blocks
    .flatMap((block) => {
      try {
        const parsed: unknown = JSON.parse(block);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [];
      }
    })
    .filter((entry): entry is VideoObjectSchema => (entry as VideoObjectSchema | null)?.["@type"] === "VideoObject");
}

test.describe("Concept recap video", () => {
  test("a concept with a video renders it with a real playback id", async ({ page }) => {
    await page.goto("/concepts/while-loops");
    await page.locator("h1").waitFor();

    const videos = await videoSchemas(page);
    expect(videos).toHaveLength(1);

    // A Mux playback id, not an empty string and not a slug: proof the index was
    // fetched, the ref followed and the source resolved.
    const url = videos[0].embedUrl ?? videos[0].contentUrl ?? "";
    expect(url).toMatch(/[a-zA-Z0-9]{20,}/);
    expect(videos[0].uploadDate).toBeTruthy();
    expect(videos[0].duration).toBeTruthy();
  });

  test("a concept with no video of its own renders none", async ({ page }) => {
    await page.goto("/concepts/type-conversion");
    await page.locator("h1").waitFor();

    expect(await videoSchemas(page)).toHaveLength(0);
  });
});
