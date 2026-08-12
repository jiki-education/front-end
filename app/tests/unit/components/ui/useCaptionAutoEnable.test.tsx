import { renderHook, act } from "@testing-library/react";
import { useCaptionAutoEnable, type CaptionStore } from "@/components/ui/useCaptionAutoEnable";
import type { CaptionTrack } from "@/components/ui/captionTrackMatching";

// Stand-in for the v10 media store, in the same spirit as the JikiVideoPlayer
// bridge test: the hook reads `state`, subscribes for commits, and calls
// selectSubtitlesTrack. `set` mutates and notifies the way a store commit does.
function createFakeStore(initialTracks: CaptionTrack[] = []) {
  const state = { textTrackList: initialTracks, subtitlesShowing: false };
  const listeners = new Set<() => void>();
  return {
    state,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    set(patch: Partial<typeof state>) {
      Object.assign(state, patch);
      listeners.forEach((l) => l());
    },
    selectSubtitlesTrack: jest.fn()
  };
}

const HU = {
  id: "track:1:subtitles:hu:Hungarian",
  kind: "subtitles",
  label: "Hungarian",
  language: "hu",
  mode: "disabled"
};
const EN = {
  id: "track:0:subtitles:en:English",
  kind: "subtitles",
  label: "English",
  language: "en",
  mode: "disabled"
};

function renderAutoEnable(store: CaptionStore, locale = "hu", enabled = true) {
  return renderHook(({ l, e }: { l: string; e: boolean }) => useCaptionAutoEnable(store, l, e), {
    initialProps: { l: locale, e: enabled }
  });
}

describe("useCaptionAutoEnable", () => {
  it("selects the track matching the locale once tracks arrive", () => {
    const store = createFakeStore();
    renderAutoEnable(store);

    // hls.js has not parsed the manifest yet — nothing to do.
    expect(store.selectSubtitlesTrack).not.toHaveBeenCalled();

    act(() => store.set({ textTrackList: [EN, HU] }));
    expect(store.selectSubtitlesTrack).toHaveBeenCalledWith(HU.id);
  });

  it("selects tracks that are already present at mount", () => {
    const store = createFakeStore([EN, HU]);
    renderAutoEnable(store);

    // A remount against a warm store gets no further commit, so the hook must
    // not rely solely on the subscription firing.
    expect(store.selectSubtitlesTrack).toHaveBeenCalledWith(HU.id);
  });

  it("does nothing when no track matches the locale", () => {
    const store = createFakeStore([EN]);
    renderAutoEnable(store);

    expect(store.selectSubtitlesTrack).not.toHaveBeenCalled();
  });

  it("does nothing for the default locale", () => {
    const store = createFakeStore([EN, HU]);
    renderAutoEnable(store, "en", false);

    expect(store.selectSubtitlesTrack).not.toHaveBeenCalled();
  });

  it("does not re-apply on the commits its own selection causes", () => {
    const store = createFakeStore();
    renderAutoEnable(store);

    act(() => store.set({ textTrackList: [EN, HU] }));
    expect(store.selectSubtitlesTrack).toHaveBeenCalledTimes(1);

    // Selecting a track re-syncs the feature: ours is showing, everything else
    // disabled. That is the settled state, not a reason to act again.
    act(() => store.set({ textTrackList: [EN, { ...HU, mode: "showing" }], subtitlesShowing: true }));
    expect(store.selectSubtitlesTrack).toHaveBeenCalledTimes(1);
  });

  it("re-asserts when the player autoselects another track on top of ours", () => {
    const store = createFakeStore();
    renderAutoEnable(store);

    act(() => store.set({ textTrackList: [EN, HU] }));
    expect(store.selectSubtitlesTrack).toHaveBeenCalledTimes(1);

    // Mux marks every track AUTOSELECT=YES, so hls.js enables English after our
    // choice and two tracks end up showing at once — the wrong one paints.
    act(() =>
      store.set({
        textTrackList: [
          { ...EN, mode: "showing" },
          { ...HU, mode: "showing" }
        ],
        subtitlesShowing: true
      })
    );
    expect(store.selectSubtitlesTrack).toHaveBeenCalledTimes(2);
    expect(store.selectSubtitlesTrack).toHaveBeenLastCalledWith(HU.id);
  });

  it("yields to a reader who switches to a different language", () => {
    const store = createFakeStore();
    renderAutoEnable(store);

    act(() => store.set({ textTrackList: [EN, HU] }));
    expect(store.selectSubtitlesTrack).toHaveBeenCalledTimes(1);

    // Selecting a track disables the others, so after the reader's choice ours is
    // no longer showing and there is nothing for us to re-assert against.
    act(() => store.set({ textTrackList: [{ ...EN, mode: "showing" }, HU], subtitlesShowing: true }));
    expect(store.selectSubtitlesTrack).toHaveBeenCalledTimes(1);
  });

  it("yields to a reader who turns captions off", () => {
    const store = createFakeStore();
    renderAutoEnable(store);

    act(() => store.set({ textTrackList: [EN, HU] }));
    act(() => store.set({ textTrackList: [EN, HU], subtitlesShowing: false }));
    expect(store.selectSubtitlesTrack).toHaveBeenCalledTimes(1);
  });

  it("does not latch when a matching track has no selectable id", () => {
    const store = createFakeStore();
    renderAutoEnable(store);

    act(() => store.set({ textTrackList: [{ ...HU, id: undefined }] }));
    expect(store.selectSubtitlesTrack).not.toHaveBeenCalled();

    // A later sync delivering a usable track must still be honoured.
    act(() => store.set({ textTrackList: [HU] }));
    expect(store.selectSubtitlesTrack).toHaveBeenCalledWith(HU.id);
  });

  it("unsubscribes on unmount", () => {
    const store = createFakeStore();
    const { unmount } = renderAutoEnable(store);

    unmount();
    act(() => store.set({ textTrackList: [EN, HU] }));
    expect(store.selectSubtitlesTrack).not.toHaveBeenCalled();
  });
});
