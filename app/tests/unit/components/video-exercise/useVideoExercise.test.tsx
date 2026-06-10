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
