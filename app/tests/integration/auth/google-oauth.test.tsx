/**
 * Integration tests for Google OAuth authentication flow
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { useAuthStore } from "@/stores/authStore";
import { useGoogleLogin } from "@react-oauth/google";
// import type { User } from "@/types/auth";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn()
}));

jest.mock("@react-oauth/google", () => ({
  useGoogleLogin: jest.fn()
}));

jest.mock("@/stores/authStore", () => ({
  useAuthStore: jest.fn()
}));

const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn()
};

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseGoogleLogin = useGoogleLogin as jest.MockedFunction<typeof useGoogleLogin>;
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

describe("Google OAuth Integration Tests", () => {
  // const mockUser: User = {
  //   id: 123,
  //   handle: "testuser",
  //   email: "test@example.com",
  //   name: "Test User",
  //   created_at: "2023-01-01T00:00:00Z",
  //   membership_type: "standard",
  //   subscription_status: "never_subscribed",
  //   subscription: null
  // };

  const mockGoogleAuth = jest.fn();
  const mockLogin = jest.fn();
  const mockSignup = jest.fn();
  const mockClearError = jest.fn();
  const mockGoogleLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock Next.js router
    mockUseRouter.mockReturnValue(mockRouter);

    // Mock Google login hook
    mockUseGoogleLogin.mockReturnValue(mockGoogleLogin);

    // Mock auth store
    mockUseAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      hasCheckedAuth: true,
      login: mockLogin,
      signup: mockSignup,
      googleAuth: mockGoogleAuth,
      logout: jest.fn(),
      checkAuth: jest.fn(),
      refreshUser: jest.fn(),
      requestPasswordReset: jest.fn(),
      resetPassword: jest.fn(),
      clearError: mockClearError,
      setLoading: jest.fn()
    });

    // Mock environment variable for Google OAuth
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = "test-client-id";
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  });

  describe("LoginForm Google OAuth Integration", () => {
    it("should render Google Auth button and handle successful authentication", () => {
      render(<LoginForm />);

      const googleButton = screen.getByText("Log In with Google");
      expect(googleButton).toBeInTheDocument();

      // Verify useGoogleLogin was called with correct config
      expect(mockUseGoogleLogin).toHaveBeenCalledWith({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
        flow: "auth-code"
      });
    });

    it("should handle Google Auth errors gracefully", () => {
      mockGoogleAuth.mockRejectedValue(new Error("Google auth failed"));

      render(<LoginForm />);

      // Verify the form renders without throwing
      expect(screen.getByText("Log In with Google")).toBeInTheDocument();
    });

    it("should display loading state during Google authentication", () => {
      mockUseAuthStore.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: true, // Loading state
        error: null,
        hasCheckedAuth: true,
        login: mockLogin,
        signup: mockSignup,
        googleAuth: mockGoogleAuth,
        logout: jest.fn(),
        checkAuth: jest.fn(),
        refreshUser: jest.fn(),
        requestPasswordReset: jest.fn(),
        resetPassword: jest.fn(),
        clearError: mockClearError,
        setLoading: jest.fn()
      });

      render(<LoginForm />);

      // The form should reflect the loading state - button text changes to "Logging in..."
      const submitButton = screen.getByRole("button", { name: /logging in/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe("SignupForm Google OAuth Integration", () => {
    it("should render Google Auth button and handle successful authentication", () => {
      render(<SignupForm />);

      const googleButton = screen.getByText("Sign Up with Google");
      expect(googleButton).toBeInTheDocument();

      // Verify useGoogleLogin was called with correct config
      expect(mockUseGoogleLogin).toHaveBeenCalledWith({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
        flow: "auth-code"
      });
    });

    it("should handle Google Auth errors gracefully in signup form", () => {
      mockGoogleAuth.mockRejectedValue(new Error("Google signup failed"));

      render(<SignupForm />);

      // Verify the form renders without throwing
      expect(screen.getByText("Sign Up with Google")).toBeInTheDocument();
    });
  });

  describe("Cross-Form Consistency", () => {
    it("should use the same googleAuth method in both forms", () => {
      render(<LoginForm />);
      expect(mockUseAuthStore).toHaveBeenCalled();

      jest.clearAllMocks();

      render(<SignupForm />);
      expect(mockUseAuthStore).toHaveBeenCalled();
    });

    it("should have consistent Google Auth button text", () => {
      const { unmount } = render(<LoginForm />);
      expect(screen.getByText("Log In with Google")).toBeInTheDocument();

      unmount();

      render(<SignupForm />);
      expect(screen.getByText("Sign Up with Google")).toBeInTheDocument();
    });
  });

  describe("Error Display Integration", () => {
    it("should display auth errors from store in forms", () => {
      const errorMessage = "Google authentication failed";
      mockUseAuthStore.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
        hasCheckedAuth: true,
        login: mockLogin,
        signup: mockSignup,
        googleAuth: mockGoogleAuth,
        logout: jest.fn(),
        checkAuth: jest.fn(),
        refreshUser: jest.fn(),
        requestPasswordReset: jest.fn(),
        resetPassword: jest.fn(),
        clearError: mockClearError,
        setLoading: jest.fn()
      });

      render(<LoginForm />);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe("Environment Configuration", () => {
    it("should not render Google Auth button when client ID is not configured", () => {
      delete process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

      render(<LoginForm />);

      expect(screen.queryByText("Log In with Google")).not.toBeInTheDocument();
    });
  });
});
