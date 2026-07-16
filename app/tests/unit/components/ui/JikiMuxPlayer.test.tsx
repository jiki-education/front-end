import { render } from "@testing-library/react";
import JikiMuxPlayer from "@/components/ui/JikiMuxPlayer";
import { reportError } from "@/lib/reportError";

jest.mock("@/lib/reportError", () => ({
  reportError: jest.fn()
}));

// Capture the onError handler the wrapper wires onto MuxPlayer so we can invoke
// it with synthetic error events.
let capturedOnError: ((event: Event) => void) | undefined;
jest.mock("@mux/mux-player-react", () => ({
  __esModule: true,
  default: (props: { onError?: (event: Event) => void }) => {
    capturedOnError = props.onError;
    return <div data-testid="mux-player" />;
  }
}));

const mockReportError = reportError as jest.Mock;

function fireMuxError(detail: unknown): void {
  capturedOnError?.(new CustomEvent("error", { detail }));
}

describe("JikiMuxPlayer defaultOnError", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    render(<JikiMuxPlayer playbackId="test-playback-id" />);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("does not report transient network errors to Sentry but still logs them", () => {
    fireMuxError({ code: 2, muxCode: 2000002, message: "A network error caused the media download to fail." });

    expect(mockReportError).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const [logged] = consoleErrorSpy.mock.calls[0];
    expect(logged).toBeInstanceOf(Error);
    expect((logged as Error).message).toContain("code 2");
    expect((logged as Error).message).toContain("muxCode 2000002");
  });

  it("reports non-network errors with rich detail to Sentry", () => {
    fireMuxError({ code: 4, muxCode: 2404000, message: "Source not supported." });

    expect(mockReportError).toHaveBeenCalledTimes(1);
    const reported = mockReportError.mock.calls[0][0] as Error;
    expect(reported).toBeInstanceOf(Error);
    expect(reported.message).toBe("MuxPlayer error: code 4: muxCode 2404000: Source not supported.");
  });

  it("does not report decode errors to Sentry but still logs them", () => {
    // code 3 (MEDIA_ERR_DECODE) comes from codec-limited clients (Firefox/Linux
    // without H.264, in-app webviews), not corrupt media or an app bug.
    fireMuxError({
      code: 3,
      muxCode: 2000003,
      message:
        "The media playback was aborted due to a corruption problem or because the media used features your browser did not support."
    });

    expect(mockReportError).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const [logged] = consoleErrorSpy.mock.calls[0];
    expect(logged).toBeInstanceOf(Error);
    expect((logged as Error).message).toContain("code 3");
    expect((logged as Error).message).toContain("muxCode 2000003");
  });

  it("does not report codeless events with no detail but still logs them", () => {
    // No detail and no event.target.error means no code and no message. These are
    // duplicate signals of the paired rich CustomEvent, so keep them out of Sentry.
    fireMuxError(undefined);

    expect(mockReportError).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect((consoleErrorSpy.mock.calls[0][0] as Error).message).toBe("MuxPlayer error");
  });

  it("does not report a plain Event with a null event.target.error but still logs it", () => {
    // The native-video path dispatches a plain Event whose target.error is null.
    const target = document.createElement("video");
    Object.defineProperty(target, "error", { configurable: true, value: null });
    const event = new Event("error");
    Object.defineProperty(event, "target", { value: target });

    capturedOnError?.(event);

    expect(mockReportError).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect((consoleErrorSpy.mock.calls[0][0] as Error).message).toBe("MuxPlayer error");
  });

  it("reports an error that has a message but no code", () => {
    fireMuxError({ message: "Something broke." });

    expect(mockReportError).toHaveBeenCalledTimes(1);
    expect((mockReportError.mock.calls[0][0] as Error).message).toBe("MuxPlayer error: Something broke.");
  });

  it("reads error info from event.target.error on the native-video fallback path", () => {
    // No detail; the error hangs off the media element instead.
    const target = document.createElement("video");
    Object.defineProperty(target, "error", {
      configurable: true,
      value: { code: 4, message: "Source not supported." }
    });
    const event = new Event("error");
    Object.defineProperty(event, "target", { value: target });

    capturedOnError?.(event);

    expect(mockReportError).toHaveBeenCalledTimes(1);
    expect((mockReportError.mock.calls[0][0] as Error).message).toBe("MuxPlayer error: code 4: Source not supported.");
  });

  it("silences network errors that arrive via event.target.error (native fallback path)", () => {
    // Network skip keys off the HTML5 `code`, which is present on both the Mux
    // detail payload and the native MediaError, so this path is silenced too.
    const target = document.createElement("video");
    Object.defineProperty(target, "error", {
      configurable: true,
      value: { code: 2, message: "Network error." }
    });
    const event = new Event("error");
    Object.defineProperty(event, "target", { value: target });

    capturedOnError?.(event);

    expect(mockReportError).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  });

  it("silences decode errors that arrive via event.target.error (native fallback path)", () => {
    // Decode skip keys off the HTML5 `code`, present on both the Mux detail
    // payload and the native MediaError, so this path is silenced too.
    const target = document.createElement("video");
    Object.defineProperty(target, "error", {
      configurable: true,
      value: { code: 3, message: "Decode failed." }
    });
    const event = new Event("error");
    Object.defineProperty(event, "target", { value: target });

    capturedOnError?.(event);

    expect(mockReportError).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  });
});
