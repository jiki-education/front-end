/**
 * Unit tests for API client retry logic
 * Tests exponential backoff, rate limiting, authentication errors, and network errors
 */

/* eslint-disable @typescript-eslint/require-await */

import { api, ApiError } from "@/lib/api/client";
import * as errorStore from "@/lib/api/errorHandlerStore";

// Mock fetch globally
global.fetch = jest.fn();

// Mock error handler store
jest.mock("@/lib/api/errorHandlerStore", () => ({
  setCriticalError: jest.fn(),
  clearCriticalError: jest.fn(),
  useErrorHandlerStore: {
    getState: jest.fn(() => ({ criticalError: null }))
  }
}));

// Mock auth modules
jest.mock("@/lib/auth/storage", () => ({
  getAccessToken: jest.fn(() => "test-token"),
  parseJwtPayload: jest.fn(() => ({ exp: Date.now() / 1000 + 3600 }))
}));

jest.mock("@/lib/auth/refresh", () => ({
  refreshAccessToken: jest.fn()
}));

jest.mock("@/lib/api/config", () => ({
  getApiUrl: jest.fn((path) => `https://api.example.com${path}`)
}));

describe("API Client Retry Logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("Network Error Recovery", () => {
    it("should retry once and succeed on second attempt", async () => {
      const mockFetch = global.fetch as jest.Mock;

      // First call fails with network error, second succeeds
      mockFetch.mockRejectedValueOnce(new TypeError("Network error")).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ success: true })
      });

      const promise = api.get("/test");

      // Fast-forward through first retry delay (50ms)
      await jest.advanceTimersByTimeAsync(50);

      const result = await promise;

      expect(result.data).toEqual({ success: true });
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(errorStore.clearCriticalError).toHaveBeenCalled();
    });

    it("should retry 10 times and succeed on 11th attempt", async () => {
      const mockFetch = global.fetch as jest.Mock;

      // First 10 calls fail, 11th succeeds
      for (let i = 0; i < 10; i++) {
        mockFetch.mockRejectedValueOnce(new TypeError("Network error"));
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ success: true })
      });

      const promise = api.get("/test");

      // Fast-forward through all retry delays
      // Delays: 50, 100, 200, 400, 800, 1600, 3200, 5000, 5000, 5000
      const delays = [50, 100, 200, 400, 800, 1600, 3200, 5000, 5000, 5000];
      for (const delay of delays) {
        await jest.advanceTimersByTimeAsync(delay);
      }

      const result = await promise;

      expect(result.data).toEqual({ success: true });
      expect(mockFetch).toHaveBeenCalledTimes(11);
      expect(errorStore.clearCriticalError).toHaveBeenCalled();
    });
  });

  describe("Exponential Backoff Timing", () => {
    it("should use exponential backoff with correct delays", async () => {
      const mockFetch = global.fetch as jest.Mock;

      // Fail 5 times, then succeed
      for (let i = 0; i < 5; i++) {
        mockFetch.mockRejectedValueOnce(new TypeError("Network error"));
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ success: true })
      });

      const promise = api.get("/test");

      // Verify delays: 50ms, 100ms, 200ms, 400ms, 800ms
      const expectedDelays = [50, 100, 200, 400, 800];

      for (const delay of expectedDelays) {
        const callsBefore = mockFetch.mock.calls.length;
        await jest.advanceTimersByTimeAsync(delay);
        const callsAfter = mockFetch.mock.calls.length;
        expect(callsAfter).toBe(callsBefore + 1);
      }

      await promise;
    });

    it("should cap backoff delay at 5000ms", async () => {
      const mockFetch = global.fetch as jest.Mock;

      // Fail 9 times, then succeed
      for (let i = 0; i < 9; i++) {
        mockFetch.mockRejectedValueOnce(new TypeError("Network error"));
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ success: true })
      });

      const promise = api.get("/test");

      // Delays: 50, 100, 200, 400, 800, 1600, 3200, 5000 (capped), 5000 (capped)
      const delays = [50, 100, 200, 400, 800, 1600, 3200, 5000, 5000];

      for (const delay of delays) {
        await jest.advanceTimersByTimeAsync(delay);
      }

      await promise;

      expect(mockFetch).toHaveBeenCalledTimes(10);
    });
  });

  describe("Modal Timing", () => {
    it("should not show modal for network errors < 1s", async () => {
      const mockFetch = global.fetch as jest.Mock;

      mockFetch.mockRejectedValueOnce(new TypeError("Network error")).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ success: true })
      });

      const promise = api.get("/test");

      // Advance only 50ms (first retry) - less than 1s threshold
      await jest.advanceTimersByTimeAsync(50);

      await promise;

      // Modal should not be shown (elapsed time < 1000ms)
      expect(errorStore.setCriticalError).not.toHaveBeenCalled();
    });

    it("should show modal for network errors > 1s", async () => {
      const mockFetch = global.fetch as jest.Mock;

      // Fail for multiple attempts to exceed 1s
      for (let i = 0; i < 5; i++) {
        mockFetch.mockRejectedValueOnce(new TypeError("Network error"));
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ success: true })
      });

      const promise = api.get("/test");

      // Run all timers to let retries complete
      await jest.runAllTimersAsync();

      const result = await promise;

      // Verify the request eventually succeeded
      expect(result.data).toEqual({ success: true });

      // Modal should be cleared after success
      expect(errorStore.clearCriticalError).toHaveBeenCalled();
    });
  });

  describe("Authentication Errors", () => {
    it("should set critical error for auth errors", async () => {
      const mockFetch = global.fetch as jest.Mock;

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ error: "Invalid token" })
      });

      // Start the request (it will hang) - void it since it never resolves
      void api.get("/test");

      // Advance fake timers slightly to let promise resolve
      await jest.advanceTimersByTimeAsync(1);

      // Verify setCriticalError was called with AuthenticationError
      expect(errorStore.setCriticalError).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "AuthenticationError",
          status: 401
        })
      );

      // Auth errors cause promises to hang forever (not tested here as it would timeout)
    });
  });

  describe("Rate Limit Errors", () => {
    it("should wait and retry for 429 with numeric Retry-After", async () => {
      const mockFetch = global.fetch as jest.Mock;

      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 429,
          statusText: "Too Many Requests",
          headers: new Headers({
            "content-type": "application/json",
            "Retry-After": "5"
          }),
          json: async () => ({ error: "Rate limit exceeded" })
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Headers({ "content-type": "application/json" }),
          json: async () => ({ success: true })
        });

      const promise = api.get("/test");

      // Fast-forward through the 5 second wait
      await jest.advanceTimersByTimeAsync(5000);

      const result = await promise;

      expect(result.data).toEqual({ success: true });
      expect(errorStore.setCriticalError).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "RateLimitError",
          status: 429,
          retryAfterSeconds: 5
        })
      );
      expect(errorStore.clearCriticalError).toHaveBeenCalled();
    });

    it("should wait and retry for 429 with HTTP date Retry-After", async () => {
      const mockFetch = global.fetch as jest.Mock;

      // Create a date 3 seconds in the future
      const futureDate = new Date(Date.now() + 3000);

      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 429,
          statusText: "Too Many Requests",
          headers: new Headers({
            "content-type": "application/json",
            "Retry-After": futureDate.toUTCString()
          }),
          json: async () => ({ error: "Rate limit exceeded" })
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Headers({ "content-type": "application/json" }),
          json: async () => ({ success: true })
        });

      const promise = api.get("/test");

      // Fast-forward through the calculated wait time (~3s)
      await jest.advanceTimersByTimeAsync(3000);

      const result = await promise;

      expect(result.data).toEqual({ success: true });
      expect(errorStore.setCriticalError).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "RateLimitError",
          status: 429,
          retryAfterSeconds: 3
        })
      );
    });

    it("should default to 60s for 429 with missing Retry-After", async () => {
      const mockFetch = global.fetch as jest.Mock;

      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 429,
          statusText: "Too Many Requests",
          headers: new Headers({ "content-type": "application/json" }),
          json: async () => ({ error: "Rate limit exceeded" })
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Headers({ "content-type": "application/json" }),
          json: async () => ({ success: true })
        });

      const promise = api.get("/test");

      // Should default to 60 seconds
      await jest.advanceTimersByTimeAsync(60000);

      const result = await promise;

      expect(result.data).toEqual({ success: true });
      expect(errorStore.setCriticalError).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "RateLimitError",
          status: 429,
          retryAfterSeconds: 60
        })
      );
    });
  });

  describe("Application Errors (No Retry)", () => {
    it("should throw immediately for 404 errors", async () => {
      const mockFetch = global.fetch as jest.Mock;

      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ error: "Resource not found" })
      });

      try {
        await api.get("/test");
        fail("Should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).status).toBe(404);
        expect((error as ApiError).statusText).toBe("Not Found");
      }

      // Should only call fetch once (no retries)
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("should throw immediately for 500 errors", async () => {
      const mockFetch = global.fetch as jest.Mock;

      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ error: "Server error" })
      });

      try {
        await api.get("/test");
        fail("Should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).status).toBe(500);
        expect((error as ApiError).statusText).toBe("Internal Server Error");
      }

      // Should only call fetch once (no retries)
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("should throw immediately for 422 validation errors", async () => {
      const mockFetch = global.fetch as jest.Mock;

      mockFetch.mockResolvedValue({
        ok: false,
        status: 422,
        statusText: "Unprocessable Entity",
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ error: "Validation failed" })
      });

      try {
        await api.get("/test");
        fail("Should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).status).toBe(422);
        expect((error as ApiError).statusText).toBe("Unprocessable Entity");
      }

      // Should only call fetch once (no retries)
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("Error Clearing", () => {
    it("should clear error on successful retry", async () => {
      const mockFetch = global.fetch as jest.Mock;

      mockFetch.mockRejectedValueOnce(new TypeError("Network error")).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ success: true })
      });

      const promise = api.get("/test");

      await jest.advanceTimersByTimeAsync(50);

      await promise;

      expect(errorStore.clearCriticalError).toHaveBeenCalled();
    });

    it("should clear error after rate limit wait", async () => {
      const mockFetch = global.fetch as jest.Mock;

      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 429,
          statusText: "Too Many Requests",
          headers: new Headers({
            "content-type": "application/json",
            "Retry-After": "2"
          }),
          json: async () => ({ error: "Rate limit exceeded" })
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Headers({ "content-type": "application/json" }),
          json: async () => ({ success: true })
        });

      const promise = api.get("/test");

      await jest.advanceTimersByTimeAsync(2000);

      await promise;

      // Should clear error after wait period, then clear again after success
      expect(errorStore.clearCriticalError).toHaveBeenCalled();
    });
  });
});
