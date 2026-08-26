import { cache } from "react";
import { readArtifactJson } from "@/lib/server/artifacts";
import { videoIndexPath } from "@/lib/assets-paths";
import { EMPTY_VIDEO_INDEX, videoIndexTargetFor, type VideoIndex } from "./select";

/**
 * Server-side video index loading.
 *
 * Reads the same artifact the client reads, through `readArtifactJson` so a
 * prerender takes it off disk rather than asking R2 for an object this build has
 * not uploaded yet. Wrapped in React's `cache()` so the concept page's several
 * helpers share one read per request.
 */
export const getVideoIndexServer = cache(async (locale: string): Promise<VideoIndex> => {
  const target = videoIndexTargetFor(locale);
  if (!target) {
    return EMPTY_VIDEO_INDEX;
  }
  return (await readArtifactJson<VideoIndex>(videoIndexPath(target.locale, target.hash))) ?? EMPTY_VIDEO_INDEX;
});
