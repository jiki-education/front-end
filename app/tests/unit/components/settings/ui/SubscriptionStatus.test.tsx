/**
 * Unit tests for SubscriptionStatus component
 */
import { render, screen } from "@testing-library/react";
import SubscriptionStatus from "@/components/settings/ui/SubscriptionStatus";
import { createMockUser } from "@/tests/mocks/user";
import type { SubscriptionDetails } from "@/types/subscription";

// Pin locale to en-US so tests don't depend on the developer's system locale
const _OriginalNumberFormat = Intl.NumberFormat;
jest.spyOn(Intl, "NumberFormat").mockImplementation((_, options) => new _OriginalNumberFormat("en-US", options));

function subscription(overrides?: Partial<SubscriptionDetails>): SubscriptionDetails {
  return {
    interval: "monthly",
    amount_in_cents: 999,
    currency: "usd",
    in_grace_period: false,
    grace_period_ends_at: null,
    subscription_valid_until: "2030-12-31T00:00:00Z",
    ...overrides
  };
}

describe("SubscriptionStatus", () => {
  it("shows the free plan", () => {
    render(<SubscriptionStatus user={createMockUser()} nextBillingDate={null} />);

    expect(screen.getByText(/This gives you all the content plus Ask Jiki/)).toBeInTheDocument();
  });

  it("shows a former subscriber whose subscription has ended as free", () => {
    const user = createMockUser({ subscription_status: "canceled" });
    render(<SubscriptionStatus user={user} nextBillingDate={null} />);

    expect(screen.getByText(/This gives you all the content plus Ask Jiki/)).toBeInTheDocument();
  });

  it("shows lifetime Premium", () => {
    const user = createMockUser({ membership_type: "premium", lifetime_premium: true });
    render(<SubscriptionStatus user={user} nextBillingDate={null} />);

    expect(screen.getByText(/for life\. There's nothing to renew\./)).toBeInTheDocument();
  });

  it("shows Premium that comes from elsewhere without a price", () => {
    const user = createMockUser({ membership_type: "premium" });
    render(<SubscriptionStatus user={user} nextBillingDate={null} />);

    expect(screen.getByText("Jiki Premium")).toBeInTheDocument();
    expect(screen.queryByText(/\$/)).not.toBeInTheDocument();
  });

  describe("legacy subscriber", () => {
    it("shows the subscription's own price and next billing date", () => {
      const user = createMockUser({
        membership_type: "premium",
        subscription_status: "active",
        subscription: subscription({ amount_in_cents: 799, currency: "gbp" })
      });
      render(<SubscriptionStatus user={user} nextBillingDate="Dec 31, 2030" />);

      expect(screen.getByText("£7.99/month")).toBeInTheDocument();
      expect(screen.getByText("Dec 31, 2030")).toBeInTheDocument();
    });

    it("shows an annual price per year", () => {
      const user = createMockUser({
        membership_type: "premium",
        subscription_status: "active",
        subscription: subscription({ interval: "annual", amount_in_cents: 9900 })
      });
      render(<SubscriptionStatus user={user} nextBillingDate={null} />);

      expect(screen.getByText("$99/year")).toBeInTheDocument();
    });

    it("leaves the price out when the API hasn't stored it", () => {
      const user = createMockUser({
        membership_type: "premium",
        subscription_status: "active",
        subscription: subscription({ amount_in_cents: null, currency: null })
      });
      render(<SubscriptionStatus user={user} nextBillingDate={null} />);

      expect(screen.getByText("Jiki Premium")).toBeInTheDocument();
      expect(screen.queryByText(/\/month/)).not.toBeInTheDocument();
    });

    it("shows a scheduled cancellation", () => {
      const user = createMockUser({
        membership_type: "premium",
        subscription_status: "cancelling",
        subscription: subscription()
      });
      render(<SubscriptionStatus user={user} nextBillingDate="Dec 31, 2030" />);

      expect(screen.getByText(/Your Jiki Premium subscription has been cancelled\./)).toBeInTheDocument();
    });

    it("shows a failed payment with the renewal price", () => {
      const user = createMockUser({
        membership_type: "premium",
        subscription_status: "payment_failed",
        subscription: subscription()
      });
      render(<SubscriptionStatus user={user} nextBillingDate={null} />);

      expect(screen.getByText("Payment Failed")).toBeInTheDocument();
      expect(screen.getByText("Payment failed - please update payment method")).toBeInTheDocument();
      expect(screen.getByText("$9.99/month")).toBeInTheDocument();
    });

    it("shows an incomplete subscription", () => {
      const user = createMockUser({
        membership_type: "standard",
        subscription_status: "incomplete",
        subscription: subscription()
      });
      render(<SubscriptionStatus user={user} nextBillingDate={null} />);

      expect(screen.getByText("Incomplete")).toBeInTheDocument();
      expect(screen.getByText("Payment setup incomplete - please complete setup")).toBeInTheDocument();
    });
  });
});
