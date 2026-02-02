/**
 * Unit tests for LoginForm component
 * Tests return_to parameter handling for SSO flows
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "@/components/auth/LoginForm";

// Mock next/navigation
const mockRouterPush = jest.fn();
const mockSearchParamsGet = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockRouterPush }),
  useSearchParams: () => ({ get: mockSearchParamsGet })
}));

// Mock auth store
const mockLogin = jest.fn();
const mockGoogleLogin = jest.fn();
jest.mock("@/lib/auth/authStore", () => ({
  useAuthStore: () => ({
    login: mockLogin,
    googleLogin: mockGoogleLogin,
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

// Mock SVG imports - using the full path from components/auth/
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
  forgotPassword: "forgotPassword",
  footerLinks: "footerLinks"
}));

jest.mock("@/components/auth/TwoFactorSetupForm.module.css", () => ({
  container: "container",
  header: "header",
  qrCodeWrapper: "qrCodeWrapper",
  instructions: "instructions",
  otpSection: "otpSection",
  errorMessage: "errorMessage",
  actions: "actions"
}));

jest.mock("@/components/auth/TwoFactorVerifyForm.module.css", () => ({
  container: "container",
  header: "header",
  otpSection: "otpSection",
  errorMessage: "errorMessage",
  actions: "actions"
}));

jest.mock("@/components/ui/OTPInput.module.css", () => ({
  container: "container",
  input: "input",
  inputError: "inputError"
}));

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    mockSearchParamsGet.mockReturnValue(null);
  });

  describe("return_to handling", () => {
    it("stores valid return_to in sessionStorage on mount", () => {
      const validReturnTo = "https://api.jiki.io/auth/discourse/sso";
      mockSearchParamsGet.mockReturnValue(validReturnTo);

      render(<LoginForm />);

      expect(sessionStorage.getItem("auth_return_to")).toBe(validReturnTo);
    });

    it("does not store invalid return_to in sessionStorage", () => {
      mockSearchParamsGet.mockReturnValue("https://evil.com/");

      render(<LoginForm />);

      expect(sessionStorage.getItem("auth_return_to")).toBeNull();
    });

    it("calls login with correct credentials on form submit", async () => {
      mockSearchParamsGet.mockReturnValue(null);
      mockLogin.mockResolvedValue({ status: "success" });

      render(<LoginForm />);

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
      fireEvent.click(screen.getByRole("button", { name: /log in$/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({ email: "test@example.com", password: "password123" });
      });
    });

    it("redirects to /dashboard when return_to is invalid", async () => {
      mockSearchParamsGet.mockReturnValue("https://evil.com/phishing");
      mockLogin.mockResolvedValue({ status: "success" });

      render(<LoginForm />);

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
      fireEvent.click(screen.getByRole("button", { name: /log in$/i }));

      await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith("/dashboard");
      });
    });

    it("redirects to /dashboard when no return_to is provided", async () => {
      mockSearchParamsGet.mockReturnValue(null);
      mockLogin.mockResolvedValue({ status: "success" });

      render(<LoginForm />);

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
      fireEvent.click(screen.getByRole("button", { name: /log in$/i }));

      await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith("/dashboard");
      });
    });

    it("does not use router.push for valid external return_to URL", async () => {
      // When return_to is valid, the code should use window.location.href instead of router.push
      const returnToUrl = "https://api.jiki.io/auth/discourse/sso";
      mockSearchParamsGet.mockReturnValue(returnToUrl);
      mockLogin.mockResolvedValue({ status: "success" });

      render(<LoginForm />);

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
      fireEvent.click(screen.getByRole("button", { name: /log in$/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });

      // router.push should NOT be called because the code uses window.location.href for external URLs
      expect(mockRouterPush).not.toHaveBeenCalled();
    });

    it("calls googleLogin for Google login", async () => {
      mockSearchParamsGet.mockReturnValue(null);
      mockGoogleLogin.mockResolvedValue({ status: "success" });

      render(<LoginForm />);

      fireEvent.click(screen.getByTestId("google-auth-button"));

      await waitFor(() => {
        expect(mockGoogleLogin).toHaveBeenCalledWith("mock-google-code");
      });
    });

    it("preserves return_to in signup link", () => {
      const returnToUrl = "https://api.jiki.io/auth/discourse/sso?sso=test&sig=test";
      mockSearchParamsGet.mockReturnValue(returnToUrl);

      render(<LoginForm />);

      const signupLink = screen.getByRole("link", { name: /sign up for free/i });
      expect(signupLink).toHaveAttribute("href", expect.stringContaining("/auth/signup?return_to="));
      expect(signupLink).toHaveAttribute("href", expect.stringContaining(encodeURIComponent(returnToUrl)));
    });

    it("does not add return_to to signup link when not present", () => {
      mockSearchParamsGet.mockReturnValue(null);

      render(<LoginForm />);

      const signupLink = screen.getByRole("link", { name: /sign up for free/i });
      expect(signupLink).toHaveAttribute("href", "/auth/signup");
    });

    it("uses sessionStorage return_to when URL param is cleared", async () => {
      // First render with return_to to store it
      const returnToUrl = "https://api.jiki.io/auth/discourse/sso";
      mockSearchParamsGet.mockReturnValue(returnToUrl);

      const { unmount } = render(<LoginForm />);
      expect(sessionStorage.getItem("auth_return_to")).toBe(returnToUrl);

      unmount();

      // Second render without return_to param
      mockSearchParamsGet.mockReturnValue(null);
      mockLogin.mockResolvedValue({ status: "success" });

      render(<LoginForm />);

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
      fireEvent.click(screen.getByRole("button", { name: /log in$/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });

      // Should use sessionStorage and do external redirect, not router.push
      expect(mockRouterPush).not.toHaveBeenCalled();
    });
  });

  describe("form validation", () => {
    it("does not call login when email is empty", async () => {
      render(<LoginForm />);

      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
      fireEvent.click(screen.getByRole("button", { name: /log in$/i }));

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockLogin).not.toHaveBeenCalled();
    });

    it("does not call login when password is too short", async () => {
      render(<LoginForm />);

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "short" } });
      fireEvent.click(screen.getByRole("button", { name: /log in$/i }));

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  describe("rendering", () => {
    it("renders login form with all expected elements", () => {
      render(<LoginForm />);

      expect(screen.getByRole("heading", { name: /log in/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /log in$/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /sign up for free/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /forgot your password/i })).toBeInTheDocument();
    });
  });

  describe("2FA flow", () => {
    it("shows 2FA setup form when login returns 2fa_setup_required", async () => {
      mockLogin.mockResolvedValue({
        status: "2fa_setup_required",
        provisioning_uri: "otpauth://totp/Test?secret=ABC123"
      });

      render(<LoginForm />);

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "admin@example.com" } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
      fireEvent.click(screen.getByRole("button", { name: /log in$/i }));

      await waitFor(() => {
        expect(screen.getByText(/scan the qr code/i)).toBeInTheDocument();
      });
    });

    it("shows 2FA verify form when login returns 2fa_required", async () => {
      mockLogin.mockResolvedValue({ status: "2fa_required" });

      render(<LoginForm />);

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "admin@example.com" } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
      fireEvent.click(screen.getByRole("button", { name: /log in$/i }));

      await waitFor(() => {
        expect(screen.getByRole("heading", { name: /two-factor authentication/i })).toBeInTheDocument();
      });
    });

    it("returns to credentials form when cancel is clicked", async () => {
      mockLogin.mockResolvedValue({ status: "2fa_required" });

      render(<LoginForm />);

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "admin@example.com" } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
      fireEvent.click(screen.getByRole("button", { name: /log in$/i }));

      await waitFor(() => {
        expect(screen.getByRole("heading", { name: /two-factor authentication/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole("button", { name: /cancel and sign in again/i }));

      await waitFor(() => {
        expect(screen.getByRole("heading", { name: /log in/i })).toBeInTheDocument();
      });
    });
  });
});
