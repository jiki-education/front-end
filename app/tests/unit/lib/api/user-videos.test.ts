import { fetchUserVideo, fetchUserVideos, updateUserVideoPercentage } from "@/lib/api/user-videos";

jest.mock("@/lib/api/client", () => ({
  api: {
    get: jest.fn(),
    patch: jest.fn()
  }
}));

import { api } from "@/lib/api/client";

const mockApi = api as jest.Mocked<typeof api>;

const VIDEO_DATA = {
  uuid: "065e457e-4e9d-478b-bd0a-bbe384d8347f",
  watched_percentage: 42,
  status: "started" as const,
  completed_at: null
};

describe("user-videos API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchUserVideos", () => {
    it("returns the user_videos array on success", async () => {
      mockApi.get.mockResolvedValue({
        data: { user_videos: [VIDEO_DATA] },
        status: 200,
        headers: new Headers()
      });

      const result = await fetchUserVideos();

      expect(mockApi.get).toHaveBeenCalledWith("/internal/user_videos");
      expect(result).toEqual([VIDEO_DATA]);
    });

    it("returns an empty array when the request fails", async () => {
      mockApi.get.mockRejectedValue(new Error("network down"));

      const result = await fetchUserVideos();

      expect(result).toEqual([]);
    });
  });

  describe("fetchUserVideo", () => {
    it("returns the user_video on success", async () => {
      mockApi.get.mockResolvedValue({
        data: { user_video: VIDEO_DATA },
        status: 200,
        headers: new Headers()
      });

      const result = await fetchUserVideo(VIDEO_DATA.uuid);

      expect(mockApi.get).toHaveBeenCalledWith(`/internal/user_videos/${VIDEO_DATA.uuid}`);
      expect(result).toEqual(VIDEO_DATA);
    });

    it("returns null when the request fails", async () => {
      mockApi.get.mockRejectedValue(new Error("404"));

      const result = await fetchUserVideo(VIDEO_DATA.uuid);

      expect(result).toBeNull();
    });
  });

  describe("updateUserVideoPercentage", () => {
    it("PATCHes watched_percentage rounded to an integer", async () => {
      mockApi.patch.mockResolvedValue({} as never);

      await updateUserVideoPercentage(VIDEO_DATA.uuid, 42.7);

      expect(mockApi.patch).toHaveBeenCalledWith(
        `/internal/user_videos/${VIDEO_DATA.uuid}`,
        { watched_percentage: 43 },
        undefined,
        false
      );
    });
  });
});
