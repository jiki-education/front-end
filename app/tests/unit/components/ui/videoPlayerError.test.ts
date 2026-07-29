import { handleVideoPlayerError, type VideoMediaError } from "@/components/ui/videoPlayerError";
import { reportError } from "@/lib/reportError";

jest.mock("@/lib/reportError", () => ({
  reportError: jest.fn()
}));

const mockReportError = reportError as jest.Mock;

describe("handleVideoPlayerError", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("does not report transient network errors (code 2) to Sentry but still logs them", () => {
    handleVideoPlayerError({
      code: 2,
      data: { muxCode: 2000002 },
      message: "A network error caused the media download to fail."
    });

    expect(mockReportError).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const [logged] = consoleErrorSpy.mock.calls[0];
    expect(logged).toBeInstanceOf(Error);
    expect((logged as Error).message).toContain("code 2");
    expect((logged as Error).message).toContain("muxCode 2000002");
  });

  it("reports errors with rich detail (code, muxCode, message) to Sentry", () => {
    // code 1 (MEDIA_ERR_ABORTED) is not one of the suppressed classes, so it takes
    // the reporting path and exercises the full rich-detail message formatting.
    handleVideoPlayerError({ code: 1, data: { muxCode: 2400000 }, message: "Playback aborted." });

    expect(mockReportError).toHaveBeenCalledTimes(1);
    const reported = mockReportError.mock.calls[0][0] as Error;
    expect(reported).toBeInstanceOf(Error);
    expect(reported.message).toBe("VideoPlayer error: code 1: muxCode 2400000: Playback aborted.");
  });

  it("passes the formatted error to the onError callback", () => {
    const onError = jest.fn();
    handleVideoPlayerError({ code: 2, message: "network" }, onError);

    expect(onError).toHaveBeenCalledTimes(1);
    expect((onError.mock.calls[0][0] as Error).message).toContain("code 2");
  });

  it("does not report unsupported-source errors (code 4) to Sentry but still logs them", () => {
    // code 4 (MEDIA_ERR_SRC_NOT_SUPPORTED) is a per-viewer environment problem
    // (dropped HLS fetch or a client with no compatible codec/rendition), not a
    // broken upload, so it stays out of Sentry.
    handleVideoPlayerError({
      code: 4,
      data: { muxCode: 2404000 },
      message:
        "An unsupported error occurred. The server or network failed, or your browser does not support this format."
    });

    expect(mockReportError).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const [logged] = consoleErrorSpy.mock.calls[0];
    expect((logged as Error).message).toContain("code 4");
    expect((logged as Error).message).toContain("muxCode 2404000");
  });

  it("does not report decode errors (code 3) to Sentry but still logs them", () => {
    // code 3 (MEDIA_ERR_DECODE) comes from codec-limited clients (Firefox/Linux
    // without H.264, in-app webviews), not corrupt media or an app bug.
    handleVideoPlayerError({
      code: 3,
      data: { muxCode: 2000003 },
      message:
        "The media playback was aborted due to a corruption problem or because the media used features your browser did not support."
    });

    expect(mockReportError).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const [logged] = consoleErrorSpy.mock.calls[0];
    expect((logged as Error).message).toContain("code 3");
    expect((logged as Error).message).toContain("muxCode 2000003");
  });

  it("does not report codeless errors with no detail but still logs them", () => {
    // No code and no message means nothing actionable — keep out of Sentry.
    handleVideoPlayerError(null);

    expect(mockReportError).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect((consoleErrorSpy.mock.calls[0][0] as Error).message).toBe("VideoPlayer error");
  });

  it("does not report an error object with no code and no message but still logs it", () => {
    const emptyError: VideoMediaError = {};
    handleVideoPlayerError(emptyError);

    expect(mockReportError).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect((consoleErrorSpy.mock.calls[0][0] as Error).message).toBe("VideoPlayer error");
  });
});
