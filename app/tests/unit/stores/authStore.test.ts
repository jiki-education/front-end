/**
 * Unit tests for authStore Google authentication methods
 */

import { useAuthStore } from "@/lib/auth/authStore";
import { googleLoginAction } from "@/lib/auth/actions";
import type { User } from "@/types/auth";
import toast from "react-hot-toast";

// Mock auth actions
jest.mock("@/lib/auth/actions");
const mockGoogleLoginAction = googleLoginAction as jest.MockedFunction<typeof googleLoginAction>;

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
      mockGoogleLoginAction.mockResolvedValue({ success: true, user: mockUser });

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
      let resolvePromise: (result: { success: boolean; user: User }) => void;
      const authPromise = new Promise<{ success: boolean; user: User }>((resolve) => {
        resolvePromise = resolve;
      });
      mockGoogleLoginAction.mockReturnValue(authPromise);

      const { googleLogin } = useAuthStore.getState();
      const authCall = googleLogin("test-code");

      // Check loading state is set
      const loadingState = useAuthStore.getState();
      expect(loadingState.isLoading).toBe(true);
      expect(loadingState.error).toBeNull();

      // Resolve the promise
      resolvePromise!({ success: true, user: mockUser });
      await authCall;

      // Check final state
      const finalState = useAuthStore.getState();
      expect(finalState.isLoading).toBe(false);
    });

    it("should handle authentication errors and update store state", async () => {
      mockGoogleLoginAction.mockResolvedValue({ success: false, error: "Google authentication failed" });

      const { googleLogin } = useAuthStore.getState();

      await expect(googleLogin("invalid-code")).rejects.toThrow("Google authentication failed");

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it("should handle action errors gracefully", async () => {
      mockGoogleLoginAction.mockRejectedValue(new Error("Network error"));

      const { googleLogin } = useAuthStore.getState();

      await expect(googleLogin("test-code")).rejects.toThrow("Network error");

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it("should call googleLoginAction with correct parameters", async () => {
      mockGoogleLoginAction.mockResolvedValue({ success: true, user: mockUser });

      const { googleLogin } = useAuthStore.getState();
      await googleLogin("test-auth-code");

      expect(mockGoogleLoginAction).toHaveBeenCalledWith("test-auth-code");
      expect(mockGoogleLoginAction).toHaveBeenCalledTimes(1);
    });
  });

  describe("googleAuth", () => {
    it("should successfully authenticate and show success toast", async () => {
      mockGoogleLoginAction.mockResolvedValue({ success: true, user: mockUser });

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
      mockGoogleLoginAction.mockResolvedValue({ success: true, user: userWithoutName });

      const { googleAuth } = useAuthStore.getState();
      await googleAuth("test-code");

      expect(mockToast.success).toHaveBeenCalledWith("Welcome test@example.com!");
    });

    it("should handle empty code and show error toast", async () => {
      const { googleAuth } = useAuthStore.getState();
      await googleAuth("");

      expect(mockToast.error).toHaveBeenCalledWith("No authorization code received from Google");
      expect(mockGoogleLoginAction).not.toHaveBeenCalled();
    });

    it("should handle authentication errors and show error toast", async () => {
      const error = new Error("Network error");
      mockGoogleLoginAction.mockRejectedValue(error);

      const { googleAuth } = useAuthStore.getState();
      await googleAuth("test-code");

      expect(mockToast.dismiss).toHaveBeenCalled();
      expect(mockToast.error).toHaveBeenCalledWith("Network error");
    });

    it("should handle action failure with generic message", async () => {
      mockGoogleLoginAction.mockResolvedValue({ success: false, error: "Invalid code" });

      const { googleAuth } = useAuthStore.getState();
      await googleAuth("test-code");

      expect(mockToast.error).toHaveBeenCalledWith("Invalid code");
    });

    it("should call googleLogin internally and inherit its behavior", async () => {
      mockGoogleLoginAction.mockResolvedValue({ success: true, user: mockUser });

      const { googleAuth } = useAuthStore.getState();
      await googleAuth("test-code");

      // Verify the underlying googleLoginAction was called
      expect(mockGoogleLoginAction).toHaveBeenCalledWith("test-code");

      // Verify store state matches googleLogin behavior
      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.hasCheckedAuth).toBe(true);
    });

    it("should show loading toast and dismiss it after completion", async () => {
      mockGoogleLoginAction.mockResolvedValue({ success: true, user: mockUser });

      const { googleAuth } = useAuthStore.getState();
      await googleAuth("test-code");

      expect(mockToast.loading).toHaveBeenCalledWith("Authenticating with Google...");
      expect(mockToast.dismiss).toHaveBeenCalled();
    });
  });

  describe("googleAuth and googleLogin integration", () => {
    it("should ensure googleAuth properly delegates to googleLogin", async () => {
      mockGoogleLoginAction.mockResolvedValue({ success: true, user: mockUser });

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
      mockGoogleLoginAction.mockRejectedValue(error);

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
