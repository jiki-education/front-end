/**
 * Tests for SettingsPage component - focusing on payment verification flow
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { useAuthStore } from "@/stores/authStore";
import { useRequireAuth } from "@/lib/auth/hooks";
import { extractAndClearSessionId, verifyPaymentSession } from "@/lib/subscriptions/verification";
import toast from "react-hot-toast";
import SettingsPage from "@/components/settings/SettingsPage";

// Mock dependencies
jest.mock("@/stores/authStore");
jest.mock("@/lib/auth/hooks");
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
const mockUseRequireAuth = useRequireAuth as jest.MockedFunction<typeof useRequireAuth>;
const mockExtractAndClearSessionId = extractAndClearSessionId as jest.MockedFunction<typeof extractAndClearSessionId>;
const mockVerifyPaymentSession = verifyPaymentSession as jest.MockedFunction<typeof verifyPaymentSession>;
const mockToast = toast as jest.Mocked<typeof toast>;

// Mock Sidebar and SubscriptionSection since we're testing the payment flow
jest.mock("@/components/index-page/sidebar/Sidebar", () => {
  return function MockSidebar() {
    return <div data-testid="sidebar">Sidebar</div>;
  };
});

jest.mock("@/components/settings/subscription/SubscriptionSection", () => {
  return function MockSubscriptionSection() {
    return <div data-testid="subscription-section">Subscription Section</div>;
  };
});

jest.mock("@/components/settings/subscription/SubscriptionErrorBoundary", () => {
  return function MockSubscriptionErrorBoundary({ children }: { children: React.ReactNode }) {
    return <div data-testid="subscription-error-boundary">{children}</div>;
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
    mockUseRequireAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: mockUser,
      isReady: true
    });

    mockUseAuthStore.mockReturnValue({
      refreshUser: mockRefreshUser,
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn()
    });

    // Default: no session_id in URL
    mockExtractAndClearSessionId.mockReturnValue(null);
  });

  it("renders loading state when auth is loading", () => {
    mockUseRequireAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      isReady: false
    });

    render(<SettingsPage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders settings page when authenticated without session_id", () => {
    render(<SettingsPage />);

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("subscription-section")).toBeInTheDocument();
    expect(mockExtractAndClearSessionId).toHaveBeenCalledTimes(1);
    expect(mockVerifyPaymentSession).not.toHaveBeenCalled();
  });

  it("does not process session_id when user is not authenticated", () => {
    mockUseRequireAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      isReady: true
    });
    mockExtractAndClearSessionId.mockReturnValue("cs_test_123");

    render(<SettingsPage />);

    // Should not process verification when not authenticated
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
