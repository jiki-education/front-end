/**
 * Unit tests for SubscriptionSection component
 *
 * The section shows different things for each way a user can hold Premium:
 * free, a lifetime purchase, a legacy subscription, or Premium from elsewhere.
 */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SubscriptionSection from "@/components/settings/subscription/SubscriptionSection";
import * as handlers from "@/components/settings/subscription/handlers";
import { createMockUser } from "@/tests/mocks/user";

// Pin locale to en-US so tests don't depend on the developer's system locale
const _OriginalNumberFormat = Intl.NumberFormat;
jest.spyOn(Intl, "NumberFormat").mockImplementation((_, options) => new _OriginalNumberFormat("en-US", options));

jest.mock("@/components/settings/subscription/handlers");
jest.mock("@/lib/api/payments", () => ({
  fetchPayments: jest.fn(() => Promise.resolve([]))
}));

const mockHandlers = handlers as jest.Mocked<typeof handlers>;

const LIVE_SUBSCRIPTION = {
  interval: "monthly" as const,
  amount_in_cents: 999,
  currency: "usd",
  subscription_valid_until: "2030-12-31T23:59:59Z",
  in_grace_period: false,
  grace_period_ends_at: null
};

describe("SubscriptionSection", () => {
  const defaultProps = {
    refreshUser: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockHandlers.handlePurchasePremium.mockResolvedValue(undefined);
  });

  it("renders a loading state when user is null", () => {
    render(<SubscriptionSection user={null} {...defaultProps} />);

    expect(screen.getByText("Loading your billing details...")).toBeInTheDocument();
  });

  describe("free user", () => {
    it("offers the one-off purchase", async () => {
      render(<SubscriptionSection user={createMockUser()} {...defaultProps} />);

      expect(screen.getByText("One-off payment. Yours for life.")).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: "Upgrade to Premium" }));

      await waitFor(() => expect(mockHandlers.handlePurchasePremium).toHaveBeenCalled());
      expect(screen.queryByRole("button", { name: "Cancel" })).not.toBeInTheDocument();
    });

    it("shows the pending notice instead of the upsell while a purchase clears", () => {
      const user = createMockUser({ premium_purchase_pending: true, can_purchase_premium: false });

      render(<SubscriptionSection user={user} {...defaultProps} />);

      expect(screen.getByText("Your payment is on its way")).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Upgrade to Premium" })).not.toBeInTheDocument();
    });

    it("offers nothing while a failed legacy subscription still blocks a purchase", () => {
      const user = createMockUser({
        can_purchase_premium: false,
        subscription_status: "payment_failed",
        subscription: LIVE_SUBSCRIPTION
      });

      render(<SubscriptionSection user={user} {...defaultProps} />);

      expect(screen.queryByRole("button", { name: "Upgrade to Premium" })).not.toBeInTheDocument();
    });
  });

  describe("lifetime member", () => {
    it("shows Premium for life with nothing to cancel", () => {
      const user = createMockUser({ membership_type: "premium", lifetime_premium: true, can_purchase_premium: false });

      render(<SubscriptionSection user={user} {...defaultProps} />);

      expect(screen.getByText(/for life\. Thanks for supporting our mission!/)).toBeInTheDocument();
      expect(screen.queryByText("Cancel Subscription")).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Upgrade to Premium" })).not.toBeInTheDocument();
    });
  });

  describe("legacy subscriber", () => {
    it("shows the subscription's own price and lets them cancel", () => {
      const user = createMockUser({
        membership_type: "premium",
        can_purchase_premium: false,
        subscription_status: "active",
        subscription: { ...LIVE_SUBSCRIPTION, amount_in_cents: 799, currency: "gbp" }
      });

      render(<SubscriptionSection user={user} {...defaultProps} />);

      expect(screen.getByText("£7.99/month")).toBeInTheDocument();
      expect(screen.getByText("Cancel Subscription")).toBeInTheDocument();
    });

    it("shows an annual subscription per year", () => {
      const user = createMockUser({
        membership_type: "premium",
        can_purchase_premium: false,
        subscription_status: "active",
        subscription: { ...LIVE_SUBSCRIPTION, interval: "annual", amount_in_cents: 9900 }
      });

      render(<SubscriptionSection user={user} {...defaultProps} />);

      expect(screen.getByText("$99/year")).toBeInTheDocument();
    });

    it("leaves the price out until the API has stored it", () => {
      const user = createMockUser({
        membership_type: "premium",
        can_purchase_premium: false,
        subscription_status: "active",
        subscription: { ...LIVE_SUBSCRIPTION, amount_in_cents: null, currency: null }
      });

      render(<SubscriptionSection user={user} {...defaultProps} />);

      expect(screen.queryByText(/\/month/)).not.toBeInTheDocument();
      expect(screen.getByText(/plan\./)).toBeInTheDocument();
    });

    it("offers to resubscribe once a cancellation is scheduled", () => {
      const user = createMockUser({
        membership_type: "premium",
        can_purchase_premium: false,
        subscription_status: "cancelling",
        subscription: LIVE_SUBSCRIPTION
      });

      render(<SubscriptionSection user={user} {...defaultProps} />);

      expect(screen.getByRole("button", { name: "Resubscribe to Premium" })).toBeInTheDocument();
      expect(screen.queryByText("Cancel Subscription")).not.toBeInTheDocument();
    });
  });

  describe("Premium from elsewhere", () => {
    it("shows Premium with nothing to cancel or buy", () => {
      const user = createMockUser({ membership_type: "premium", can_purchase_premium: false });

      render(<SubscriptionSection user={user} {...defaultProps} />);

      expect(screen.getByText(/^You have/)).toBeInTheDocument();
      expect(screen.queryByText("Cancel Subscription")).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Upgrade to Premium" })).not.toBeInTheDocument();
    });
  });
});
