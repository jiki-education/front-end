/**
 * Integration tests for post-payment redirect and verification flow
 * Tests the global CheckoutReturnHandler component
 */

import React from "react";
import { render, waitFor } from "@testing-library/react";
import { CheckoutReturnHandler } from "@/components/checkout/CheckoutReturnHandler";
import { CheckoutIncompleteError } from "@/lib/api/client";
import { extractAndClearCheckoutSessionId } from "@/lib/subscriptions/verification";
import { verifyCheckoutSession } from "@/lib/api/subscriptions";
import { handleSubscribe } from "@/lib/subscriptions/handlers";
import {
  showWelcomeToPremium,
  showPaymentProcessing,
  showPaymentConfirming,
  showPaymentVerificationFailed
} from "@/lib/modal/app";

// Mock the API call
jest.mock("@/lib/api/subscriptions", () => ({
  verifyCheckoutSession: jest.fn()
}));

// Mock the subscribe handler (used to reopen checkout on a failed return)
jest.mock("@/lib/subscriptions/handlers", () => ({
  handleSubscribe: jest.fn().mockResolvedValue(undefined)
}));

// Mock the verification utilities
jest.mock("@/lib/subscriptions/verification", () => ({
  extractAndClearCheckoutSessionId: jest.fn()
}));

// Mock the modal system
jest.mock("@/lib/modal/app", () => ({
  showWelcomeToPremium: jest.fn(),
  showPaymentProcessing: jest.fn(),
  showPaymentConfirming: jest.fn(),
  showPaymentVerificationFailed: jest.fn()
}));

const mockExtractAndClearCheckoutSessionId = extractAndClearCheckoutSessionId as jest.MockedFunction<
  typeof extractAndClearCheckoutSessionId
>;
const mockVerifyCheckoutSession = verifyCheckoutSession as jest.MockedFunction<typeof verifyCheckoutSession>;
const mockHandleSubscribe = handleSubscribe as jest.MockedFunction<typeof handleSubscribe>;
const mockShowWelcomeToPremium = showWelcomeToPremium as jest.MockedFunction<typeof showWelcomeToPremium>;
const mockShowPaymentProcessing = showPaymentProcessing as jest.MockedFunction<typeof showPaymentProcessing>;
const mockShowPaymentConfirming = showPaymentConfirming as jest.MockedFunction<typeof showPaymentConfirming>;
const mockShowPaymentVerificationFailed = showPaymentVerificationFailed as jest.MockedFunction<
  typeof showPaymentVerificationFailed
>;

// Mock auth store
const mockRefreshUser = jest.fn().mockResolvedValue(undefined);
jest.mock("@/lib/auth/authStore", () => ({
  useAuthStore: () => ({
    user: { email: "test@example.com" },
    refreshUser: mockRefreshUser,
    hasCheckedAuth: true,
    isAuthenticated: true
  })
}));

