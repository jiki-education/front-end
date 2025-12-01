/**
 * Integration tests for post-payment redirect and verification flow
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import SettingsPage from "@/components/settings/SettingsPage";
import { verifyCheckoutSession } from "@/lib/api/subscriptions";
import { extractAndClearSessionId } from "@/lib/subscriptions/verification";
import toast from "react-hot-toast";

// Mock the API call
jest.mock("@/lib/api/subscriptions", () => ({
  verifyCheckoutSession: jest.fn()
}));

const mockVerifyCheckoutSession = verifyCheckoutSession as jest.MockedFunction<typeof verifyCheckoutSession>;

// Mock the verification utilities
jest.mock("@/lib/subscriptions/verification", () => {
  const actual = jest.requireActual("@/lib/subscriptions/verification");
  return {
    ...actual,
    extractAndClearSessionId: jest.fn()
  };
});

const mockExtractAndClearSessionId = extractAndClearSessionId as jest.MockedFunction<typeof extractAndClearSessionId>;

// Mock auth hooks to return authenticated user
jest.mock("@/lib/auth/hooks", () => ({
  useRequireAuth: () => ({
    isAuthenticated: true,
    isLoading: false,
    user: {
      id: 1,
      email: "test@example.com",
      handle: "testuser",
      membership_type: "premium"
    }
  })
}));

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
jest.mock("@/components/layout/sidebar/Sidebar", () => {
  return function MockSidebar() {
    return <div data-testid="sidebar">Sidebar</div>;
  };
});

jest.mock("@/components/settings/subscription/SubscriptionSection", () => {
  return function MockSubscriptionSection() {
    return <div data-testid="subscription">Subscription</div>;
  };
});

jest.mock("@/components/settings/subscription/SubscriptionErrorBoundary", () => {
  return function MockErrorBoundary({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("handles complete successful payment flow", async () => {
    // Mock session ID extraction
    mockExtractAndClearSessionId.mockReturnValue("cs_test_success123");

    // Mock successful API response
    mockVerifyCheckoutSession.mockResolvedValue({
      success: true,
      status: "complete"
    });

    render(<SettingsPage />);

    // Verify the complete flow
    await waitFor(() => {
      expect(mockVerifyCheckoutSession).toHaveBeenCalledWith("cs_test_success123");
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

    mockVerifyCheckoutSession.mockRejectedValue(new Error("Session expired"));

    render(<SettingsPage />);

    await waitFor(() => {
      expect(mockVerifyCheckoutSession).toHaveBeenCalledWith("cs_test_invalid456");
    });

    expect(mockExtractAndClearSessionId).toHaveBeenCalled();
    expect(mockToast.loading).toHaveBeenCalledWith("Verifying payment...");
    expect(mockToast.dismiss).toHaveBeenCalled();
    expect(mockToast.error).toHaveBeenCalledWith("Failed to verify payment: Session expired");
  });

  it("handles network errors during verification", async () => {
    // Mock session ID extraction
    mockExtractAndClearSessionId.mockReturnValue("cs_test_network_error");

    mockVerifyCheckoutSession.mockRejectedValue(new Error("Network error"));

    render(<SettingsPage />);

    await waitFor(() => {
      expect(mockVerifyCheckoutSession).toHaveBeenCalledWith("cs_test_network_error");
    });

    expect(mockToast.error).toHaveBeenCalledWith("Failed to verify payment: Network error");
  });

  it("ignores other URL parameters during verification", async () => {
    // Mock session ID extraction (simulates extraction from complex URL)
    mockExtractAndClearSessionId.mockReturnValue("cs_test_789");

    mockVerifyCheckoutSession.mockResolvedValue({
      success: true,
      status: "complete"
    });

    render(<SettingsPage />);

    await waitFor(() => {
      expect(mockVerifyCheckoutSession).toHaveBeenCalledWith("cs_test_789");
    });

    // Session ID should have been extracted
    expect(mockExtractAndClearSessionId).toHaveBeenCalled();
  });

  it("renders normal settings page when no session_id present", () => {
    // Mock no session ID extraction
    mockExtractAndClearSessionId.mockReturnValue(null);

    render(<SettingsPage />);

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("subscription")).toBeInTheDocument();

    // No verification should occur
    expect(mockVerifyCheckoutSession).not.toHaveBeenCalled();
    expect(mockToast.loading).not.toHaveBeenCalled();
  });

  it("handles API response without success property", async () => {
    // Mock session ID extraction
    mockExtractAndClearSessionId.mockReturnValue("cs_test_malformed");

    mockVerifyCheckoutSession.mockResolvedValue({
      status: "complete"
      // Missing success property
    } as any);

    render(<SettingsPage />);

    await waitFor(() => {
      expect(mockVerifyCheckoutSession).toHaveBeenCalledWith("cs_test_malformed");
    });

    // Should show success since API didn't throw
    expect(mockToast.success).toHaveBeenCalledWith("Payment verified! Your subscription has been updated.");
  });

  it("prevents verification re-runs on component re-renders", async () => {
    // Mock session ID extraction to return value first time, then null
    mockExtractAndClearSessionId.mockReturnValueOnce("cs_test_rerender").mockReturnValue(null);

    mockVerifyCheckoutSession.mockResolvedValue({
      success: true,
      status: "complete"
    });

    const { rerender } = render(<SettingsPage />);

    await waitFor(() => {
      expect(mockVerifyCheckoutSession).toHaveBeenCalledTimes(1);
    });

    // Simulate state update that causes re-render
    rerender(<SettingsPage />);

    // Should not call verification again since session_id was cleared
    expect(mockVerifyCheckoutSession).toHaveBeenCalledTimes(1);
  });
});
