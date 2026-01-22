/**
 * Unit tests for authStore login and signup methods
 */

import { useAuthStore } from "@/lib/auth/authStore";
import { AuthenticationError } from "@/lib/api/client";
import type { User } from "@/types/auth";

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock toast
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    loading: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
    dismiss: jest.fn()
  }
}));

describe("AuthStore - Login", () => {
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

  describe("login", () => {
    it("should successfully login and set user state", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ user: mockUser })
      });

      const { login } = useAuthStore.getState();
      await login({ email: "test@example.com", password: "password123" });

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.hasCheckedAuth).toBe(true);
    });

    it("should set loading state during login", async () => {
      let resolvePromise: (value: { ok: boolean; json: () => Promise<{ user: User }> }) => void;
      const fetchPromise = new Promise<{ ok: boolean; json: () => Promise<{ user: User }> }>((resolve) => {
        resolvePromise = resolve;
      });
      mockFetch.mockReturnValue(fetchPromise);

      const { login } = useAuthStore.getState();
      const loginPromise = login({ email: "test@example.com", password: "password123" });

      // Check loading state is set
      expect(useAuthStore.getState().isLoading).toBe(true);

      // Resolve the promise
      resolvePromise!({ ok: true, json: () => Promise.resolve({ user: mockUser }) });
      await loginPromise;

      // Check loading state is cleared
      expect(useAuthStore.getState().isLoading).toBe(false);
    });

    it("should throw AuthenticationError on 401 response", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: { message: "Invalid credentials" } })
      });

      const { login } = useAuthStore.getState();

      await expect(login({ email: "test@example.com", password: "wrong" })).rejects.toThrow(AuthenticationError);

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it("should throw generic Error on other HTTP errors", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: { message: "Server error" } })
      });

      const { login } = useAuthStore.getState();

      await expect(login({ email: "test@example.com", password: "password" })).rejects.toThrow("Server error");

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it("should throw and set logged out state on network error", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      const { login } = useAuthStore.getState();

      await expect(login({ email: "test@example.com", password: "password" })).rejects.toThrow("Network error");

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

      const { login } = useAuthStore.getState();
      await login({ email: "test@example.com", password: "password123" });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/login"),
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ user: { email: "test@example.com", password: "password123" } })
        })
      );
    });

    it("should throw error when response has no user", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ message: "success but no user" })
      });

      const { login } = useAuthStore.getState();

      await expect(login({ email: "test@example.com", password: "password" })).rejects.toThrow(
        "Invalid response from server"
      );
    });
  });

  describe("signup", () => {
    it("should successfully signup and set user state", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ user: mockUser })
      });

      const { signup } = useAuthStore.getState();
      await signup({
        email: "new@example.com",
        password: "password123",
        password_confirmation: "password123",
        name: "New User"
      });

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it("should throw AuthenticationError on 401 response", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: { message: "Email already taken" } })
      });

      const { signup } = useAuthStore.getState();

      await expect(
        signup({
          email: "existing@example.com",
          password: "password123",
          password_confirmation: "password123"
        })
      ).rejects.toThrow(AuthenticationError);
    });

    it("should throw generic Error on other HTTP errors", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 422,
        json: () => Promise.resolve({ error: { message: "Validation failed" } })
      });

      const { signup } = useAuthStore.getState();

      await expect(
        signup({
          email: "new@example.com",
          password: "short",
          password_confirmation: "short"
        })
      ).rejects.toThrow("Validation failed");
    });

    it("should call fetch with correct parameters", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ user: mockUser })
      });

      const { signup } = useAuthStore.getState();
      await signup({
        email: "new@example.com",
        password: "password123",
        password_confirmation: "password123",
        name: "New User"
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/signup"),
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            user: {
              email: "new@example.com",
              password: "password123",
              password_confirmation: "password123",
              name: "New User"
            }
          })
        })
      );
    });
  });
});
