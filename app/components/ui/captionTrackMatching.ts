// Picking the caption track that matches the reader's UI locale.
//
// Kept free of React and of the player so the matching rules — which carry all
// the subtlety here — can be tested directly.

// The shape the v10 text-track feature puts on the store (see
// @videojs/core dom/store/features/text-track.js). Only the fields the match
// needs are declared; the store supplies more.
//
// Every field is optional because the store's own `MediaTextTrack` types them
// that way: the feature synthesises `id` from kind/language/label, but nothing
// guarantees a track carries a language at all. Treating them as required here
// would push that uncertainty into a cast at the call site instead of handling
// it, so the matcher tolerates the gaps and the caller checks for an id.
export interface CaptionTrack {
  id?: string;
  kind?: string;
  label?: string;
  language?: string;
  mode?: string;
}

// BCP-47 primary subtag, lowercased: "pt-BR" -> "pt", "HU" -> "hu". Locales and
// track languages are compared through this so a regional track still matches a
// bare locale (and vice versa) — Mux labels tracks however the uploader wrote
// them, so the two sides genuinely differ in case and region.
function baseLanguage(tag: string): string {
  return tag.split("-")[0].toLowerCase();
}

function isCaptionOrSubtitle(track: CaptionTrack): boolean {
  return track.kind === "captions" || track.kind === "subtitles";
}

/**
 * The caption/subtitle track to auto-enable for `locale`, or null if none fits.
 *
 * Exact-tag matches win over primary-subtag ones, so a "pt-BR" reader gets the
 * Brazilian track when both it and a generic "pt" exist. Within a tier the first
 * track wins, which is manifest order.
 *
 * Returning null when nothing matches is deliberate, and is why this doesn't
 * fall back to English: the point of the feature is captions in the reader's own
 * language, and forcing on a language they may not read is worse than the
 * player's current default of no captions at all.
 */
export function findTrackForLocale(tracks: readonly CaptionTrack[], locale: string): CaptionTrack | null {
  const candidates = tracks.filter(isCaptionOrSubtitle);
  if (candidates.length === 0 || !locale) {
    return null;
  }

  const wanted = locale.toLowerCase();
  const exact = candidates.find((track) => track.language?.toLowerCase() === wanted);
  if (exact) {
    return exact;
  }

  const wantedBase = baseLanguage(locale);
  return candidates.find((track) => !!track.language && baseLanguage(track.language) === wantedBase) ?? null;
}
