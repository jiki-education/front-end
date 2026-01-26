/**
 * Unit tests for SignupForm component
 * Tests return_to parameter handling for SSO flows
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SignupForm } from "@/components/auth/SignupForm";

// Mock next/navigation
const mockRouterPush = jest.fn();
const mockSearchParamsGet = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockRouterPush }),
  useSearchParams: () => ({ get: mockSearchParamsGet })
}));

// Mock auth store
const mockSignup = jest.fn();
const mockGoogleAuth = jest.fn();
jest.mock("@/lib/auth/authStore", () => ({
  useAuthStore: () => ({
    signup: mockSignup,
    googleAuth: mockGoogleAuth,
    isLoading: false
  })
}));

// Mock GoogleAuthButton to avoid OAuth setup
jest.mock("@/components/auth/GoogleAuthButton", () => ({
  GoogleAuthButton: ({ children, onSuccess }: { children: React.ReactNode; onSuccess: (code: string) => void }) => (
    <button type="button" onClick={() => onSuccess("mock-google-code")} data-testid="google-auth-button">
      {children}
    </button>
  )
}));

// Mock SVG imports
function MockEmailIcon() {
  return <span data-testid="email-icon" />;
}
MockEmailIcon.displayName = "EmailIcon";
jest.mock("@/icons/email.svg", () => MockEmailIcon);

function MockPasswordIcon() {
  return <span data-testid="password-icon" />;
}
MockPasswordIcon.displayName = "PasswordIcon";
jest.mock("@/icons/password.svg", () => MockPasswordIcon);

// Mock CSS modules
jest.mock("@/components/auth/AuthForm.module.css", () => ({
  leftSide: "leftSide",
  formContainer: "formContainer",
  divider: "divider",
  footerLinks: "footerLinks"
}));

describe("SignupForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    mockSearchParamsGet.mockReturnValue(null);
  });

  describe("return_to handling", () => {
    it("stores valid return_to in sessionStorage on mount", () => {
      const validReturnTo = "https://api.jiki.io/auth/discourse/sso";
      mockSearchParamsGet.mockReturnValue(validReturnTo);

      render(<SignupForm />);

      expect(sessionStorage.getItem("auth_return_to")).toBe(validReturnTo);
    });

    it("does not store invalid return_to in sessionStorage", () => {
      mockSearchParamsGet.mockReturnValue("https://evil.com/");

      render(<SignupForm />);

      expect(sessionStorage.getItem("auth_return_to")).toBeNull();
    });

    it("calls signup with correct credentials on form submit", async () => {
      mockSearchParamsGet.mockReturnValue(null);
      mockSignup.mockResolvedValue({});

      render(<SignupForm />);

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
      fireEvent.click(screen.getByRole("button", { name: /sign up$/i }));

      await waitFor(() => {
        expect(mockSignup).toHaveBeenCalledWith({
          email: "test@example.com",
          password: "password123",
          password_confirmation: "password123"
        });
      });
    });

    it("redirects to /dashboard when return_to is invalid", async () => {
      mockSearchParamsGet.mockReturnValue("https://evil.com/phishing");
      mockSignup.mockResolvedValue({});

      render(<SignupForm />);

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
      fireEvent.click(screen.getByRole("button", { name: /sign up$/i }));

      await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith("/dashboard");
      });
    });

    it("redirects to /dashboard when no return_to is provided", async () => {
      mockSearchParamsGet.mockReturnValue(null);
      mockSignup.mockResolvedValue({});

      render(<SignupForm />);

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
      fireEvent.click(screen.getByRole("button", { name: /sign up$/i }));

      await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith("/dashboard");
      });
    });

    it("does not use router.push for valid external return_to URL", async () => {
      const returnToUrl = "https://api.jiki.io/auth/discourse/sso";
      mockSearchParamsGet.mockReturnValue(returnToUrl);
      mockSignup.mockResolvedValue({});

      render(<SignupForm />);

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
      fireEvent.click(screen.getByRole("button", { name: /sign up$/i }));

      await waitFor(() => {
        expect(mockSignup).toHaveBeenCalled();
      });

      // router.push should NOT be called because the code uses window.location.href for external URLs
      expect(mockRouterPush).not.toHaveBeenCalled();
    });

    it("calls googleAuth for Google signup", async () => {
      mockSearchParamsGet.mockReturnValue(null);
      mockGoogleAuth.mockResolvedValue({});

      render(<SignupForm />);

      fireEvent.click(screen.getByTestId("google-auth-button"));

      await waitFor(() => {
        expect(mockGoogleAuth).toHaveBeenCalledWith("mock-google-code");
      });
    });

    it("preserves return_to in login link", () => {
      const returnToUrl = "https://api.jiki.io/auth/discourse/sso?sso=test&sig=test";
      mockSearchParamsGet.mockReturnValue(returnToUrl);

      render(<SignupForm />);

      const loginLink = screen.getByRole("link", { name: /log in/i });
      expect(loginLink).toHaveAttribute("href", expect.stringContaining("/auth/login?return_to="));
      expect(loginLink).toHaveAttribute("href", expect.stringContaining(encodeURIComponent(returnToUrl)));
    });

    it("does not add return_to to login link when not present", () => {
      mockSearchParamsGet.mockReturnValue(null);

      render(<SignupForm />);

      const loginLink = screen.getByRole("link", { name: /log in/i });
      expect(loginLink).toHaveAttribute("href", "/auth/login");
    });

    it("uses sessionStorage return_to when URL param is cleared", async () => {
      // First render with return_to to store it
      const returnToUrl = "https://api.jiki.io/auth/discourse/sso";
      mockSearchParamsGet.mockReturnValue(returnToUrl);

      const { unmount } = render(<SignupForm />);
      expect(sessionStorage.getItem("auth_return_to")).toBe(returnToUrl);

      unmount();

      // Second render without return_to param
      mockSearchParamsGet.mockReturnValue(null);
      mockSignup.mockResolvedValue({});

      render(<SignupForm />);

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
      fireEvent.click(screen.getByRole("button", { name: /sign up$/i }));

      await waitFor(() => {
        expect(mockSignup).toHaveBeenCalled();
      });

      // Should use sessionStorage and do external redirect, not router.push
      expect(mockRouterPush).not.toHaveBeenCalled();
    });
  });

  describe("form validation", () => {
    it("does not call signup when email is empty", async () => {
      render(<SignupForm />);

      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
      fireEvent.click(screen.getByRole("button", { name: /sign up$/i }));

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockSignup).not.toHaveBeenCalled();
    });

    it("does not call signup when password is too short", async () => {
      render(<SignupForm />);

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "short" } });
      fireEvent.click(screen.getByRole("button", { name: /sign up$/i }));

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockSignup).not.toHaveBeenCalled();
    });
  });

  describe("rendering", () => {
    it("renders signup form with all expected elements", () => {
      render(<SignupForm />);

      expect(screen.getByRole("heading", { name: /sign up/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /sign up$/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /log in/i })).toBeInTheDocument();
    });
  });
});
