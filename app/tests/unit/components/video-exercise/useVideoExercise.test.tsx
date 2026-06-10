import { act, renderHook, waitFor } from "@testing-library/react";
import { useVideoExercise } from "@/components/video-exercise/lib/useVideoExercise";

jest.mock("@/lib/api/lessons", () => ({
  fetchUserLesson: jest.fn(),
  markLessonComplete: jest.fn()
}));

jest.mock("@/lib/reportError", () => ({
  reportError: jest.fn()
}));

jest.mock("@/lib/modal", () => ({
  showConfirmation: jest.fn()
}));

const mockRouterPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockRouterPush, replace: jest.fn() })
}));

import { fetchUserLesson, markLessonComplete } from "@/lib/api/lessons";
import { reportError } from "@/lib/reportError";
import { showConfirmation } from "@/lib/modal";

const mockedFetchUserLesson = fetchUserLesson as jest.MockedFunction<typeof fetchUserLesson>;
const mockedMarkLessonComplete = markLessonComplete as jest.MockedFunction<typeof markLessonComplete>;
const mockedReportError = reportError as jest.MockedFunction<typeof reportError>;
const mockedShowConfirmation = showConfirmation as jest.MockedFunction<typeof showConfirmation>;

const SLUG = "intro-to-jiki";
const FIRST_VIDEO_SLUG = "welcome-to-jiki";

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

describe("useVideoExercise welcome-video skip flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedFetchUserLesson.mockResolvedValue({ status: "not_started" } as unknown as Awaited<
      ReturnType<typeof fetchUserLesson>
    >);
    mockedMarkLessonComplete.mockResolvedValue({ meta: { events: [] } });
  });

  function attachPlayerWithPause(result: { current: ReturnType<typeof useVideoExercise> }) {
    const pause = jest.fn();
    (result.current.playerRef as { current: unknown }).current = {
      play: jest.fn(),
      pause,
      currentTime: 5,
      duration: 100
    };
    return { pause };
  }

  it("exposes canSkip=true only on the first welcome video before it's watched", async () => {
    const { result } = renderHook(() => useVideoExercise(FIRST_VIDEO_SLUG));
    await waitFor(() => expect(mockedFetchUserLesson).toHaveBeenCalled());
    expect(result.current.canSkip).toBe(true);
  });

  it("exposes canSkip=false on non-welcome video lessons", async () => {
    const { result } = renderHook(() => useVideoExercise(SLUG));
    await waitFor(() => expect(mockedFetchUserLesson).toHaveBeenCalled());
    expect(result.current.canSkip).toBe(false);
  });

  it("exposes canSkip=false on the welcome video once it's already completed", async () => {
    mockedFetchUserLesson.mockResolvedValue({ status: "completed" } as unknown as Awaited<
      ReturnType<typeof fetchUserLesson>
    >);
    const { result } = renderHook(() => useVideoExercise(FIRST_VIDEO_SLUG));
    await waitFor(() => expect(result.current.isAlreadyCompleted).toBe(true));
    expect(result.current.canSkip).toBe(false);
  });

  it("pauses the player and shows a confirmation modal when Continue is hit on the welcome video", async () => {
    const { result } = renderHook(() => useVideoExercise(FIRST_VIDEO_SLUG));
    await waitFor(() => expect(mockedFetchUserLesson).toHaveBeenCalled());
    const { pause } = attachPlayerWithPause(result);

    await act(async () => {
      await result.current.handleContinue();
    });

    expect(pause).toHaveBeenCalledTimes(1);
    expect(mockedShowConfirmation).toHaveBeenCalledTimes(1);
    expect(mockedMarkLessonComplete).not.toHaveBeenCalled();
  });

  it("marks the lesson complete and navigates when the user confirms the skip", async () => {
    const { result } = renderHook(() => useVideoExercise(FIRST_VIDEO_SLUG));
    await waitFor(() => expect(mockedFetchUserLesson).toHaveBeenCalled());
    attachPlayerWithPause(result);

    await act(async () => {
      await result.current.handleContinue();
    });

    const confirmArgs = mockedShowConfirmation.mock.calls[0][0];

    await act(async () => {
      confirmArgs.onConfirm?.();
      await Promise.resolve();
      await Promise.resolve();
    });

    await waitFor(() => expect(mockedMarkLessonComplete).toHaveBeenCalledWith(FIRST_VIDEO_SLUG));
    await waitFor(() => expect(mockRouterPush).toHaveBeenCalledWith(`/dashboard?completed=${FIRST_VIDEO_SLUG}`));
  });

  it("does not mark the lesson complete if the user cancels the skip", async () => {
    const { result } = renderHook(() => useVideoExercise(FIRST_VIDEO_SLUG));
    await waitFor(() => expect(mockedFetchUserLesson).toHaveBeenCalled());
    attachPlayerWithPause(result);

    await act(async () => {
      await result.current.handleContinue();
    });

    expect(mockedShowConfirmation).toHaveBeenCalledTimes(1);
    expect(mockedMarkLessonComplete).not.toHaveBeenCalled();
    expect(mockRouterPush).not.toHaveBeenCalled();
    expect(mockedReportError).not.toHaveBeenCalled();
  });

  it("skips the confirmation modal once the welcome video has been watched fully", async () => {
    const { result } = renderHook(() => useVideoExercise(FIRST_VIDEO_SLUG));
    await waitFor(() => expect(mockedFetchUserLesson).toHaveBeenCalled());
    attachPlayerWithPause(result);

    act(() => {
      result.current.handleVideoEnd();
    });

    await act(async () => {
      await result.current.handleContinue();
    });

    expect(mockedShowConfirmation).not.toHaveBeenCalled();
    await waitFor(() => expect(mockedMarkLessonComplete).toHaveBeenCalledWith(FIRST_VIDEO_SLUG));
  });
});
