/**
 * Tests for payment verification utilities
 */

import { verifyPaymentSession, extractAndClearSessionId } from "@/lib/subscriptions/verification";
import { verifyCheckoutSession } from "@/lib/api/subscriptions";

// Mock the API module
jest.mock("@/lib/api/subscriptions");

const mockedVerifyCheckoutSession = verifyCheckoutSession as jest.MockedFunction<typeof verifyCheckoutSession>;

describe("verifyPaymentSession", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns success when API call succeeds", async () => {
    mockedVerifyCheckoutSession.mockResolvedValue({ success: true, status: "complete" });

    const result = await verifyPaymentSession("cs_test_123");

    expect(result).toEqual({ success: true });
    expect(mockedVerifyCheckoutSession).toHaveBeenCalledWith("cs_test_123");
  });

  it("returns error when API call fails", async () => {
    mockedVerifyCheckoutSession.mockRejectedValue(new Error("Network error"));

    const result = await verifyPaymentSession("cs_test_123");

    expect(result).toEqual({
      success: false,
      error: "Network error"
    });
  });

  it("returns generic error message for non-Error rejections", async () => {
    mockedVerifyCheckoutSession.mockRejectedValue("Something went wrong");

    const result = await verifyPaymentSession("cs_test_123");

    expect(result).toEqual({
      success: false,
      error: "Failed to verify payment"
    });
  });
});

// Mock URLSearchParams to control URL parsing
let mockURLSearchParams: jest.Mock;

beforeAll(() => {
  mockURLSearchParams = jest.fn();
  global.URLSearchParams = mockURLSearchParams;
});

describe("extractAndClearSessionId", () => {
  let mockReplaceState: jest.Mock;
  let originalLocation: any;

  beforeAll(() => {
    // Store original location and delete it so we can mock it
    originalLocation = window.location;
    delete (window as any).location;
  });

  afterAll(() => {
    // Restore original location
    window.location = originalLocation;
  });

  beforeEach(() => {
    mockReplaceState = jest.fn();

    // Mock window.history.replaceState
    Object.defineProperty(window, "history", {
      value: { replaceState: mockReplaceState },
      writable: true
    });

    // Set a minimal location mock if window exists
    if (typeof global.window !== "undefined") {
      try {
        (window as any).location = { pathname: "/", search: "" };
      } catch {
        // Ignore navigation errors in test
      }
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Helper function to mock URL search params
  function mockSearchParams(params: Record<string, string>) {
    const mockGet = jest.fn((key: string) => {
      // Return the value if the key exists, otherwise null
      // This mimics URLSearchParams behavior where empty string is different from missing key
      return key in params ? params[key] : null;
    });
    mockURLSearchParams.mockReturnValue({ get: mockGet });
  }

  it("returns null when no session_id in URL", () => {
    // Mock empty search params
    mockSearchParams({});

    const result = extractAndClearSessionId();

    expect(result).toBeNull();
    expect(mockReplaceState).not.toHaveBeenCalled();
  });

  it("extracts session_id from URL and clears it", () => {
    // Mock search params with session_id
    mockSearchParams({ session_id: "cs_test_123", other: "value" });

    const result = extractAndClearSessionId();

    expect(result).toBe("cs_test_123");
    expect(mockReplaceState).toHaveBeenCalledWith({}, "", "/");
  });

  it("extracts session_id when it's the only parameter", () => {
    mockSearchParams({ session_id: "cs_live_456" });

    const result = extractAndClearSessionId();

    expect(result).toBe("cs_live_456");
    expect(mockReplaceState).toHaveBeenCalledWith({}, "", "/");
  });

  it("returns null in server environment (no window)", () => {
    const originalWindow = global.window;
    // Clear any mock state to start fresh for this test
    jest.clearAllMocks();
    mockSearchParams({});

    delete (global as any).window;

    const result = extractAndClearSessionId();

    expect(result).toBeNull();

    global.window = originalWindow;
  });

  it("handles malformed URL parameters gracefully", () => {
    mockSearchParams({ session_id: "" });

    const result = extractAndClearSessionId();

    expect(result).toBe("");
    // Empty string is falsy, so replaceState should NOT be called
    expect(mockReplaceState).not.toHaveBeenCalled();
  });
});