describe("Payment Verification Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockExtractAndClearCheckoutSessionId.mockReturnValue(null);
  });

  it("opens the confirming modal synchronously before verify resolves", async () => {
    mockExtractAndClearCheckoutSessionId.mockReturnValue("cs_test_confirming");
    let resolveVerify: (value: Awaited<ReturnType<typeof verifyCheckoutSession>>) => void;
    mockVerifyCheckoutSession.mockReturnValue(
      new Promise((resolve) => {
        resolveVerify = resolve;
      })
    );

    render(<CheckoutReturnHandler />);

    // Confirming modal must be shown before verify resolves so there's no blank gap.
    expect(mockShowPaymentConfirming).toHaveBeenCalled();
    expect(mockShowWelcomeToPremium).not.toHaveBeenCalled();
    expect(mockShowPaymentProcessing).not.toHaveBeenCalled();

    resolveVerify!({
      success: true,
      interval: "monthly",
      payment_status: "paid",
      payment_state: "paid",
      subscription_status: "active"
    });

    await waitFor(() => {
      expect(mockShowWelcomeToPremium).toHaveBeenCalled();
    });
  });

  it("shows success modal for paid status", async () => {
    mockExtractAndClearCheckoutSessionId.mockReturnValue("cs_test_success123");
    mockVerifyCheckoutSession.mockResolvedValue({
      success: true,
      interval: "monthly",
      payment_status: "paid",
      payment_state: "paid",
      subscription_status: "active"
    });

    render(<CheckoutReturnHandler />);

    await waitFor(() => {
      expect(mockVerifyCheckoutSession).toHaveBeenCalledWith("cs_test_success123");
    });

    expect(mockShowWelcomeToPremium).toHaveBeenCalled();
    expect(mockRefreshUser).toHaveBeenCalled();
  });

  it("shows processing modal for unpaid status", async () => {
    mockExtractAndClearCheckoutSessionId.mockReturnValue("cs_test_processing");
    mockVerifyCheckoutSession.mockResolvedValue({
      success: true,
      interval: "monthly",
      payment_status: "unpaid",
      payment_state: "processing",
      subscription_status: "incomplete"
    });

    render(<CheckoutReturnHandler />);

    await waitFor(() => {
      expect(mockVerifyCheckoutSession).toHaveBeenCalledWith("cs_test_processing");
    });

    expect(mockShowPaymentProcessing).toHaveBeenCalledWith();
    expect(mockRefreshUser).toHaveBeenCalled();
  });

  it("shows verification-failed modal when verifyCheckoutSession rejects", async () => {
    mockExtractAndClearCheckoutSessionId.mockReturnValue("cs_test_error");
    mockVerifyCheckoutSession.mockRejectedValue(new Error("network down"));

    render(<CheckoutReturnHandler />);

    await waitFor(() => {
      expect(mockShowPaymentVerificationFailed).toHaveBeenCalled();
    });

    expect(mockShowPaymentProcessing).not.toHaveBeenCalled();
    expect(mockShowWelcomeToPremium).not.toHaveBeenCalled();
    expect(mockRefreshUser).not.toHaveBeenCalled();
  });

  it("reopens checkout (not the failure modal) for a failed payment, carrying the decline + interval", async () => {
    mockExtractAndClearCheckoutSessionId.mockReturnValue("cs_test_failed");
    mockVerifyCheckoutSession.mockResolvedValue({
      success: true,
      interval: "annual",
      payment_status: "unpaid",
      payment_state: "failed",
      subscription_status: "incomplete",
      decline_reason: "Your card has insufficient funds."
    });

    render(<CheckoutReturnHandler />);

    await waitFor(() => {
      expect(mockHandleSubscribe).toHaveBeenCalledWith(
        expect.objectContaining({ interval: "annual", priorError: "Your card has insufficient funds." })
      );
    });
    expect(mockShowPaymentVerificationFailed).not.toHaveBeenCalled();
    expect(mockShowWelcomeToPremium).not.toHaveBeenCalled();
    expect(mockShowPaymentProcessing).not.toHaveBeenCalled();
  });

  it("reopens checkout for a declined session (CheckoutIncompleteError) without reporting", async () => {
    mockExtractAndClearCheckoutSessionId.mockReturnValue("cs_test_incomplete");
    mockVerifyCheckoutSession.mockRejectedValue(
      new CheckoutIncompleteError("Unprocessable Entity", {}, "Your card was declined.", "monthly")
    );

    render(<CheckoutReturnHandler />);

    await waitFor(() => {
      expect(mockHandleSubscribe).toHaveBeenCalledWith(
        expect.objectContaining({ interval: "monthly", priorError: "Your card was declined." })
      );
    });
    expect(mockShowPaymentVerificationFailed).not.toHaveBeenCalled();
  });

  it("does nothing when no checkout_return param present", () => {
    mockExtractAndClearCheckoutSessionId.mockReturnValue(null);

    render(<CheckoutReturnHandler />);

    expect(mockVerifyCheckoutSession).not.toHaveBeenCalled();
    expect(mockShowPaymentConfirming).not.toHaveBeenCalled();
    expect(mockShowWelcomeToPremium).not.toHaveBeenCalled();
    expect(mockShowPaymentProcessing).not.toHaveBeenCalled();
    expect(mockShowPaymentVerificationFailed).not.toHaveBeenCalled();
  });

  it("renders nothing (null)", () => {
    mockExtractAndClearCheckoutSessionId.mockReturnValue(null);

    const { container } = render(<CheckoutReturnHandler />);

    expect(container.firstChild).toBeNull();
  });
});
