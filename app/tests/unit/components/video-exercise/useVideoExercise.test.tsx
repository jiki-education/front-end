import { act, renderHook, waitFor } from "@testing-library/react";
import { useVideoExercise } from "@/components/video-exercise/lib/useVideoExercise";

jest.mock("@/lib/api/lessons", () => ({
  fetchUserLesson: jest.fn(),
  markLessonComplete: jest.fn()
}));

jest.mock("@/lib/reportError", () => ({
  reportError: jest.fn()
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() })
}));

import { fetchUserLesson } from "@/lib/api/lessons";
import { reportError } from "@/lib/reportError";

const mockedFetchUserLesson = fetchUserLesson as jest.MockedFunction<typeof fetchUserLesson>;
const mockedReportError = reportError as jest.MockedFunction<typeof reportError>;

const SLUG = "intro-to-jiki";

function attachPlayer(result: { current: ReturnType<typeof useVideoExercise> }, play: jest.Mock, currentTime = 0) {
  // Simulate MuxPlayer attaching its ref
  (result.current.playerRef as { current: unknown }).current = {
    play,
    currentTime,
    duration: 100
  };
}

describe("useVideoExercise autoplay error handling", () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedFetchUserLesson.mockResolvedValue({ status: "not_started" } as unknown as Awaited<
      ReturnType<typeof fetchUserLesson>
    >);
    warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it("reveals the player and does not report when play() rejects with NotAllowedError", async () => {
    const notAllowed = Object.assign(new Error("blocked"), { name: "NotAllowedError" });
    const play = jest.fn().mockRejectedValue(notAllowed);

    const { result } = renderHook(() => useVideoExercise(SLUG));
    await waitFor(() => expect(mockedFetchUserLesson).toHaveBeenCalled());

    attachPlayer(result, play);

    await act(async () => {
      result.current.autoplay();
      await Promise.resolve();
    });

    expect(play).toHaveBeenCalledTimes(1);
    expect(result.current.isVideoVisible).toBe(true);
    expect(mockedReportError).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith("Autoplay was prevented:", "blocked");
  });

  it("reveals the player and does not report when play() rejects with AbortError", async () => {
    const aborted = Object.assign(new Error("interrupted by load"), { name: "AbortError" });
    const play = jest.fn().mockRejectedValue(aborted);

    const { result } = renderHook(() => useVideoExercise(SLUG));
    await waitFor(() => expect(mockedFetchUserLesson).toHaveBeenCalled());

    attachPlayer(result, play);

    await act(async () => {
      result.current.autoplay();
      await Promise.resolve();
    });

    expect(play).toHaveBeenCalledTimes(1);
    expect(result.current.isVideoVisible).toBe(true);
    expect(mockedReportError).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith("Autoplay was prevented:", "interrupted by load");
  });

  it("reveals the player AND reports to Sentry for unexpected play() errors", async () => {
    const unexpected = Object.assign(new Error("boom"), { name: "TypeError" });
    const play = jest.fn().mockRejectedValue(unexpected);

    const { result } = renderHook(() => useVideoExercise(SLUG));
    await waitFor(() => expect(mockedFetchUserLesson).toHaveBeenCalled());

    attachPlayer(result, play);

    await act(async () => {
      result.current.autoplay();
      await Promise.resolve();
    });

    expect(play).toHaveBeenCalledTimes(1);
    expect(result.current.isVideoVisible).toBe(true);
    expect(mockedReportError).toHaveBeenCalledWith(unexpected);
  });

  it("only attempts autoplay once even if called multiple times", async () => {
    const play = jest.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() => useVideoExercise(SLUG));
    await waitFor(() => expect(mockedFetchUserLesson).toHaveBeenCalled());

    attachPlayer(result, play);

    await act(async () => {
      result.current.autoplay();
      result.current.autoplay();
      result.current.autoplay();
      await Promise.resolve();
    });

    expect(play).toHaveBeenCalledTimes(1);
  });
});

