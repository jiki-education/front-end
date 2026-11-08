import { act, renderHook } from "@testing-library/react";
import { useWalkthroughProgress } from "@/lib/modal/modals/useWalkthroughProgress";

jest.mock("@/lib/api/lessons", () => ({
  updateWalkthroughVideoPercentage: jest.fn()
}));

import { updateWalkthroughVideoPercentage } from "@/lib/api/lessons";

const mockedPatch = updateWalkthroughVideoPercentage as jest.MockedFunction<typeof updateWalkthroughVideoPercentage>;

const LESSON = "recursion-deep-dive";
const STORAGE_KEY = `walkthrough-progress-${LESSON}`;

function ytTarget(data: { currentTime: number; duration: number; seekTo: jest.Mock }) {
  return {
    getCurrentTime: () => data.currentTime,
    getDuration: () => data.duration,
    seekTo: data.seekTo
  } as unknown as Parameters<ReturnType<typeof useWalkthroughProgress>["handleYouTubeReady"]>[0]["target"];
}

describe("useWalkthroughProgress (YouTube)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedPatch.mockResolvedValue(undefined);
    localStorage.clear();
  });

  // Seeking a cued player starts playback, which YouTube won't count.
  it("never seeks on ready, even with a saved position", () => {
    localStorage.setItem(STORAGE_KEY, "42");
    const { result } = renderHook(() => useWalkthroughProgress(LESSON, "youtube"));

    const seekTo = jest.fn();
    act(() => {
      result.current.handleYouTubeReady({ target: ytTarget({ currentTime: 0, duration: 200, seekTo }) });
    });

    expect(seekTo).not.toHaveBeenCalled();
  });

  it("restores the saved position once playback starts", () => {
    localStorage.setItem(STORAGE_KEY, "42");
    const { result } = renderHook(() => useWalkthroughProgress(LESSON, "youtube"));

    const seekTo = jest.fn();
    act(() => {
      result.current.handleYouTubeReady({ target: ytTarget({ currentTime: 0, duration: 200, seekTo }) });
      result.current.handleYouTubeStateChange({
        data: 1,
        target: ytTarget({ currentTime: 0, duration: 200, seekTo })
      });
    });

    expect(seekTo).toHaveBeenCalledWith(42, true);
  });

  it("restores at most once", () => {
    localStorage.setItem(STORAGE_KEY, "42");
    const { result } = renderHook(() => useWalkthroughProgress(LESSON, "youtube"));

    const seekTo = jest.fn();
    act(() => {
      result.current.handleYouTubeStateChange({
        data: 1,
        target: ytTarget({ currentTime: 0, duration: 200, seekTo })
      });
      result.current.handleYouTubeStateChange({
        data: 1,
        target: ytTarget({ currentTime: 42, duration: 200, seekTo })
      });
    });

    expect(seekTo).toHaveBeenCalledTimes(1);
  });

  it("does not seek when there is nothing saved", () => {
    const { result } = renderHook(() => useWalkthroughProgress(LESSON, "youtube"));

    const seekTo = jest.fn();
    act(() => {
      result.current.handleYouTubeReady({ target: ytTarget({ currentTime: 0, duration: 200, seekTo }) });
      result.current.handleYouTubeStateChange({
        data: 1,
        target: ytTarget({ currentTime: 0, duration: 200, seekTo })
      });
    });

    expect(seekTo).not.toHaveBeenCalled();
  });
});
