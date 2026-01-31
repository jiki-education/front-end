/**
 * Unit tests for authStore Google authentication methods
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

describe("AuthStore - Google Authentication", () => {
  const mockUser: User = {
    handle: "testuser",
    email: "test@example.com",
    name: "Test User",
    membership_type: "standard",
    subscription_status: "never_subscribed",
    subscription: null,
    provider: "email",
    email_confirmed: true
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

  describe("googleLogin", () => {
    it("should successfully authenticate with Google and update store state", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ user: mockUser })
      });

      const { googleLogin } = useAuthStore.getState();
      await googleLogin("test-code");

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.hasCheckedAuth).toBe(true);
    });

    it("should set loading state during authentication", async () => {
      let resolvePromise: (value: { ok: boolean; json: () => Promise<{ user: User }> }) => void;
      const fetchPromise = new Promise<{ ok: boolean; json: () => Promise<{ user: User }> }>((resolve) => {
        resolvePromise = resolve;
      });
      mockFetch.mockReturnValue(fetchPromise);

      const { googleLogin } = useAuthStore.getState();
      const authCall = googleLogin("test-code");

      // Check loading state is set
      const loadingState = useAuthStore.getState();
      expect(loadingState.isLoading).toBe(true);
      expect(loadingState.error).toBeNull();

      // Resolve the promise
      resolvePromise!({ ok: true, json: () => Promise.resolve({ user: mockUser }) });
      await authCall;

      // Check final state
      const finalState = useAuthStore.getState();
      expect(finalState.isLoading).toBe(false);
    });

    it("should handle authentication errors and update store state", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: { message: "Google authentication failed" } })
      });

      const { googleLogin } = useAuthStore.getState();

      await expect(googleLogin("invalid-code")).rejects.toThrow("Google authentication failed");

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it("should handle network errors gracefully", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      const { googleLogin } = useAuthStore.getState();

      await expect(googleLogin("test-code")).rejects.toThrow("Network error");

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it("should call fetch with correct parameters", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ user: mockUser })
      });

      const { googleLogin } = useAuthStore.getState();
      await googleLogin("test-auth-code");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/google"),
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ code: "test-auth-code" })
        })
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
