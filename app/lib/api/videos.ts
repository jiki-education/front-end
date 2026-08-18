import { assetsUrl } from "@/lib/assets";
import { videoIndexPath } from "@/lib/assets-paths";
import { EMPTY_VIDEO_INDEX, videoIndexTargetFor, type VideoIndex } from "@/lib/videos/select";

/**
 * Fetch a locale's video index.
 *
 * No pointer and no runtime hash resolution: videos ship with the front-end
 * deploy, so the hash is compiled in and is correct by construction. This is the
 * exercise code index's contract, on the locale axis instead of the language
 * one.
 *
 * Fetch it as part of a page's existing load phase, alongside its other data, so
 * the video is present on first paint rather than swapping in afterwards. It is
 * one small artifact per locale and it is session-cached, so a page that already
 * loads a catalog pays no extra round trip of depth for it.
 */

// Keyed by locale AND hash, so a republished index is picked up as a new key
// rather than pinned for the isolate's lifetime.
const videoIndexCache = new Map<string, Promise<VideoIndex>>();

export async function fetchVideoIndex(locale: string): Promise<VideoIndex> {
  const target = videoIndexTargetFor(locale);
  if (!target) {
    return EMPTY_VIDEO_INDEX;
  }

  const key = `${target.locale}:${target.hash}`;
  const cached = videoIndexCache.get(key);
  if (cached !== undefined) {
    return cached;
  }

  const promise = (async () => {
    try {
      const res = await fetch(assetsUrl(videoIndexPath(target.locale, target.hash)));
      if (!res.ok) {
        return EMPTY_VIDEO_INDEX;
      }
      return (await res.json()) as VideoIndex;
    } catch {
      return EMPTY_VIDEO_INDEX;
    }
  })();
  videoIndexCache.set(key, promise);
  return promise;
}
