/**
 * Unit tests for authStore Exercism authentication methods
 */

import { useAuthStore } from "@/lib/auth/authStore";
import type { User } from "@/types/auth";

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock console.error
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe("AuthStore - Exercism Authentication", () => {
  const mockUser: User = {
    handle: "testuser",
    email: "test@example.com",
    name: "Test User",
    avatar_url: null,
    membership_type: "standard",
    subscription_status: "never_subscribed",
    subscription: null,
    premium_prices: { currency: "usd", monthly: 999, annual: 9900, country_code: null },
    provider: "exercism",
    email_confirmed: true,
    locale: "en"
  };

  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      hasCheckedAuth: false
    });

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe("exercismLogin", () => {
    it("should successfully authenticate with Exercism and update store state", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ status: "success", user: mockUser })
      });

      const { exercismLogin } = useAuthStore.getState();
      await exercismLogin("test-code", "test-verifier");

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.hasCheckedAuth).toBe(true);
    });

    it("should return 2FA setup response without setting user", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ status: "2fa_setup_required", provisioning_uri: "otpauth://totp/Test" })
      });

      const { exercismLogin } = useAuthStore.getState();
      const result = await exercismLogin("test-code", "test-verifier");

      expect(result).toEqual({ status: "2fa_setup_required", provisioning_uri: "otpauth://totp/Test" });
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isLoading).toBe(false);
    });

    it("should return 2FA required response without setting user", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ status: "2fa_required" })
      });

      const { exercismLogin } = useAuthStore.getState();
      const result = await exercismLogin("test-code", "test-verifier");

      expect(result).toEqual({ status: "2fa_required" });
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isLoading).toBe(false);
    });

    it("should handle authentication errors and update store state", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: { message: "Exercism authentication failed" } })
      });

      const { exercismLogin } = useAuthStore.getState();

      await expect(exercismLogin("invalid-code", "test-verifier")).rejects.toThrow("Exercism authentication failed");

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it("should handle network errors gracefully", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      const { exercismLogin } = useAuthStore.getState();

      await expect(exercismLogin("test-code", "test-verifier")).rejects.toThrow("Network error");

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it("should call fetch with correct parameters", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ status: "success", user: mockUser })
      });

      const { exercismLogin } = useAuthStore.getState();
      await exercismLogin("test-auth-code", "test-code-verifier");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/exercism"),
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ code: "test-auth-code", code_verifier: "test-code-verifier", attribution: null })
        })
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
