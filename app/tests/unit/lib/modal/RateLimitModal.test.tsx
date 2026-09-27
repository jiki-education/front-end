import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RateLimitModal } from "@/lib/modal/modals/RateLimitModal";
import { hasRecentlyAutoReloaded, recordAutoReload } from "@/lib/modal/modals/rateLimitReload";

jest.mock("@/lib/modal/modals/rateLimitReload", () => ({
  ...jest.requireActual("@/lib/modal/modals/rateLimitReload"),
  hasRecentlyAutoReloaded: jest.fn(),
  recordAutoReload: jest.fn()
}));

const mockHasRecentlyAutoReloaded = jest.mocked(hasRecentlyAutoReloaded);
const mockRecordAutoReload = jest.mocked(recordAutoReload);

// The reload itself is not asserted: jsdom cannot navigate, and stubbing
// window.location to observe it costs more than it guards. `recordAutoReload` is
// written immediately before the reload and only on that path, so it stands in
// for "the page refreshed itself".
describe("RateLimitModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function runOutTheClock(seconds: number) {
    act(() => {
      jest.advanceTimersByTime(seconds * 1000);
    });
  }

  it("counts down the wait the server asked for", () => {
    mockHasRecentlyAutoReloaded.mockReturnValue(false);
    render(<RateLimitModal retryAfterSeconds={5} />);

    // The number appears twice: in the ring and in the sentence beside it.
    expect(screen.getAllByText("5")).not.toHaveLength(0);

    runOutTheClock(2);

    expect(screen.getAllByText("3")).not.toHaveLength(0);
  });

  it("refreshes itself once when the countdown ends", () => {
    mockHasRecentlyAutoReloaded.mockReturnValue(false);
    render(<RateLimitModal retryAfterSeconds={5} />);

    runOutTheClock(5);

    expect(mockRecordAutoReload).toHaveBeenCalledTimes(1);
  });

  // The loop this exists to break: the reload is ~100 requests, which re-trips
  // the limit, so a modal that refreshes every time refreshes forever.
  it("does not refresh again when it already has", () => {
    mockHasRecentlyAutoReloaded.mockReturnValue(true);
    render(<RateLimitModal retryAfterSeconds={5} />);

    runOutTheClock(30);

    expect(mockRecordAutoReload).not.toHaveBeenCalled();
  });

  it("hands the visitor the reload once it has used its one attempt", () => {
    mockHasRecentlyAutoReloaded.mockReturnValue(true);
    render(<RateLimitModal retryAfterSeconds={5} />);

    expect(screen.queryByRole("button", { name: "Reload Page" })).not.toBeInTheDocument();

    runOutTheClock(5);

    expect(screen.getByRole("button", { name: "Reload Page" })).toBeInTheDocument();
    expect(screen.getByText(/reload the page yourself/i)).toBeInTheDocument();
  });

  // Reading the marker on every tick would let the one this modal is about to
  // write flip the answer under it.
  it("decides once, on mount, rather than on every tick", () => {
    mockHasRecentlyAutoReloaded.mockReturnValue(false);
    render(<RateLimitModal retryAfterSeconds={5} />);

    runOutTheClock(5);

    expect(mockHasRecentlyAutoReloaded).toHaveBeenCalledTimes(1);
  });
});
