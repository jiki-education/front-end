// Matching the caption track to the reader's UI locale. No React or player deps, so it's directly testable.

// Subset of the v10 store's MediaTextTrack; all optional because the store types them that way.
export interface CaptionTrack {
  id?: string;
  kind?: string;
  label?: string;
  language?: string;
  mode?: string;
}

// "pt-BR" -> "pt". Mux track languages are uploader-written, so case and region both vary.
function baseLanguage(tag: string): string {
  return tag.split("-")[0].toLowerCase();
}

function isCaptionOrSubtitle(track: CaptionTrack): boolean {
  return track.kind === "captions" || track.kind === "subtitles";
}

// The track to auto-enable for `locale`, or null if none fits. Exact tag beats primary subtag.
// Null rather than an English fallback: captions they may not read are worse than none.
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