describe("useVideoExercise first-watch seek cap", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedFetchUserLesson.mockResolvedValue({ status: "not_started" } as unknown as Awaited<
      ReturnType<typeof fetchUserLesson>
    >);
  });

  function setPlayerTime(result: { current: ReturnType<typeof useVideoExercise> }, currentTime: number) {
    (result.current.playerRef.current as { currentTime: number }).currentTime = currentTime;
  }

  it("does not cap seeking before any playback on a first watch", async () => {
    const { result } = renderHook(() => useVideoExercise(SLUG));
    await waitFor(() => expect(mockedFetchUserLesson).toHaveBeenCalled());
    attachPlayer(result, jest.fn(), 0);

    expect(result.current.isAlreadyCompleted).toBe(false);

    // Nothing watched yet, so any forward seek is snapped back to 0.
    setPlayerTime(result, 40);
    act(() => result.current.handleSeeking());
    expect(result.current.playerRef.current!.currentTime).toBe(0);
  });

  it("does not lower the watched ceiling when playback time goes backwards", async () => {
    const { result } = renderHook(() => useVideoExercise(SLUG));
    await waitFor(() => expect(mockedFetchUserLesson).toHaveBeenCalled());
    attachPlayer(result, jest.fn(), 60);

    act(() => result.current.handleTimeUpdate());

    // A later, lower timeupdate (e.g. after rewinding) must not lower the cap.
    setPlayerTime(result, 20);
    act(() => result.current.handleTimeUpdate());

    // Ceiling is still 60: a seek to 50 is allowed, a seek to 80 is clamped.
    setPlayerTime(result, 80);
    act(() => result.current.handleSeeking());
    expect(result.current.playerRef.current!.currentTime).toBe(60);
  });

  it("snaps the player back when seeking past the watched ceiling", async () => {
    const { result } = renderHook(() => useVideoExercise(SLUG));
    await waitFor(() => expect(mockedFetchUserLesson).toHaveBeenCalled());
    attachPlayer(result, jest.fn(), 30);

    // Watch up to 30s.
    act(() => result.current.handleTimeUpdate());

    // Try to scrub ahead to 80s.
    setPlayerTime(result, 80);
    act(() => result.current.handleSeeking());

    expect(result.current.playerRef.current!.currentTime).toBe(30);
  });

  it("does not raise the ceiling when scrubbing forward is clamped", async () => {
    const { result } = renderHook(() => useVideoExercise(SLUG));
    await waitFor(() => expect(mockedFetchUserLesson).toHaveBeenCalled());
    attachPlayer(result, jest.fn(), 30);

    act(() => result.current.handleTimeUpdate());

    // Attempt to scrub ahead; clamp snaps it back to 30.
    setPlayerTime(result, 80);
    act(() => result.current.handleSeeking());
    expect(result.current.playerRef.current!.currentTime).toBe(30);

    // A timeupdate at the clamped position must not bump the ceiling past 30.
    act(() => result.current.handleTimeUpdate());
    setPlayerTime(result, 50);
    act(() => result.current.handleSeeking());
    expect(result.current.playerRef.current!.currentTime).toBe(30);
  });

  it("allows seeking backwards within the watched region", async () => {
    const { result } = renderHook(() => useVideoExercise(SLUG));
    await waitFor(() => expect(mockedFetchUserLesson).toHaveBeenCalled());
    attachPlayer(result, jest.fn(), 50);

    act(() => result.current.handleTimeUpdate());

    // Rewind to 10s — within what's been watched, so it must not be clamped.
    setPlayerTime(result, 10);
    act(() => result.current.handleSeeking());

    expect(result.current.playerRef.current!.currentTime).toBe(10);
  });

  it("lifts the cap once the video ends", async () => {
    const { result } = renderHook(() => useVideoExercise(SLUG));
    await waitFor(() => expect(mockedFetchUserLesson).toHaveBeenCalled());
    attachPlayer(result, jest.fn(), 100);

    act(() => result.current.handleVideoEnd());

    // Seeking anywhere is now allowed.
    setPlayerTime(result, 5);
    act(() => result.current.handleSeeking());
    expect(result.current.playerRef.current!.currentTime).toBe(5);
  });

  it("does not cap seeking for an already-completed lesson", async () => {
    mockedFetchUserLesson.mockResolvedValue({ status: "completed" } as unknown as Awaited<
      ReturnType<typeof fetchUserLesson>
    >);

    const { result } = renderHook(() => useVideoExercise(SLUG));
    await waitFor(() => expect(result.current.isAlreadyCompleted).toBe(true));
    attachPlayer(result, jest.fn(), 90);

    // Free scrubbing anywhere.
    setPlayerTime(result, 95);
    act(() => result.current.handleSeeking());
    expect(result.current.playerRef.current!.currentTime).toBe(95);
  });

  it("flashes the skip hint when a forward seek is blocked", async () => {
    const { result } = renderHook(() => useVideoExercise(SLUG));
    await waitFor(() => expect(mockedFetchUserLesson).toHaveBeenCalled());
    attachPlayer(result, jest.fn(), 30);

    act(() => result.current.handleTimeUpdate());
    expect(result.current.showSkipHint).toBe(false);

    setPlayerTime(result, 80);
    act(() => result.current.handleSeeking());

    expect(result.current.showSkipHint).toBe(true);
  });

  it("does not flash the skip hint for an allowed backward seek", async () => {
    const { result } = renderHook(() => useVideoExercise(SLUG));
    await waitFor(() => expect(mockedFetchUserLesson).toHaveBeenCalled());
    attachPlayer(result, jest.fn(), 50);

    act(() => result.current.handleTimeUpdate());

    setPlayerTime(result, 10);
    act(() => result.current.handleSeeking());

    expect(result.current.showSkipHint).toBe(false);
  });

  it("auto-dismisses the skip hint after the timeout", async () => {
    jest.useFakeTimers();
    try {
      const { result } = renderHook(() => useVideoExercise(SLUG));
      // fetchUserLesson resolves via microtask; flush it under fake timers.
      await act(async () => {
        await Promise.resolve();
      });
      attachPlayer(result, jest.fn(), 30);

      act(() => result.current.handleTimeUpdate());
      setPlayerTime(result, 80);
      act(() => result.current.handleSeeking());
      expect(result.current.showSkipHint).toBe(true);

      act(() => {
        jest.advanceTimersByTime(2500);
      });
      expect(result.current.showSkipHint).toBe(false);
    } finally {
      jest.useRealTimers();
    }
  });
});
