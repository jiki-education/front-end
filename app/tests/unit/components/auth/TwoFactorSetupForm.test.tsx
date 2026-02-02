/**
 * Unit tests for TwoFactorSetupForm component
 * Tests OTP submission, error handling, and auto-submit behavior
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TwoFactorSetupForm } from "@/components/auth/TwoFactorSetupForm";
import { ApiError } from "@/lib/api/client";

// Mock auth store
const mockSetup2FA = jest.fn();
jest.mock("@/lib/auth/authStore", () => ({
  useAuthStore: () => ({
    setup2FA: mockSetup2FA,
    isLoading: false
  })
}));

// Mock CSS modules
jest.mock("@/components/auth/AuthForm.module.css", () => ({
  leftSide: "leftSide",
  formContainer: "formContainer"
}));

jest.mock("@/components/auth/TwoFactorSetupForm.module.css", () => ({
  container: "container",
  header: "header",
  qrCodeWrapper: "qrCodeWrapper",
  instructions: "instructions",
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

describe("TwoFactorSetupForm", () => {
  const mockProvisioningUri = "otpauth://totp/Jiki:test@example.com?secret=ABC123&issuer=Jiki";
  const mockOnSuccess = jest.fn();
  const mockOnCancel = jest.fn();
  const mockOnSessionExpired = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderForm = () => {
    return render(
      <TwoFactorSetupForm
        provisioningUri={mockProvisioningUri}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
        onSessionExpired={mockOnSessionExpired}
      />
    );
  };

  describe("rendering", () => {
    it("displays QR code setup instructions", () => {
      renderForm();

      expect(screen.getByText(/scan the qr code/i)).toBeInTheDocument();
      expect(screen.getByText(/google authenticator, 1password, authy/i)).toBeInTheDocument();
    });

    it("renders QR code SVG", () => {
      renderForm();

      const qrCode = screen.getByRole("img");
      expect(qrCode).toBeInTheDocument();
    });

    it("displays OTP input with correct label", () => {
      renderForm();

      expect(screen.getByText(/enter the 6-digit code from your app/i)).toBeInTheDocument();
    });

    it("displays cancel button", () => {
      renderForm();

      expect(screen.getByRole("button", { name: /cancel and sign in again/i })).toBeInTheDocument();
    });
  });

  describe("OTP input and auto-submit", () => {
    it("auto-submits when 6 digits are entered", async () => {
      mockSetup2FA.mockResolvedValue(undefined);
      renderForm();

      const inputs = screen.getAllByRole("textbox");
      const firstInput = inputs[0];

      // Simulate pasting a 6-digit code
      fireEvent.change(firstInput, { target: { value: "123456" } });

      await waitFor(() => {
        expect(mockSetup2FA).toHaveBeenCalledWith("123456");
      });
    });

    it("calls onSuccess after successful verification", async () => {
      mockSetup2FA.mockResolvedValue(undefined);
      renderForm();

      const inputs = screen.getAllByRole("textbox");
      const firstInput = inputs[0];

      fireEvent.change(firstInput, { target: { value: "123456" } });

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });

    it("does not submit with fewer than 6 digits", () => {
      renderForm();

      const inputs = screen.getAllByRole("textbox");
      const firstInput = inputs[0];

      fireEvent.change(firstInput, { target: { value: "12345" } });

      expect(mockSetup2FA).not.toHaveBeenCalled();
    });
  });

  describe("error handling", () => {
    it("displays error message on invalid code", async () => {
      const apiError = new ApiError(401, "Invalid code", { error: { message: "Invalid verification code" } });
      mockSetup2FA.mockRejectedValue(apiError);
      renderForm();

      const inputs = screen.getAllByRole("textbox");
      const firstInput = inputs[0];

      fireEvent.change(firstInput, { target: { value: "123456" } });

      await waitFor(() => {
        expect(screen.getByText("Invalid verification code")).toBeInTheDocument();
      });
    });

    it("clears OTP input after error", async () => {
      const apiError = new ApiError(401, "Invalid code", { error: { message: "Invalid code" } });
      mockSetup2FA.mockRejectedValue(apiError);
      renderForm();

      const inputs = screen.getAllByRole("textbox");
      const firstInput = inputs[0];

      fireEvent.change(firstInput, { target: { value: "123456" } });

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
      mockSetup2FA.mockRejectedValue(sessionExpiredError);
      renderForm();

      const inputs = screen.getAllByRole("textbox");
      const firstInput = inputs[0];

      fireEvent.change(firstInput, { target: { value: "123456" } });

      await waitFor(() => {
        expect(mockOnSessionExpired).toHaveBeenCalled();
      });
    });

    it("displays generic error for non-API errors", async () => {
      mockSetup2FA.mockRejectedValue(new Error("Network error"));
      renderForm();

      const inputs = screen.getAllByRole("textbox");
      const firstInput = inputs[0];

      fireEvent.change(firstInput, { target: { value: "123456" } });

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
