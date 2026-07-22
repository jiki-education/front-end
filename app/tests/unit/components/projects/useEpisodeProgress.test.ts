import { act, renderHook, waitFor } from "@testing-library/react";
import { useEpisodeProgress } from "@/components/projects/lib/useEpisodeProgress";

jest.mock("@/lib/api/user-videos", () => ({
  fetchUserVideo: jest.fn(),
  updateUserVideoPercentage: jest.fn()
}));
jest.mock("@/lib/auth/authStore");

import { fetchUserVideo, updateUserVideoPercentage } from "@/lib/api/user-videos";
import { useAuthStore } from "@/lib/auth/authStore";

const mockedFetch = fetchUserVideo as jest.MockedFunction<typeof fetchUserVideo>;
const mockedPatch = updateUserVideoPercentage as jest.MockedFunction<typeof updateUserVideoPercentage>;
const mockedUseAuthStore = useAuthStore as unknown as jest.Mock;

function setAuthUser(user: { membership_type: string } | null) {
  const state = { user };
  mockedUseAuthStore.mockImplementation((selector?: (s: typeof state) => unknown) =>
    selector ? selector(state) : state
  );
}

const UUID = "065e457e-4e9d-478b-bd0a-bbe384d8347f";

function makeYouTubeEvent(data: { currentTime: number; duration: number; seekTo: jest.Mock }) {
  const target = {
    getCurrentTime: () => data.currentTime,
    getDuration: () => data.duration,
    seekTo: data.seekTo
  };
  return { target } as unknown as Parameters<ReturnType<typeof useEpisodeProgress>["handleYouTubeReady"]>[0];
}

describe("useEpisodeProgress", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedPatch.mockResolvedValue(undefined);
    setAuthUser({ membership_type: "standard" });
  });

  it("neither fetches nor reports progress when logged out", async () => {
    setAuthUser(null);
    mockedFetch.mockResolvedValue(null);
    const { result } = renderHook(() => useEpisodeProgress(UUID, "youtube"));

    const seekTo = jest.fn();
    act(() => {
      result.current.handleYouTubeReady(makeYouTubeEvent({ currentTime: 0, duration: 100, seekTo }));
      result.current.handleYouTubeStateChange({
        data: 0,
        target: { getCurrentTime: () => 100, getDuration: () => 100, seekTo }
      });
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(mockedFetch).not.toHaveBeenCalled();
    expect(mockedPatch).not.toHaveBeenCalled();
  });

  it("reports rounded percentage and dedupes repeated values", async () => {
    mockedFetch.mockResolvedValue(null);
    const { result } = renderHook(() => useEpisodeProgress(UUID));

    await waitFor(() => expect(mockedFetch).toHaveBeenCalledWith(UUID));
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
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
    const { result } = renderHook(() => useEpisodeProgress(UUID));
    await waitFor(() => expect(mockedFetch).toHaveBeenCalled());
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
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
    const { result } = renderHook(() => useEpisodeProgress(UUID));
    await waitFor(() => expect(mockedFetch).toHaveBeenCalled());
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
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
    const { result } = renderHook(() => useEpisodeProgress(UUID));
    await waitFor(() => expect(mockedFetch).toHaveBeenCalled());
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const seekTo = jest.fn();
    act(() => {
      result.current.handleYouTubeReady(makeYouTubeEvent({ currentTime: 0, duration: 200, seekTo }));
    });

    expect(seekTo).not.toHaveBeenCalled();
  });

  it("resets internal state when the uuid changes", async () => {
    const FIRST = UUID;
    const SECOND = "f3e23284-2470-42bb-8782-9aad2eaf3e2e";
    mockedFetch.mockResolvedValue(null);

    const { result, rerender } = renderHook(({ uuid }) => useEpisodeProgress(uuid, "youtube"), {
      initialProps: { uuid: FIRST }
    });

    await waitFor(() => expect(mockedFetch).toHaveBeenCalledWith(FIRST));
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Watch the first video to 100% so dedupe state and restore flag are set.
    act(() => {
      result.current.handleYouTubeStateChange({
        data: 0,
        target: { getCurrentTime: () => 100, getDuration: () => 100, seekTo: jest.fn() }
      });
    });
    expect(mockedPatch).toHaveBeenCalledWith(FIRST, 100);

    // Switch to a second episode mid-session.
    mockedFetch.mockResolvedValue({
      uuid: SECOND,
      watched_percentage: 25,
      status: "started",
      completed_at: null
    });
    mockedPatch.mockClear();

    rerender({ uuid: SECOND });
    await waitFor(() => expect(mockedFetch).toHaveBeenCalledWith(SECOND));
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Position should restore for the new video despite hasRestoredPositionRef
    // having been set during the first one.
    const seekTo = jest.fn();
    act(() => {
      result.current.handleYouTubeReady(makeYouTubeEvent({ currentTime: 0, duration: 200, seekTo }));
    });
    expect(seekTo).toHaveBeenCalledWith(48, true); // (25 - 1)% of 200s

    // Reporting at 100% should not be deduped against the previous video.
    act(() => {
      result.current.handleYouTubeStateChange({
        data: 0,
        target: { getCurrentTime: () => 200, getDuration: () => 200, seekTo }
      });
    });
    expect(mockedPatch).toHaveBeenCalledWith(SECOND, 100);
  });

  it("does not seek when no user_video exists", async () => {
    mockedFetch.mockResolvedValue(null);
    const { result } = renderHook(() => useEpisodeProgress(UUID));
    await waitFor(() => expect(mockedFetch).toHaveBeenCalled());
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const seekTo = jest.fn();
    act(() => {
      result.current.handleYouTubeReady(makeYouTubeEvent({ currentTime: 0, duration: 200, seekTo }));
    });

    expect(seekTo).not.toHaveBeenCalled();
  });
});
