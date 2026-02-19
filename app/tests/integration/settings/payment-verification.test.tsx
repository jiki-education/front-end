/**
 * Integration tests for post-payment redirect and verification flow
 * Tests the global CheckoutReturnHandler component
 */

import React from "react";
import { render, waitFor } from "@testing-library/react";
import { CheckoutReturnHandler } from "@/components/checkout/CheckoutReturnHandler";
import { extractAndClearCheckoutSessionId } from "@/lib/subscriptions/verification";
import { verifyCheckoutSession } from "@/lib/api/subscriptions";
import { showWelcomeToPremium, showPaymentProcessing } from "@/lib/modal";

// Mock the API call
jest.mock("@/lib/api/subscriptions", () => ({
  verifyCheckoutSession: jest.fn()
}));

// Mock the verification utilities
jest.mock("@/lib/subscriptions/verification", () => ({
  extractAndClearCheckoutSessionId: jest.fn()
}));

// Mock the modal system
jest.mock("@/lib/modal", () => ({
  showWelcomeToPremium: jest.fn(),
  showPaymentProcessing: jest.fn()
}));

const mockExtractAndClearCheckoutSessionId = extractAndClearCheckoutSessionId as jest.MockedFunction<
  typeof extractAndClearCheckoutSessionId
>;
const mockVerifyCheckoutSession = verifyCheckoutSession as jest.MockedFunction<typeof verifyCheckoutSession>;
const mockShowWelcomeToPremium = showWelcomeToPremium as jest.MockedFunction<typeof showWelcomeToPremium>;
const mockShowPaymentProcessing = showPaymentProcessing as jest.MockedFunction<typeof showPaymentProcessing>;

// Mock auth store
const mockRefreshUser = jest.fn().mockResolvedValue(undefined);
jest.mock("@/lib/auth/authStore", () => ({
  useAuthStore: () => ({
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

  it("shows success modal for paid status", async () => {
    mockExtractAndClearCheckoutSessionId.mockReturnValue("cs_test_success123");
    mockVerifyCheckoutSession.mockResolvedValue({
      success: true,
      interval: "monthly",
      payment_status: "paid",
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
      subscription_status: "incomplete"
    });

    render(<CheckoutReturnHandler />);

    await waitFor(() => {
      expect(mockVerifyCheckoutSession).toHaveBeenCalledWith("cs_test_processing");
    });

    expect(mockShowPaymentProcessing).toHaveBeenCalledWith();
    expect(mockRefreshUser).toHaveBeenCalled();
  });

  it("does nothing when no checkout_return param present", () => {
    mockExtractAndClearCheckoutSessionId.mockReturnValue(null);

    render(<CheckoutReturnHandler />);

    expect(mockVerifyCheckoutSession).not.toHaveBeenCalled();
    expect(mockShowWelcomeToPremium).not.toHaveBeenCalled();
    expect(mockShowPaymentProcessing).not.toHaveBeenCalled();
  });

  it("renders nothing (null)", () => {
    mockExtractAndClearCheckoutSessionId.mockReturnValue(null);

    const { container } = render(<CheckoutReturnHandler />);

    expect(container.firstChild).toBeNull();
  });
});
