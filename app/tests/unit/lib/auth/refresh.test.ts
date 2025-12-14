/**
 * Unit tests for refresh token module - Server Action based implementation
 */

import { refreshAccessToken, isCurrentlyRefreshing } from "@/lib/auth/refresh";
import { refreshTokenAction } from "@/lib/auth/actions";

// Mock Server Actions
jest.mock("@/lib/auth/actions");

const mockRefreshTokenAction = refreshTokenAction as jest.MockedFunction<typeof refreshTokenAction>;

describe("refresh.ts - Token Refresh Module (Server Actions)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Successful Refresh Flow", () => {
    it("should successfully refresh token via Server Action", async () => {
      mockRefreshTokenAction.mockResolvedValueOnce({
        success: true,
        user: {
          id: 123,
          handle: "test",
          email: "test@example.com",
          name: "Test User",
          created_at: "2024-01-01",
          membership_type: "standard",
          subscription_status: "never_subscribed",
          subscription: null
        }
      });

      const result = await refreshAccessToken();

      expect(result).toBe(true);
      expect(mockRefreshTokenAction).toHaveBeenCalledTimes(1);
    });

    it("should return true boolean instead of actual token", async () => {
      mockRefreshTokenAction.mockResolvedValueOnce({ success: true });

      const result = await refreshAccessToken();

      // Returns true since actual token is in httpOnly cookie
      expect(result).toBe(true);
      expect(typeof result).toBe("boolean");
    });
  });

  describe("Failed Refresh Scenarios", () => {
    it("should return null when Server Action fails", async () => {
      mockRefreshTokenAction.mockResolvedValueOnce({
        success: false,
        error: "Refresh token expired"
      });

      const result = await refreshAccessToken();

      expect(result).toBe(false);
      expect(mockRefreshTokenAction).toHaveBeenCalledTimes(1);
    });

    it("should return null when Server Action throws error", async () => {
      mockRefreshTokenAction.mockRejectedValueOnce(new Error("Network error"));

      const result = await refreshAccessToken();

      expect(result).toBe(false);
    });

    it("should return null when Server Action returns no user", async () => {
      mockRefreshTokenAction.mockResolvedValueOnce({
        success: false,
        error: "Invalid refresh token"
      });

      const result = await refreshAccessToken();

      expect(result).toBe(false);
    });
  });

  describe("Race Condition Prevention", () => {
    it("should not make multiple refresh calls when called concurrently", async () => {
      mockRefreshTokenAction.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
      );

      // Call refresh multiple times concurrently
      const [result1, result2, result3] = await Promise.all([
        refreshAccessToken(),
        refreshAccessToken(),
        refreshAccessToken()
      ]);

      // All should get the same result
      expect(result1).toBe(true);
      expect(result2).toBe(true);
      expect(result3).toBe(true);

      // But only one Server Action call should have been made
      expect(mockRefreshTokenAction).toHaveBeenCalledTimes(1);
    });

    it("should allow new refresh after previous one completes", async () => {
      mockRefreshTokenAction.mockResolvedValueOnce({ success: true }).mockResolvedValueOnce({ success: true });

      const result1 = await refreshAccessToken();
      expect(result1).toBe(true);

      const result2 = await refreshAccessToken();
      expect(result2).toBe(true);

      expect(mockRefreshTokenAction).toHaveBeenCalledTimes(2);
    });

    it("should reset refresh state after failure", async () => {
      mockRefreshTokenAction
        .mockResolvedValueOnce({ success: false, error: "Failed" })
        .mockResolvedValueOnce({ success: true });

      const result1 = await refreshAccessToken();
      expect(result1).toBe(false);
      expect(isCurrentlyRefreshing()).toBe(false);

      const result2 = await refreshAccessToken();
      expect(result2).toBe(true);
      expect(mockRefreshTokenAction).toHaveBeenCalledTimes(2);
    });

    it("should correctly report refreshing state", async () => {
      mockRefreshTokenAction.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 50))
      );

      expect(isCurrentlyRefreshing()).toBe(false);

      const refreshPromise = refreshAccessToken();
      expect(isCurrentlyRefreshing()).toBe(true);

      await refreshPromise;
      expect(isCurrentlyRefreshing()).toBe(false);
    });
  });

  describe("Error Handling", () => {
    it("should handle Server Action timeout gracefully", async () => {
      mockRefreshTokenAction.mockImplementation(
        () => new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 100))
      );

      const result = await refreshAccessToken();

      expect(result).toBe(false);
      expect(isCurrentlyRefreshing()).toBe(false);
    });

    it("should reset state even when Server Action throws unexpected error", async () => {
      mockRefreshTokenAction.mockRejectedValueOnce(new Error("Unexpected error"));

      await refreshAccessToken();

      expect(isCurrentlyRefreshing()).toBe(false);
    });
  });
});
