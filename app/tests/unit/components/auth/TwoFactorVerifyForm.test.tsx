/**
 * Unit tests for TwoFactorVerifyForm component
 * Tests OTP submission, error handling, and auto-submit behavior
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TwoFactorVerifyForm } from "@/components/auth/TwoFactorVerifyForm";
import { ApiError } from "@/lib/api/client";

// Mock auth store
const mockVerify2FA = jest.fn();
jest.mock("@/lib/auth/authStore", () => ({
  useAuthStore: () => ({
    verify2FA: mockVerify2FA,
    isLoading: false
  })
}));

// Mock CSS modules
jest.mock("@/components/auth/AuthForm.module.css", () => ({
  leftSide: "leftSide",
  formContainer: "formContainer"
}));

jest.mock("@/components/auth/TwoFactorVerifyForm.module.css", () => ({
  container: "container",
  header: "header",
  otpSection: "otpSection",
  errorMessage: "errorMessage",
  verifyingText: "verifyingText",
  actions: "actions"
}));

jest.mock("@/components/ui/OTPInput.module.css", () => ({
  container: "container",
  input: "input",
  inputError: "inputError"
}));

describe("TwoFactorVerifyForm", () => {
  const mockOnSuccess = jest.fn();
  const mockOnCancel = jest.fn();
  const mockOnSessionExpired = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderForm = () => {
    return render(
      <TwoFactorVerifyForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} onSessionExpired={mockOnSessionExpired} />
    );
  };

  describe("rendering", () => {
    it("displays verification heading", () => {
      renderForm();

      expect(screen.getByRole("heading", { name: /two-factor authentication/i })).toBeInTheDocument();
    });

    it("displays OTP input instructions", () => {
      renderForm();

      expect(screen.getByText(/enter the 6-digit code from your authenticator app/i)).toBeInTheDocument();
    });

    it("displays verification code label", () => {
      renderForm();

      expect(screen.getByText(/verification code/i)).toBeInTheDocument();
    });

    it("displays cancel button", () => {
      renderForm();

      expect(screen.getByRole("button", { name: /cancel and sign in again/i })).toBeInTheDocument();
    });
  });

  describe("OTP input and auto-submit", () => {
    it("auto-submits when 6 digits are entered", async () => {
      mockVerify2FA.mockResolvedValue(undefined);
      renderForm();

      const inputs = screen.getAllByRole("textbox");
      const firstInput = inputs[0];

      // Simulate pasting a 6-digit code
      fireEvent.change(firstInput, { target: { value: "654321" } });

      await waitFor(() => {
        expect(mockVerify2FA).toHaveBeenCalledWith("654321");
      });
    });

    it("calls onSuccess after successful verification", async () => {
      mockVerify2FA.mockResolvedValue(undefined);
      renderForm();

      const inputs = screen.getAllByRole("textbox");
      const firstInput = inputs[0];

      fireEvent.change(firstInput, { target: { value: "654321" } });

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });

    it("does not submit with fewer than 6 digits", () => {
      renderForm();

      const inputs = screen.getAllByRole("textbox");
      const firstInput = inputs[0];

      fireEvent.change(firstInput, { target: { value: "12345" } });

      expect(mockVerify2FA).not.toHaveBeenCalled();
    });
  });

  describe("error handling", () => {
    it("displays error message on invalid code", async () => {
      const apiError = new ApiError(401, "Invalid code", { error: { message: "Invalid verification code" } });
      mockVerify2FA.mockRejectedValue(apiError);
      renderForm();

      const inputs = screen.getAllByRole("textbox");
      const firstInput = inputs[0];

      fireEvent.change(firstInput, { target: { value: "654321" } });

      await waitFor(() => {
        expect(screen.getByText("Invalid verification code")).toBeInTheDocument();
      });
    });

    it("clears OTP input after error", async () => {
      const apiError = new ApiError(401, "Invalid code", { error: { message: "Invalid code" } });
      mockVerify2FA.mockRejectedValue(apiError);
      renderForm();

      const inputs = screen.getAllByRole("textbox");
      const firstInput = inputs[0];

      fireEvent.change(firstInput, { target: { value: "654321" } });

      await waitFor(() => {
        expect(screen.getByText("Invalid code")).toBeInTheDocument();
      });

      // All inputs should be cleared
      inputs.forEach((input) => {
        expect(input).toHaveValue("");
      });
    });

    it("calls onSessionExpired when session expires", async () => {
      const sessionExpiredError = new ApiError(401, "Session expired", {
        error: { type: "session_expired", message: "Session expired" }
      });
      mockVerify2FA.mockRejectedValue(sessionExpiredError);
      renderForm();

      const inputs = screen.getAllByRole("textbox");
      const firstInput = inputs[0];

      fireEvent.change(firstInput, { target: { value: "654321" } });

      await waitFor(() => {
        expect(mockOnSessionExpired).toHaveBeenCalled();
      });
    });

    it("displays generic error for non-API errors", async () => {
      mockVerify2FA.mockRejectedValue(new Error("Network error"));
      renderForm();

      const inputs = screen.getAllByRole("textbox");
      const firstInput = inputs[0];

      fireEvent.change(firstInput, { target: { value: "654321" } });

      await waitFor(() => {
        expect(screen.getByText("Verification failed. Please try again.")).toBeInTheDocument();
      });
    });
  });

  describe("cancel flow", () => {
    it("calls onCancel when cancel button is clicked", () => {
      renderForm();

      fireEvent.click(screen.getByRole("button", { name: /cancel and sign in again/i }));

      expect(mockOnCancel).toHaveBeenCalled();
    });
  });
});
