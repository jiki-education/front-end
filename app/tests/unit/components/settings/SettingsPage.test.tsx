/**
 * Tests for SettingsPage component - focusing on payment verification flow
 */

import SettingsPage from "@/components/settings/SettingsPage";
import { useAuthStore } from "@/lib/auth/authStore";
import { extractAndClearSessionId, verifyPaymentSession } from "@/lib/subscriptions/verification";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import toast from "react-hot-toast";

// Mock dependencies
jest.mock("@/lib/auth/authStore");
jest.mock("@/lib/subscriptions/verification");

// Mock react-hot-toast with proper jest.mock
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    loading: jest.fn(),
    dismiss: jest.fn(),
    success: jest.fn(),
    error: jest.fn()
  }
}));

const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;
const mockExtractAndClearSessionId = extractAndClearSessionId as jest.MockedFunction<typeof extractAndClearSessionId>;
const mockVerifyPaymentSession = verifyPaymentSession as jest.MockedFunction<typeof verifyPaymentSession>;
const mockToast = toast as jest.Mocked<typeof toast>;

// Mock the tab components that SettingsPage actually imports
jest.mock("@/components/settings/tabs/AccountTab", () => {
  return function MockAccountTab() {
    return <div data-testid="account-tab">Account Tab</div>;
  };
});

jest.mock("@/components/settings/tabs/SubscriptionTab", () => {
  return function MockSubscriptionTab() {
    return <div data-testid="subscription-tab">Subscription Tab</div>;
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

describe("SettingsPage Payment Verification", () => {
  const mockUser = {
    id: 1,
    email: "test@example.com",
    handle: "testuser",
    name: "Test User",
    created_at: "2024-01-01T00:00:00Z",
    membership_type: "standard" as const,
    subscription_status: "never_subscribed" as const,
    subscription: null
  };

  const mockRefreshUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mocks for authenticated state
    mockUseAuthStore.mockReturnValue({
      refreshUser: mockRefreshUser,
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      hasCheckedAuth: true,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      checkAuth: jest.fn()
    } as any);

    // Default: no session_id in URL
    mockExtractAndClearSessionId.mockReturnValue(null);
  });

  it("renders settings page when authenticated without session_id", () => {
    render(<SettingsPage />);

    // Account tab is the default tab shown
    expect(screen.getByTestId("account-tab")).toBeInTheDocument();
    expect(mockExtractAndClearSessionId).toHaveBeenCalledTimes(1);
    expect(mockVerifyPaymentSession).not.toHaveBeenCalled();
  });

  it("does not process session_id when user is not available", () => {
    // Update mock to have no user
    mockUseAuthStore.mockReturnValue({
      refreshUser: mockRefreshUser,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      hasCheckedAuth: true,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      checkAuth: jest.fn()
    } as any);
    mockExtractAndClearSessionId.mockReturnValue("cs_test_123");

    render(<SettingsPage />);

    // Should not process verification when user is not available
    expect(mockVerifyPaymentSession).not.toHaveBeenCalled();
  });

  it("processes successful payment verification", async () => {
    mockExtractAndClearSessionId.mockReturnValue("cs_test_123");
    mockVerifyPaymentSession.mockResolvedValue({ success: true });

    render(<SettingsPage />);

    // Wait for verification to complete
    await waitFor(() => {
      expect(mockVerifyPaymentSession).toHaveBeenCalledWith("cs_test_123");
    });

    // Check toast interactions
    expect(mockToast.loading).toHaveBeenCalledWith("Verifying payment...");
    expect(mockToast.dismiss).toHaveBeenCalled();
    expect(mockToast.success).toHaveBeenCalledWith("Payment verified! Your subscription has been updated.");
    expect(mockRefreshUser).toHaveBeenCalled();
  });

  it("handles failed payment verification", async () => {
    mockExtractAndClearSessionId.mockReturnValue("cs_test_invalid");
    mockVerifyPaymentSession.mockResolvedValue({
      success: false,
      error: "Session not found"
    });

    render(<SettingsPage />);

    await waitFor(() => {
      expect(mockVerifyPaymentSession).toHaveBeenCalledWith("cs_test_invalid");
    });

    expect(mockToast.loading).toHaveBeenCalledWith("Verifying payment...");
    expect(mockToast.dismiss).toHaveBeenCalled();
    expect(mockToast.error).toHaveBeenCalledWith("Failed to verify payment: Session not found");
    expect(mockRefreshUser).not.toHaveBeenCalled();
  });

  it("handles verification errors gracefully", async () => {
    mockExtractAndClearSessionId.mockReturnValue("cs_test_123");
    // verifyPaymentSession never throws - it returns { success: false, error: message }
    mockVerifyPaymentSession.mockResolvedValue({
      success: false,
      error: "Network error"
    });

    render(<SettingsPage />);

    await waitFor(() => {
      expect(mockVerifyPaymentSession).toHaveBeenCalledWith("cs_test_123");
    });

    expect(mockToast.loading).toHaveBeenCalledWith("Verifying payment...");
    expect(mockToast.dismiss).toHaveBeenCalled();
    expect(mockToast.error).toHaveBeenCalledWith("Failed to verify payment: Network error");
    expect(mockRefreshUser).not.toHaveBeenCalled();
  });

  it("only processes verification once per session_id", async () => {
    mockExtractAndClearSessionId.mockReturnValue("cs_test_123");
    mockVerifyPaymentSession.mockResolvedValue({ success: true });

    const { rerender } = render(<SettingsPage />);

    await waitFor(() => {
      expect(mockVerifyPaymentSession).toHaveBeenCalledTimes(1);
    });

    // Simulate re-render (e.g., from state update)
    mockExtractAndClearSessionId.mockReturnValue(null); // session_id cleared after first call
    rerender(<SettingsPage />);

    // Should not call verification again
    expect(mockVerifyPaymentSession).toHaveBeenCalledTimes(1);
  });

  it("refreshes user data after successful verification", async () => {
    mockExtractAndClearSessionId.mockReturnValue("cs_test_123");
    mockVerifyPaymentSession.mockResolvedValue({ success: true });

    render(<SettingsPage />);

    await waitFor(() => {
      expect(mockRefreshUser).toHaveBeenCalled();
    });

    // Verify the complete flow
    expect(mockExtractAndClearSessionId).toHaveBeenCalled();
    expect(mockVerifyPaymentSession).toHaveBeenCalledWith("cs_test_123");
    expect(mockToast.success).toHaveBeenCalledWith("Payment verified! Your subscription has been updated.");
    expect(mockRefreshUser).toHaveBeenCalled();
  });
});
