import type { VideoSource } from "@/types/lesson";

// YouTube serves a fixed set of thumbnail sizes rather than arbitrary
// dimensions, so we pick the nearest one up from the requested width:
// hqdefault is 480x360, maxresdefault is the full-resolution frame.
const YOUTUBE_MAXRES_FROM_WIDTH = 640;

/**
 * The poster frame for a video, whichever provider hosts it. Mux takes the
 * dimensions directly; YouTube picks the closest of its fixed sizes.
 */
export function videoThumbnailUrl(video: Pick<VideoSource, "provider" | "id">, width: number, height: number): string {
  if (video.provider === "youtube") {
    const name = width >= YOUTUBE_MAXRES_FROM_WIDTH ? "maxresdefault" : "hqdefault";
    return `https://i.ytimg.com/vi/${video.id}/${name}.jpg`;
  }
  return `https://image.mux.com/${video.id}/thumbnail.jpg?width=${width}&height=${height}`;
}
