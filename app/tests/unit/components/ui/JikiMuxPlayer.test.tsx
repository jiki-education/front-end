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

  it("falls back to a bare message when no error detail is present", () => {
    fireMuxError(undefined);

    expect(mockReportError).toHaveBeenCalledTimes(1);
    expect((mockReportError.mock.calls[0][0] as Error).message).toBe("MuxPlayer error");
  });

  it("reads error info from event.target.error on the native-video fallback path", () => {
    // No detail; the error hangs off the media element instead.
    const target = document.createElement("video");
    Object.defineProperty(target, "error", {
      configurable: true,
      value: { code: 3, message: "Decode failed." }
    });
    const event = new Event("error");
    Object.defineProperty(event, "target", { value: target });

    capturedOnError?.(event);

    expect(mockReportError).toHaveBeenCalledTimes(1);
    expect((mockReportError.mock.calls[0][0] as Error).message).toBe("MuxPlayer error: code 3: Decode failed.");
  });
});
