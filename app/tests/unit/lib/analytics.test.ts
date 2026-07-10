import { trackEvent } from "@/lib/analytics";
import { getApiUrl } from "@/lib/api/config";

jest.mock("@/lib/api/config");

const mockGetApiUrl = getApiUrl as jest.MockedFunction<typeof getApiUrl>;
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("trackEvent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetApiUrl.mockReturnValue("http://api.test/internal/events");
    mockFetch.mockResolvedValue({ ok: true });
  });

  it("POSTs to /internal/events with keepalive and credentials", () => {
    trackEvent("premium_modal_shown", { trigger: "locked_challenge" });

    expect(mockGetApiUrl).toHaveBeenCalledWith("/internal/events");
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith("http://api.test/internal/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "premium_modal_shown", properties: { trigger: "locked_challenge" } }),
      credentials: "include",
      keepalive: true
    });
  });

  it("defaults properties to an empty object", () => {
    trackEvent("some_event");

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body).toEqual({ event: "some_event", properties: {} });
  });

  it("swallows rejected fetch promises (analytics must never throw)", async () => {
    mockFetch.mockReturnValueOnce(Promise.reject(new Error("network down")));

    expect(() => trackEvent("x")).not.toThrow();
    // Let the microtask queue drain so the swallowed .catch settles before
    // the test ends and any "unhandled rejection" detector runs.
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  it("swallows synchronous errors thrown by fetch construction", () => {
    mockFetch.mockImplementationOnce(() => {
      throw new Error("URL invalid");
    });

    expect(() => trackEvent("x")).not.toThrow();
  });
});
