import { useEffect } from "react";
import { findTrackForLocale, type CaptionTrack } from "./captionTrackMatching";

// The slice of the v10 store this needs. Declared structurally rather than
// imported so the hook can be driven by a fake store in tests, the way the
// player bridge already is.
export interface CaptionStore {
  state: {
    textTrackList?: readonly CaptionTrack[];
    subtitlesShowing?: boolean;
  };
  subscribe: (listener: () => void) => () => void;
  selectSubtitlesTrack?: (value: string) => void;
}

/**
 * Turns captions on in the reader's own language, once, when their locale isn't
 * the language the video is spoken in.
 *
 * Three things make this more than a one-line effect:
 *
 * Tracks arrive late, and in waves. hls.js parses the manifest after mount and
 * the text-track feature re-syncs on addtrack/change/loadstart, so the list is
 * empty on the first render of every video. Hence a subscription rather than a
 * mount effect.
 *
 * The player fights back. Mux marks every subtitle track `AUTOSELECT=YES`, so as
 * hls.js parses them it enables one itself — English, after we have already
 * chosen. Two tracks then sit at `mode: "showing"` simultaneously and the wrong
 * language paints over ours. So this re-asserts its choice whenever ours is still
 * showing and another track is showing beside it.
 *
 * It must not overrule the reader. Picking a track disables all the others, so a
 * reader's choice leaves ours not-showing, which stops the re-assert above dead.
 * The only state it acts on is "ours plus something else", which the player
 * produces and a reader cannot.
 *
 * Selection goes through the store's own `id`, not the value `useCaptionsOptions`
 * builds for menus: in beta.26 the menu derives `track.id || String(index)` while
 * `selectSubtitlesTrack` matches on `track.id || \`track:${index}:...\``, so for
 * HLS tracks (which have no id) the menu's value does not round-trip. The store's
 * `textTrackList[].id` is the form the action actually matches.
 */
export function useCaptionAutoEnable(store: CaptionStore | null, locale: string, enabled: boolean): void {
  useEffect(() => {
    if (!store || !enabled || !locale) {
      return;
    }

    // The id this hook last asked for. Also the "have we acted yet" flag, and
    // what tells our own selection apart from a reader's later one.
    let selectedId: string | null = null;

    const apply = () => {
      const tracks = store.state.textTrackList;
      if (!tracks || tracks.length === 0) {
        return;
      }

      const track = findTrackForLocale(tracks, locale);
      // No id means the store's own action has nothing to match on, so there is
      // no way to select this track — a later sync may still deliver a usable one.
      if (!track?.id) {
        return;
      }

      if (selectedId === null) {
        selectedId = track.id;
        store.selectSubtitlesTrack?.(track.id);
        return;
      }

      // Already acted. The one case that still needs us is the player enabling a
      // different track *itself* after ours: Mux marks every subtitle track
      // AUTOSELECT=YES, so hls.js switches the manifest's tracks on as it parses
      // them, landing on English on top of our choice. Left alone, two tracks are
      // `showing` at once and the wrong language paints.
      //
      // Re-asserting is safe against a reader who picks another language, because
      // selecting a track disables every other one: after their choice ours is no
      // longer showing, so `stillShowing` is false and this does nothing. It only
      // fires while ours is showing and something else is showing beside it, which
      // is exactly the autoselect race and never a state a reader can produce.
      const showing = tracks.filter((candidate) => candidate.mode === "showing");
      const stillShowing = showing.some((candidate) => candidate.id === selectedId);
      if (stillShowing && showing.length > 1) {
        store.selectSubtitlesTrack?.(selectedId);
      }
    };

    // Tracks may already be present (a remounted player against a warm store),
    // in which case no further commit is coming to trigger the subscriber.
    apply();
    return store.subscribe(apply);
  }, [store, locale, enabled]);
}
