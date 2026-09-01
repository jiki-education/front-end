import { videoThumbnailUrl } from "@/lib/videos/thumbnail";

describe("videoThumbnailUrl", () => {
  it("asks Mux for the exact dimensions", () => {
    expect(videoThumbnailUrl({ provider: "mux", id: "abc123" }, 1280, 720)).toBe(
      "https://image.mux.com/abc123/thumbnail.jpg?width=1280&height=720"
    );
  });

  it("picks YouTube's full-resolution frame at or above 640 wide", () => {
    expect(videoThumbnailUrl({ provider: "youtube", id: "abc123" }, 1280, 720)).toBe(
      "https://i.ytimg.com/vi/abc123/maxresdefault.jpg"
    );
    expect(videoThumbnailUrl({ provider: "youtube", id: "abc123" }, 640, 360)).toBe(
      "https://i.ytimg.com/vi/abc123/maxresdefault.jpg"
    );
  });

  it("drops to YouTube's smaller frame below 640 wide", () => {
    expect(videoThumbnailUrl({ provider: "youtube", id: "abc123" }, 400, 225)).toBe(
      "https://i.ytimg.com/vi/abc123/hqdefault.jpg"
    );
  });
});
