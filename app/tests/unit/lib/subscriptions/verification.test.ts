/**
 * Tests for payment verification utilities
 */

import { extractAndClearCheckoutSessionId } from "@/lib/subscriptions/verification";

// Mock URLSearchParams to control URL parsing
let mockURLSearchParams: jest.Mock;

beforeAll(() => {
  mockURLSearchParams = jest.fn();
  global.URLSearchParams = mockURLSearchParams;
});

describe("extractAndClearCheckoutSessionId", () => {
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
      return key in params ? params[key] : null;
    });
    mockURLSearchParams.mockReturnValue({ get: mockGet });
  }

  it("returns null when checkout_return is not true", () => {
    mockSearchParams({ checkout_session_id: "cs_test_123" });

    const result = extractAndClearCheckoutSessionId();

    expect(result).toBeNull();
    expect(mockReplaceState).not.toHaveBeenCalled();
  });

  it("returns null when checkout_session_id is missing", () => {
    mockSearchParams({ checkout_return: "true" });

    const result = extractAndClearCheckoutSessionId();

    expect(result).toBeNull();
    expect(mockReplaceState).not.toHaveBeenCalled();
  });

  it("extracts checkout_session_id when checkout_return is true", () => {
    mockSearchParams({ checkout_return: "true", checkout_session_id: "cs_test_123" });

    const result = extractAndClearCheckoutSessionId();

    expect(result).toBe("cs_test_123");
    expect(mockReplaceState).toHaveBeenCalledWith({}, "", "/");
  });

  it("returns null in server environment (no window)", () => {
    const originalWindow = global.window;
    jest.clearAllMocks();
    mockSearchParams({});

    delete (global as any).window;

    const result = extractAndClearCheckoutSessionId();

    expect(result).toBeNull();

    global.window = originalWindow;
  });

  it("returns null when checkout_return is not exactly 'true'", () => {
    mockSearchParams({ checkout_return: "false", checkout_session_id: "cs_test_123" });

    const result = extractAndClearCheckoutSessionId();

    expect(result).toBeNull();
    expect(mockReplaceState).not.toHaveBeenCalled();
  });
});
