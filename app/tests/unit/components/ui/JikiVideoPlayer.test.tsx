import { createRef } from "react";
import { render } from "@testing-library/react";
import { act } from "@testing-library/react";
import JikiVideoPlayer, { type JikiVideoPlayerHandle } from "@/components/ui/JikiVideoPlayer";

// A minimal stand-in for the v10 media store. The bridge reads `store.state`,
// subscribes for change notifications, and calls seek/play/pause on the handle,
// so the fake exposes those plus a `set()` helper that mutates state and fires
// the subscriber the way the real store does after a state transition.
interface FakeState {
  currentTime: number;
  duration: number;
  seeking: boolean;
  paused: boolean;
  waiting: boolean;
  ended: boolean;
  canPlay: boolean;
  error: unknown;
}

function createFakeStore() {
  const state: FakeState = {
    currentTime: 0,
    duration: 0,
    seeking: false,
    paused: true,
    waiting: false,
    ended: false,
    canPlay: false,
    error: null
  };
  const listeners = new Set<() => void>();
  return {
    state,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    // Apply a state patch and notify subscribers once, mimicking a store commit.
    set(patch: Partial<FakeState>) {
      Object.assign(state, patch);
      listeners.forEach((l) => l());
    },
    seek: jest.fn((value: number) => {
      state.currentTime = value;
      return Promise.resolve(value);
    }),
    play: jest.fn(() => Promise.resolve()),
    pause: jest.fn()
  };
}

// The module builds `const Player = createPlayer(...)` at load time, so the mock
// must hand back a stable usePlayer that returns our shared fake store. Provider,
// VideoSkin, and MuxVideo are irrelevant to the bridge logic — stub them to nothing.
const fakeStore = createFakeStore();

jest.mock("@videojs/react", () => ({
  createPlayer: () => ({
    Provider: ({ children }: { children: React.ReactNode }) => children,
    Container: () => null,
    usePlayer: () => fakeStore,
    useMedia: () => null
  })
}));

jest.mock("@videojs/react/video", () => ({
  videoFeatures: [],
  VideoSkin: ({ children }: { children: React.ReactNode }) => children
}));

jest.mock("@videojs/react/media/mux-video", () => ({
  MuxVideo: () => null
}));

jest.mock("@videojs/react/media/mux-data", () => ({
  MuxData: () => null
}));

jest.mock("@videojs/react/video/skin.css", () => ({}), { virtual: true });

function resetStore() {
  Object.assign(fakeStore.state, {
    currentTime: 0,
    duration: 0,
    seeking: false,
    paused: true,
    waiting: false,
    ended: false,
    canPlay: false,
    error: null
  });
  fakeStore.seek.mockClear();
  fakeStore.play.mockClear();
  fakeStore.pause.mockClear();
}

beforeEach(() => {
  resetStore();
});

