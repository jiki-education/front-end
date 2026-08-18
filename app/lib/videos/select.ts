import { videoIndexHashes } from "@/lib/generated/video-hashes";
import { DEFAULT_LOCALE } from "@/lib/locales";
import type { VideoSource } from "@/types/lesson";

/**
 * A locale's resolved video index, as published by the front-end build.
 *
 * `sources` is keyed by VIDEO slug and deduplicated: one recording teaches
 * several concepts, so the loops video appears once and four concepts point at
 * it through `refs`. Video lessons carry no ref, because a video lesson's slug
 * is its video slug.
 */
export interface VideoIndex {
  sources: Record<string, VideoSource>;
  refs: Record<string, string>;
}

export const EMPTY_VIDEO_INDEX: VideoIndex = { sources: {}, refs: {} };

/** Which published index a locale reads: the locale it belongs to, and its hash. */
export interface VideoIndexTarget {
  locale: string;
  hash: string;
}

/**
 * The index a locale should fetch.
 *
 * Only locales with a recording of their own are published, so anything else
 * reads the default locale's index, which holds exactly the sources that locale
 * would have resolved to anyway. This is not the English-fallback the copy
 * catalogs refuse: those fall back to English PROSE, a broken page pretending to
 * work, whereas every locale genuinely shares one recording until someone
 * records another.
 *
 * Locale and hash travel together because the fallback changes both. Resolving
 * the hash alone would build a path for a locale that publishes no index.
 *
 * A base-language index wins over the default, so pt-BR plays pt's recording
 * rather than English's, matching `resolveVideo` in the generator.
 */
export function videoIndexTargetFor(locale: string): VideoIndexTarget | null {
  for (const candidate of [locale, locale.split("-")[0], DEFAULT_LOCALE]) {
    const hash = ownEntry(videoIndexHashes, candidate);
    if (hash) {
      return { locale: candidate, hash };
    }
  }
  return null;
}

/**
 * The video one curriculum item plays, or null when it names none.
 *
 * Callers ask by their own slug: a concept for its recap, a video lesson for the
 * video it IS, an exercise for its walkthrough. An item with no ref falls
 * through to being looked up as a video slug directly, which is what makes video
 * lessons need no ref of their own.
 */
export function videoFor(index: VideoIndex, slug: string): VideoSource | null {
  const videoSlug = ownEntry(index.refs, slug) ?? slug;
  return ownEntry(index.sources, videoSlug) ?? null;
}

// These are parsed JSON and a compiled manifest, so a plain index would reach
// Object.prototype and resolve a slug like "constructor" to a function rather
// than missing.
function ownEntry<T>(record: Record<string, T>, key: string): T | undefined {
  return Object.prototype.hasOwnProperty.call(record, key) ? record[key] : undefined;
}
