/**
 * Unit tests for ExercismCallbackHandler component
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { ExercismCallbackHandler } from "@/components/auth/ExercismCallbackHandler";
import { consumeExercismCallback } from "@/lib/auth/exercism";

// Mock next/navigation
const mockRouterPush = jest.fn();
const mockSearchParamsGet = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockRouterPush }),
  useSearchParams: () => ({ get: mockSearchParamsGet })
}));

// Mock auth store
const mockExercismLogin = jest.fn();
jest.mock("@/lib/auth/authStore", () => ({
  useAuthStore: () => ({
    exercismLogin: mockExercismLogin
  })
}));

// Mock Exercism OAuth helpers
jest.mock("@/lib/auth/exercism", () => ({
  consumeExercismCallback: jest.fn()
}));
const mockConsumeExercismCallback = consumeExercismCallback as jest.MockedFunction<typeof consumeExercismCallback>;

// Mock CSS modules
jest.mock("@/components/auth/AuthForm.module.css", () => ({
  leftSide: "leftSide",
  formContainer: "formContainer",
  confirmationMessage: "confirmationMessage",
  confirmationIconError: "confirmationIconError",
  confirmationCard: "confirmationCard",
  confirmationCardText: "confirmationCardText",
  confirmationCardFooter: "confirmationCardFooter"
}));

jest.mock("@/components/auth/TwoFactorSetupForm.module.css", () => ({}));
jest.mock("@/components/auth/TwoFactorVerifyForm.module.css", () => ({}));
jest.mock("@/components/ui/OTPInput.module.css", () => ({}));

describe("ExercismCallbackHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();

    mockSearchParamsGet.mockImplementation((key: string) => {
      if (key === "code") {
        return "auth-code-123";
      }
      if (key === "state") {
        return "state-abc";
      }
      return null;
    });

    mockConsumeExercismCallback.mockReturnValue({
      status: "ok",
      code: "auth-code-123",
      codeVerifier: "verifier-xyz"
    });
  });

  describe("successful authentication", () => {
    it("exchanges the callback params for a login and redirects to the dashboard", async () => {
      mockExercismLogin.mockResolvedValue({ status: "success", user: { handle: "testuser" } });

      render(<ExercismCallbackHandler />);

      await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith("/dashboard");
      });

      expect(mockConsumeExercismCallback).toHaveBeenCalledWith("auth-code-123", "state-abc");
      expect(mockExercismLogin).toHaveBeenCalledWith("auth-code-123", "verifier-xyz");
    });

    it("shows a loading state while authenticating", () => {
      mockExercismLogin.mockReturnValue(new Promise(() => {}));

      render(<ExercismCallbackHandler />);

      expect(screen.getByText(/signing you in/i)).toBeInTheDocument();
    });

    it("only performs the login once even when re-rendered (strict mode)", async () => {
      mockExercismLogin.mockResolvedValue({ status: "success", user: { handle: "testuser" } });

      render(
        <React.StrictMode>
          <ExercismCallbackHandler />
        </React.StrictMode>
      );

      await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalled();
      });

      expect(mockExercismLogin).toHaveBeenCalledTimes(1);
    });
  });

  describe("2FA flows", () => {
    it("shows the 2FA verify form when login returns 2fa_required", async () => {
      mockExercismLogin.mockResolvedValue({ status: "2fa_required" });

      render(<ExercismCallbackHandler />);

      await waitFor(() => {
        expect(screen.getByRole("heading", { name: /two-factor authentication/i })).toBeInTheDocument();
      });
    });

    it("shows the 2FA setup form when login returns 2fa_setup_required", async () => {
      mockExercismLogin.mockResolvedValue({
        status: "2fa_setup_required",
        provisioning_uri: "otpauth://totp/Test?secret=ABC123"
      });

      render(<ExercismCallbackHandler />);

      await waitFor(() => {
        expect(screen.getByText(/scan the qr code/i)).toBeInTheDocument();
      });
    });
  });

  describe("error handling", () => {
    it("shows an error when the callback params are invalid", () => {
      mockConsumeExercismCallback.mockReturnValue({
        status: "error",
        message: "Invalid authentication state. Please try again."
      });

      render(<ExercismCallbackHandler />);

      expect(screen.getByText(/sign in failed/i)).toBeInTheDocument();
      expect(screen.getByText(/invalid authentication state/i)).toBeInTheDocument();
      expect(mockExercismLogin).not.toHaveBeenCalled();
    });

    it("shows an error when the login request fails", async () => {
      mockExercismLogin.mockRejectedValue(new Error("Exercism login failed"));

      render(<ExercismCallbackHandler />);

      await waitFor(() => {
        expect(screen.getByText(/sign in failed/i)).toBeInTheDocument();
      });
      expect(screen.getByText(/exercism login failed/i)).toBeInTheDocument();
    });

    it("links back to the login page from the error state", () => {
      mockConsumeExercismCallback.mockReturnValue({
        status: "error",
        message: "Exercism did not return an authorization code"
      });

      render(<ExercismCallbackHandler />);

      const backLink = screen.getByRole("link", { name: /back to log in/i });
      expect(backLink).toHaveAttribute("href", "/auth/login");
    });
  });
});
