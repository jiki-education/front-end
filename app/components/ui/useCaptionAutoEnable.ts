import { useEffect } from "react";
import { findTrackForLocale, type CaptionTrack } from "./captionTrackMatching";

// Structural rather than imported so tests can drive it with a fake store.
export interface CaptionStore {
  state: {
    textTrackList?: readonly CaptionTrack[];
    subtitlesShowing?: boolean;
  };
  subscribe: (listener: () => void) => () => void;
  selectSubtitlesTrack?: (value: string) => void;
}

// Turns captions on in the reader's language. Subscribes because hls.js adds tracks after mount.
// Uses the store's `id`: in beta.26 the menu value from useCaptionsOptions doesn't round-trip.
export function useCaptionAutoEnable(store: CaptionStore | null, locale: string, enabled: boolean): void {
  useEffect(() => {
    if (!store || !enabled || !locale) {
      return;
    }

    // Doubles as the "have we acted yet" flag.
    let selectedId: string | null = null;

    const apply = () => {
      const tracks = store.state.textTrackList;
      if (!tracks || tracks.length === 0) {
        return;
      }

      const track = findTrackForLocale(tracks, locale);
      // Unselectable without an id, but a later sync may deliver a usable one.
      if (!track?.id) {
        return;
      }

      if (selectedId === null) {
        selectedId = track.id;
        store.selectSubtitlesTrack?.(track.id);
        return;
      }

      // Mux sets AUTOSELECT=YES, so hls.js enables English over ours; a reader's pick disables ours instead.
      const showing = tracks.filter((candidate) => candidate.mode === "showing");
      const stillShowing = showing.some((candidate) => candidate.id === selectedId);
      if (stillShowing && showing.length > 1) {
        store.selectSubtitlesTrack?.(selectedId);
      }
    };

    // A remounted player against a warm store gets no further commit.
    apply();
    return store.subscribe(apply);
  }, [store, locale, enabled]);
}
