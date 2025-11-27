/**
 * Unit tests for authStore Google authentication methods
 */

import { useAuthStore } from "@/stores/authStore";
import * as authService from "@/lib/auth/service";
import type { User } from "@/types/auth";
import toast from "react-hot-toast";

// Mock auth service
jest.mock("@/lib/auth/service");
const mockAuthService = authService as jest.Mocked<typeof authService>;

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

const mockToast = toast as jest.Mocked<typeof toast>;

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
    id: 123,
    handle: "testuser",
    email: "test@example.com",
    name: "Test User",
    created_at: "2023-01-01T00:00:00Z",
    membership_type: "standard",
    subscription_status: "never_subscribed",
    subscription: null
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
      mockAuthService.googleLogin.mockResolvedValue(mockUser);

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
      let resolvePromise: (user: User) => void;
      const authPromise = new Promise<User>((resolve) => {
        resolvePromise = resolve;
      });
      mockAuthService.googleLogin.mockReturnValue(authPromise);

      const { googleLogin } = useAuthStore.getState();
      const authCall = googleLogin("test-code");

      // Check loading state is set
      const loadingState = useAuthStore.getState();
      expect(loadingState.isLoading).toBe(true);
      expect(loadingState.error).toBeNull();

      // Resolve the promise
      resolvePromise!(mockUser);
      await authCall;

      // Check final state
      const finalState = useAuthStore.getState();
      expect(finalState.isLoading).toBe(false);
    });

    it("should handle authentication errors and update store state", async () => {
      const error = new Error("Google authentication failed");
      mockAuthService.googleLogin.mockRejectedValue(error);

      const { googleLogin } = useAuthStore.getState();

      await expect(googleLogin("invalid-code")).rejects.toThrow("Google authentication failed");

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it("should handle non-Error exceptions gracefully", async () => {
      mockAuthService.googleLogin.mockRejectedValue("String error");

      const { googleLogin } = useAuthStore.getState();

      await expect(googleLogin("test-code")).rejects.toBe("String error");

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it("should call authService.googleLogin with correct parameters", async () => {
      mockAuthService.googleLogin.mockResolvedValue(mockUser);

      const { googleLogin } = useAuthStore.getState();
      await googleLogin("test-auth-code");

      expect(mockAuthService.googleLogin).toHaveBeenCalledWith("test-auth-code");
      expect(mockAuthService.googleLogin).toHaveBeenCalledTimes(1);
    });
  });

  describe("googleAuth", () => {
    it("should successfully authenticate and show success toast", async () => {
      mockAuthService.googleLogin.mockResolvedValue(mockUser);

      const { googleAuth } = useAuthStore.getState();
      await googleAuth("test-code");

      // Verify toast notifications
      expect(mockToast.loading).toHaveBeenCalledWith("Authenticating with Google...");
      expect(mockToast.dismiss).toHaveBeenCalled();
      expect(mockToast.success).toHaveBeenCalledWith("Welcome Test User!");

      // Verify store state
      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it("should show success toast with email when name is not available", async () => {
      const userWithoutName = { ...mockUser, name: null };
      mockAuthService.googleLogin.mockResolvedValue(userWithoutName);

      const { googleAuth } = useAuthStore.getState();
      await googleAuth("test-code");

      expect(mockToast.success).toHaveBeenCalledWith("Welcome test@example.com!");
    });

    it("should handle empty code and show error toast", async () => {
      const { googleAuth } = useAuthStore.getState();
      await googleAuth("");

      expect(mockToast.error).toHaveBeenCalledWith("No authorization code received from Google");
      expect(mockAuthService.googleLogin).not.toHaveBeenCalled();
    });

    it("should handle authentication errors and show error toast", async () => {
      const error = new Error("Network error");
      mockAuthService.googleLogin.mockRejectedValue(error);

      const { googleAuth } = useAuthStore.getState();
      await googleAuth("test-code");

      expect(mockToast.dismiss).toHaveBeenCalled();
      expect(mockToast.error).toHaveBeenCalledWith("Network error");
      expect(console.error).toHaveBeenCalledWith("Google OAuth error:", error);
    });

    it("should handle non-Error exceptions gracefully with generic message", async () => {
      mockAuthService.googleLogin.mockRejectedValue("Unknown error");

      const { googleAuth } = useAuthStore.getState();
      await googleAuth("test-code");

      expect(mockToast.error).toHaveBeenCalledWith("Google authentication failed");
    });

    it("should call googleLogin internally and inherit its behavior", async () => {
      mockAuthService.googleLogin.mockResolvedValue(mockUser);

      const { googleAuth } = useAuthStore.getState();
      await googleAuth("test-code");

      // Verify the underlying googleLogin was called
      expect(mockAuthService.googleLogin).toHaveBeenCalledWith("test-code");

      // Verify store state matches googleLogin behavior
      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.hasCheckedAuth).toBe(true);
    });

    it("should show loading toast and dismiss it after completion", async () => {
      mockAuthService.googleLogin.mockResolvedValue(mockUser);

      const { googleAuth } = useAuthStore.getState();
      await googleAuth("test-code");

      expect(mockToast.loading).toHaveBeenCalledWith("Authenticating with Google...");
      expect(mockToast.dismiss).toHaveBeenCalled();
    });
  });

  describe("googleAuth and googleLogin integration", () => {
    it("should ensure googleAuth properly delegates to googleLogin", async () => {
      mockAuthService.googleLogin.mockResolvedValue(mockUser);

      // Test googleLogin directly
      const { googleLogin } = useAuthStore.getState();
      await googleLogin("test-code");
      const directState = useAuthStore.getState();

      // Reset store
      useAuthStore.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        hasCheckedAuth: false
      });

      // Test googleAuth
      const { googleAuth } = useAuthStore.getState();
      await googleAuth("test-code");
      const delegatedState = useAuthStore.getState();

      // States should match (excluding toast calls)
      expect(delegatedState.user).toEqual(directState.user);
      expect(delegatedState.isAuthenticated).toEqual(directState.isAuthenticated);
      expect(delegatedState.hasCheckedAuth).toEqual(directState.hasCheckedAuth);
      expect(delegatedState.error).toEqual(directState.error);
    });

    it("should maintain error consistency between googleAuth and googleLogin", async () => {
      const error = new Error("Test error");
      mockAuthService.googleLogin.mockRejectedValue(error);

      // Test googleLogin error handling
      const { googleLogin } = useAuthStore.getState();
      await expect(googleLogin("test-code")).rejects.toThrow("Test error");
      const directErrorState = useAuthStore.getState();

      // Reset store
      useAuthStore.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        hasCheckedAuth: false
      });

      // Test googleAuth error handling
      const { googleAuth } = useAuthStore.getState();
      await googleAuth("test-code");
      const delegatedErrorState = useAuthStore.getState();

      // Error states should match
      expect(delegatedErrorState.error).toEqual(directErrorState.error);
      expect(delegatedErrorState.isAuthenticated).toEqual(directErrorState.isAuthenticated);
      expect(delegatedErrorState.user).toEqual(directErrorState.user);
    });
  });
});
