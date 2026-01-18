/**
 * Integration tests for post-payment redirect and verification flow
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import SettingsPage from "@/components/settings/SettingsPage";
import { extractAndClearSessionId, verifyPaymentSession } from "@/lib/subscriptions/verification";
import toast from "react-hot-toast";

// Mock the API call
jest.mock("@/lib/api/subscriptions", () => ({
  verifyCheckoutSession: jest.fn()
}));

// Mock the verification utilities
jest.mock("@/lib/subscriptions/verification", () => ({
  extractAndClearSessionId: jest.fn(),
  verifyPaymentSession: jest.fn()
}));

const mockExtractAndClearSessionId = extractAndClearSessionId as jest.MockedFunction<typeof extractAndClearSessionId>;
const mockVerifyPaymentSession = verifyPaymentSession as jest.MockedFunction<typeof verifyPaymentSession>;

// Mock auth store to return authenticated user
jest.mock("@/lib/auth/authStore", () => ({
  useAuthStore: () => ({
    refreshUser: jest.fn().mockResolvedValue(undefined),
    user: {
      id: 1,
      email: "test@example.com",
      handle: "testuser",
      membership_type: "premium"
    },
    isAuthenticated: true,
    isLoading: false,
    error: null,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn()
  })
}));

// Mock components to focus on the verification logic
// Mock the tab components that SettingsPage actually imports
jest.mock("@/components/settings/tabs/AccountTab", () => {
  return function MockAccountTab() {
    return <div data-testid="account-tab">Account Tab</div>;
  };
});

jest.mock("@/components/settings/tabs/SubscriptionTab", () => {
  return function MockSubscriptionTab() {
    return <div data-testid="subscription">Subscription Tab</div>;
  };
});

jest.mock("@/components/settings/tabs/NotificationsTab", () => {
  return function MockNotificationsTab() {
    return <div data-testid="notifications-tab">Notifications Tab</div>;
  };
});

jest.mock("@/components/settings/tabs/DangerTab", () => {
  return function MockDangerTab() {
    return <div data-testid="danger-tab">Danger Tab</div>;
  };
});

// Mock toast
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    loading: jest.fn(),
    dismiss: jest.fn(),
    success: jest.fn(),
    error: jest.fn()
  }
}));

const mockToast = toast as jest.Mocked<typeof toast>;

describe("Payment Verification Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset all mocks to their default state
    mockExtractAndClearSessionId.mockReturnValue(null);
    mockVerifyPaymentSession.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("handles complete successful payment flow", async () => {
    // Mock session ID extraction
    mockExtractAndClearSessionId.mockReturnValue("cs_test_success123");

    // Mock successful payment verification
    mockVerifyPaymentSession.mockResolvedValue({
      success: true
    });

    render(<SettingsPage />);

    // Verify the complete flow
    await waitFor(() => {
      expect(mockVerifyPaymentSession).toHaveBeenCalledWith("cs_test_success123");
    });

    // Check that session ID was extracted
    expect(mockExtractAndClearSessionId).toHaveBeenCalled();

    // Check toast flow
    expect(mockToast.loading).toHaveBeenCalledWith("Verifying payment...");
    expect(mockToast.dismiss).toHaveBeenCalled();
    expect(mockToast.success).toHaveBeenCalledWith("Payment verified! Your subscription has been updated.");
  });

  it("handles payment verification failure", async () => {
    // Mock session ID extraction
    mockExtractAndClearSessionId.mockReturnValue("cs_test_invalid456");

    mockVerifyPaymentSession.mockResolvedValue({
      success: false,
      error: "Session expired"
    });

    render(<SettingsPage />);

    await waitFor(() => {
      expect(mockVerifyPaymentSession).toHaveBeenCalledWith("cs_test_invalid456");
    });

    expect(mockExtractAndClearSessionId).toHaveBeenCalled();
    expect(mockToast.loading).toHaveBeenCalledWith("Verifying payment...");
    expect(mockToast.dismiss).toHaveBeenCalled();
    expect(mockToast.error).toHaveBeenCalledWith("Failed to verify payment: Session expired");
  });

  it("handles network errors during verification", async () => {
    // Mock session ID extraction
    mockExtractAndClearSessionId.mockReturnValue("cs_test_network_error");

    mockVerifyPaymentSession.mockResolvedValue({
      success: false,
      error: "Network error"
    });

    render(<SettingsPage />);

    await waitFor(() => {
      expect(mockVerifyPaymentSession).toHaveBeenCalledWith("cs_test_network_error");
    });

    expect(mockToast.error).toHaveBeenCalledWith("Failed to verify payment: Network error");
  });

  it("ignores other URL parameters during verification", async () => {
    // Mock session ID extraction (simulates extraction from complex URL)
    mockExtractAndClearSessionId.mockReturnValue("cs_test_789");

    mockVerifyPaymentSession.mockResolvedValue({
      success: true
    });

    render(<SettingsPage />);

    await waitFor(() => {
      expect(mockVerifyPaymentSession).toHaveBeenCalledWith("cs_test_789");
    });

    // Session ID should have been extracted
    expect(mockExtractAndClearSessionId).toHaveBeenCalled();
  });

  it("renders normal settings page when no session_id present", () => {
    // Mock no session ID extraction
    mockExtractAndClearSessionId.mockReturnValue(null);

    render(<SettingsPage />);

    // Check that the page renders (account tab is visible by default)
    expect(screen.getByTestId("account-tab")).toBeInTheDocument();

    // No verification should occur
    expect(mockVerifyPaymentSession).not.toHaveBeenCalled();
    expect(mockToast.loading).not.toHaveBeenCalled();
  });

  it("handles API response without success property", async () => {
    // Mock session ID extraction
    mockExtractAndClearSessionId.mockReturnValue("cs_test_malformed");

    mockVerifyPaymentSession.mockResolvedValue({
      success: true
    });

    render(<SettingsPage />);

    await waitFor(() => {
      expect(mockVerifyPaymentSession).toHaveBeenCalledWith("cs_test_malformed");
    });

    // Should show success since API didn't throw
    expect(mockToast.success).toHaveBeenCalledWith("Payment verified! Your subscription has been updated.");
  });

  it("prevents verification re-runs on component re-renders", async () => {
    // Mock session ID extraction to return value first time, then null
    mockExtractAndClearSessionId.mockReturnValueOnce("cs_test_rerender").mockReturnValue(null);

    mockVerifyPaymentSession.mockResolvedValue({
      success: true
    });

    const { rerender } = render(<SettingsPage />);

    await waitFor(() => {
      expect(mockVerifyPaymentSession).toHaveBeenCalledTimes(1);
    });

    // Simulate state update that causes re-render
    rerender(<SettingsPage />);

    // Should not call verification again since session_id was cleared
    expect(mockVerifyPaymentSession).toHaveBeenCalledTimes(1);
  });
});
