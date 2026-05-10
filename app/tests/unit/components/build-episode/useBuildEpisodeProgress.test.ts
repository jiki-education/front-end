import { act, renderHook, waitFor } from "@testing-library/react";
import { useBuildEpisodeProgress } from "@/components/build-episode/lib/useBuildEpisodeProgress";

jest.mock("@/lib/api/user-videos", () => ({
  fetchUserVideo: jest.fn(),
  updateUserVideoPercentage: jest.fn()
}));

import { fetchUserVideo, updateUserVideoPercentage } from "@/lib/api/user-videos";

const mockedFetch = fetchUserVideo as jest.MockedFunction<typeof fetchUserVideo>;
const mockedPatch = updateUserVideoPercentage as jest.MockedFunction<typeof updateUserVideoPercentage>;

const UUID = "065e457e-4e9d-478b-bd0a-bbe384d8347f";

function makeYouTubeEvent(data: { currentTime: number; duration: number; seekTo: jest.Mock }) {
  const target = {
    getCurrentTime: () => data.currentTime,
    getDuration: () => data.duration,
    seekTo: data.seekTo
  };
  return { target } as unknown as Parameters<ReturnType<typeof useBuildEpisodeProgress>["handleYouTubeReady"]>[0];
}

describe("useBuildEpisodeProgress", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedPatch.mockResolvedValue(undefined);
  });

  it("reports rounded percentage and dedupes repeated values", async () => {
    mockedFetch.mockResolvedValue(null);
    const { result } = renderHook(() => useBuildEpisodeProgress(UUID));

    await waitFor(() => expect(mockedFetch).toHaveBeenCalledWith(UUID));
    await act(async () => {
      await Promise.resolve();
    });

    const seekTo = jest.fn();
    act(() => {
      result.current.handleYouTubeReady(makeYouTubeEvent({ currentTime: 30, duration: 100, seekTo }));
    });

    // PLAYING state with currentTime 30 / duration 100 = 30%
    act(() => {
      result.current.handleYouTubeStateChange({
        data: 1,
        target: { getCurrentTime: () => 30, getDuration: () => 100, seekTo }
      });
    });

    expect(mockedPatch).toHaveBeenCalledWith(UUID, 30);

    // Same percentage again — should not be reported
    mockedPatch.mockClear();
    act(() => {
      result.current.handleYouTubeStateChange({
        data: 1,
        target: { getCurrentTime: () => 30.4, getDuration: () => 100, seekTo }
      });
    });
    expect(mockedPatch).not.toHaveBeenCalled();
  });

  it("reports 100% on the YouTube ENDED state", async () => {
    mockedFetch.mockResolvedValue(null);
    const { result } = renderHook(() => useBuildEpisodeProgress(UUID));
    await waitFor(() => expect(mockedFetch).toHaveBeenCalled());
    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      result.current.handleYouTubeStateChange({
        data: 0,
        target: { getCurrentTime: () => 100, getDuration: () => 100, seekTo: jest.fn() }
      });
    });

    expect(mockedPatch).toHaveBeenCalledWith(UUID, 100);
  });

  it("seeks to (watched - 1)% on YouTube ready when not completed", async () => {
    mockedFetch.mockResolvedValue({
      uuid: UUID,
      watched_percentage: 50,
      status: "started",
      completed_at: null
    });
    const { result } = renderHook(() => useBuildEpisodeProgress(UUID));
    await waitFor(() => expect(mockedFetch).toHaveBeenCalled());
    await act(async () => {
      await Promise.resolve();
    });

    const seekTo = jest.fn();
    act(() => {
      result.current.handleYouTubeReady(makeYouTubeEvent({ currentTime: 0, duration: 200, seekTo }));
    });

    // (50 - 1)% of 200s duration = 98s
    expect(seekTo).toHaveBeenCalledWith(98, true);
  });

  it("does not seek when video is completed", async () => {
    mockedFetch.mockResolvedValue({
      uuid: UUID,
      watched_percentage: 100,
      status: "completed",
      completed_at: "2026-05-10T10:00:00Z"
    });
    const { result } = renderHook(() => useBuildEpisodeProgress(UUID));
    await waitFor(() => expect(mockedFetch).toHaveBeenCalled());
    await act(async () => {
      await Promise.resolve();
    });

    const seekTo = jest.fn();
    act(() => {
      result.current.handleYouTubeReady(makeYouTubeEvent({ currentTime: 0, duration: 200, seekTo }));
    });

    expect(seekTo).not.toHaveBeenCalled();
  });

  it("does not seek when no user_video exists", async () => {
    mockedFetch.mockResolvedValue(null);
    const { result } = renderHook(() => useBuildEpisodeProgress(UUID));
    await waitFor(() => expect(mockedFetch).toHaveBeenCalled());
    await act(async () => {
      await Promise.resolve();
    });

    const seekTo = jest.fn();
    act(() => {
      result.current.handleYouTubeReady(makeYouTubeEvent({ currentTime: 0, duration: 200, seekTo }));
    });

    expect(seekTo).not.toHaveBeenCalled();
  });
});
