import { renderHook, act } from "@testing-library/react";
import { useCaptionAutoEnable, type CaptionStore } from "@/components/ui/useCaptionAutoEnable";
import type { CaptionTrack } from "@/components/ui/captionTrackMatching";

// Stand-in for the v10 media store; `set` mutates and notifies like a store commit.
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

    // A warm store sends no further commit, so mount must not rely on the subscription.
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

    // The settled state after our own selection, not a reason to act again.
    act(() => store.set({ textTrackList: [EN, { ...HU, mode: "showing" }], subtitlesShowing: true }));
    expect(store.selectSubtitlesTrack).toHaveBeenCalledTimes(1);
  });

  it("re-asserts when the player autoselects another track on top of ours", () => {
    const store = createFakeStore();
    renderAutoEnable(store);

    act(() => store.set({ textTrackList: [EN, HU] }));
    expect(store.selectSubtitlesTrack).toHaveBeenCalledTimes(1);

    // Mux marks every track AUTOSELECT=YES, so hls.js enables English over ours.
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

    // Their choice disables ours, so there is nothing left to re-assert.
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
