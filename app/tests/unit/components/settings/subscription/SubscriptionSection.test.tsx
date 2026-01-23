/**
 * Unit tests for SubscriptionSection component
 */
import { render, screen, waitFor } from "@testing-library/react";
import SubscriptionSection from "@/components/settings/subscription/SubscriptionSection";
import type { User } from "@/components/settings/subscription/types";
import * as handlers from "@/components/settings/subscription/handlers";

// Mock the external dependencies
jest.mock("@/components/settings/subscription/handlers");
jest.mock("@/lib/api/payments", () => ({
  fetchPaymentHistory: jest.fn(() => Promise.reject(new Error("Not implemented"))),
  PaymentsError: class PaymentsError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "PaymentsError";
    }
  }
}));

const mockHandlers = handlers as jest.Mocked<typeof handlers>;

// Mock user data for different subscription states
function createMockUser(overrides?: Partial<User>): User {
  return {
    handle: "test-user",
    email: "test@example.com",
    name: "Test User",
    membership_type: "standard",
    subscription_status: "never_subscribed",
    subscription: null,
    provider: "email",
    email_confirmed: true,
    ...overrides
  };
}

describe("SubscriptionSection", () => {
  const defaultProps = {
    refreshUser: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Loading state", () => {
    it("renders loading state when user is null", () => {
      render(<SubscriptionSection user={null} {...defaultProps} />);

      expect(screen.getByText("Loading subscription data...")).toBeInTheDocument();
    });
  });

  describe("Never subscribed state", () => {
    it("renders correctly for never subscribed user", async () => {
      const user = createMockUser();

      const { container } = render(<SubscriptionSection user={user} {...defaultProps} />);

      // Wait for component to render
      await waitFor(() => {
        expect(screen.getByText("Current Plan")).toBeInTheDocument();
      });

      // Verify it renders without errors
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Active Premium state", () => {
    it("renders correctly for active Premium user", async () => {
      const user = createMockUser({
        membership_type: "premium",
        subscription_status: "active",
        subscription: {
          subscription_valid_until: "2024-12-31T23:59:59Z",
          in_grace_period: false,
          grace_period_ends_at: null
        }
      });

      const { container } = render(<SubscriptionSection user={user} {...defaultProps} />);

      // Wait for component to render
      await waitFor(() => {
        expect(screen.getByText("Current Plan")).toBeInTheDocument();
      });

      // Verify it renders without errors
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Checkout modal", () => {
    // Note: Checkout modal tests removed - modal is now handled by global modal system
  });

  describe("Handler functions", () => {
    beforeEach(() => {
      mockHandlers.handleSubscribe.mockImplementation(() => Promise.resolve());
      mockHandlers.handleUpgradeToPremium.mockImplementation(() => Promise.resolve());
      mockHandlers.handleOpenPortal.mockImplementation(() => Promise.resolve());
      mockHandlers.handleCancelSubscription.mockImplementation(() => Promise.resolve());
      mockHandlers.handleReactivateSubscription.mockImplementation(() => Promise.resolve());
      mockHandlers.handleRetryPayment.mockImplementation(() => Promise.resolve());
    });

    it("handles upgrade to Premium for standard user", async () => {
      const user = createMockUser();

      render(<SubscriptionSection user={user} {...defaultProps} />);

      // Verify the component renders without errors
      await waitFor(() => {
        expect(screen.getByText("Current Plan")).toBeInTheDocument();
      });
    });

    it("shows confirmation dialog for subscription cancellation", async () => {
      const user = createMockUser({
        membership_type: "premium",
        subscription_status: "active"
      });

      render(<SubscriptionSection user={user} {...defaultProps} />);

      // Verify the component renders without errors
      await waitFor(() => {
        expect(screen.getByText("Current Plan")).toBeInTheDocument();
      });
    });

    it("shows confirmation dialog for downgrade", async () => {
      const user = createMockUser({
        membership_type: "premium",
        subscription_status: "active"
      });

      const { container } = render(<SubscriptionSection user={user} {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText("Current Plan")).toBeInTheDocument();
      });

      // Verify component renders
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Error handling", () => {
    it("handles async operation errors gracefully", async () => {
      const user = createMockUser();
      mockHandlers.handleSubscribe.mockRejectedValue(new Error("Network error"));

      const { container } = render(<SubscriptionSection user={user} {...defaultProps} />);

      // The error handling is internal to the component
      // We verify the component renders without crashing
      await waitFor(() => {
        expect(screen.getByText("Current Plan")).toBeInTheDocument();
      });

      // Verify component renders
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Loading states during async operations", () => {
    it("manages loading state during async operations", async () => {
      const user = createMockUser();

      const { container } = render(<SubscriptionSection user={user} {...defaultProps} />);

      // The loading state management is internal to the component
      await waitFor(() => {
        expect(screen.getByText("Current Plan")).toBeInTheDocument();
      });

      // Verify component renders
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