describe("JikiVideoPlayer PlayerBridge subscription", () => {
  it("fires onPlaying when playback starts producing frames (paused → playing)", () => {
    const onPlaying = jest.fn();
    render(<JikiVideoPlayer playbackId="abc" onPlaying={onPlaying} />);

    expect(onPlaying).not.toHaveBeenCalled();
    act(() => fakeStore.set({ paused: false }));
    expect(onPlaying).toHaveBeenCalledTimes(1);
  });

  it("fires onPlaying when playback resumes after a stall (waiting clears)", () => {
    const onPlaying = jest.fn();
    render(<JikiVideoPlayer playbackId="abc" onPlaying={onPlaying} />);

    // Enter the playing-but-stalled state: not paused, but waiting for data.
    act(() => fakeStore.set({ paused: false, waiting: true }));
    onPlaying.mockClear();

    // Data arrives, stall clears — this is the DOM `playing` moment.
    act(() => fakeStore.set({ waiting: false }));
    expect(onPlaying).toHaveBeenCalledTimes(1);
  });

  it("does not fire onPlaying while still stalled", () => {
    const onPlaying = jest.fn();
    render(<JikiVideoPlayer playbackId="abc" onPlaying={onPlaying} />);

    act(() => fakeStore.set({ paused: false, waiting: true }));
    expect(onPlaying).not.toHaveBeenCalled();
  });

  it("fires onPlay on a pause → play transition (playback requested)", () => {
    const onPlay = jest.fn();
    render(<JikiVideoPlayer playbackId="abc" onPlay={onPlay} />);

    expect(onPlay).not.toHaveBeenCalled();
    act(() => fakeStore.set({ paused: false }));
    expect(onPlay).toHaveBeenCalledTimes(1);

    // A second notification with paused already false must not re-fire onPlay.
    act(() => fakeStore.set({ currentTime: 1 }));
    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  it("fires onSeeking before onTimeUpdate and suppresses timeupdate mid-seek", () => {
    const calls: string[] = [];
    const onSeeking = jest.fn(() => calls.push("seeking"));
    const onTimeUpdate = jest.fn(() => calls.push("timeupdate"));
    render(<JikiVideoPlayer playbackId="abc" onSeeking={onSeeking} onTimeUpdate={onTimeUpdate} />);

    // A forward scrub: seeking begins and currentTime jumps in the same commit.
    // onTimeUpdate must be suppressed while seeking so the scrubbed-to position is
    // never observed as naturally watched.
    act(() => fakeStore.set({ seeking: true, currentTime: 50 }));
    expect(onSeeking).toHaveBeenCalledTimes(1);
    expect(onTimeUpdate).not.toHaveBeenCalled();

    // Seek completes; subsequent natural advances fire onTimeUpdate.
    act(() => fakeStore.set({ seeking: false, currentTime: 51 }));
    expect(onTimeUpdate).toHaveBeenCalledTimes(1);

    // onSeeking must have preceded the first onTimeUpdate.
    expect(calls).toEqual(["seeking", "timeupdate"]);
  });

  it("fires onEnded once when playback reaches the end", () => {
    const onEnded = jest.fn();
    render(<JikiVideoPlayer playbackId="abc" onEnded={onEnded} />);

    act(() => fakeStore.set({ ended: true }));
    expect(onEnded).toHaveBeenCalledTimes(1);

    act(() => fakeStore.set({ currentTime: 99 }));
    expect(onEnded).toHaveBeenCalledTimes(1);
  });

  it("fires onCanPlay once when the player becomes ready", () => {
    const onCanPlay = jest.fn();
    render(<JikiVideoPlayer playbackId="abc" onCanPlay={onCanPlay} />);

    act(() => fakeStore.set({ canPlay: true }));
    expect(onCanPlay).toHaveBeenCalledTimes(1);
  });

  it("fires onLoadedMetadata when duration goes from 0 to a real value", () => {
    const onLoadedMetadata = jest.fn();
    render(<JikiVideoPlayer playbackId="abc" onLoadedMetadata={onLoadedMetadata} />);

    act(() => fakeStore.set({ duration: 120 }));
    expect(onLoadedMetadata).toHaveBeenCalledTimes(1);

    // A later duration change (e.g. re-manifest) must not re-fire it.
    act(() => fakeStore.set({ duration: 121 }));
    expect(onLoadedMetadata).toHaveBeenCalledTimes(1);
  });

  it("routes store errors through the error handler to onError", () => {
    const onError = jest.fn();
    render(<JikiVideoPlayer playbackId="abc" onError={onError} />);

    act(() => fakeStore.set({ error: { code: 1, message: "Playback aborted.", data: { muxCode: 2400000 } } }));
    expect(onError).toHaveBeenCalledTimes(1);
    expect((onError.mock.calls[0][0] as Error).message).toContain("code 1");
  });
});

describe("JikiVideoPlayer imperative handle", () => {
  it("reads currentTime and duration from the store state", () => {
    const ref = createRef<JikiVideoPlayerHandle>();
    render(<JikiVideoPlayer ref={ref} playbackId="abc" />);

    act(() => fakeStore.set({ currentTime: 42, duration: 300 }));
    expect(ref.current?.currentTime).toBe(42);
    expect(ref.current?.duration).toBe(300);
  });

  it("seeks the store when currentTime is assigned", () => {
    const ref = createRef<JikiVideoPlayerHandle>();
    render(<JikiVideoPlayer ref={ref} playbackId="abc" />);

    act(() => {
      ref.current!.currentTime = 75;
    });
    expect(fakeStore.seek).toHaveBeenCalledWith(75);
  });

  it("delegates play and pause to the store", () => {
    const ref = createRef<JikiVideoPlayerHandle>();
    render(<JikiVideoPlayer ref={ref} playbackId="abc" />);

    act(() => {
      void ref.current!.play();
    });
    expect(fakeStore.play).toHaveBeenCalledTimes(1);

    act(() => ref.current!.pause());
    expect(fakeStore.pause).toHaveBeenCalledTimes(1);
  });
});
