/**
 * Unit tests for SubscriptionStatus component
 */
import { render, screen } from "@testing-library/react";
import SubscriptionStatus from "@/components/settings/ui/SubscriptionStatus";

describe("SubscriptionStatus", () => {
  describe("Tier display", () => {
    it("displays Standard Plan correctly", () => {
      render(<SubscriptionStatus tier="standard" status="never_subscribed" />);

      expect(screen.getByText("Standard Plan")).toBeInTheDocument();
      expect(screen.getByText("Basic features included")).toBeInTheDocument();
    });

    it("displays Premium Plan correctly", () => {
      render(<SubscriptionStatus tier="premium" status="active" />);

      expect(screen.getByText("Premium Plan")).toBeInTheDocument();
      expect(screen.getByText("$3/month")).toBeInTheDocument();
    });

    it("displays Max Plan correctly", () => {
      render(<SubscriptionStatus tier="max" status="active" />);

      expect(screen.getByText("Max Plan")).toBeInTheDocument();
      expect(screen.getByText("$9/month")).toBeInTheDocument();
    });
  });

  describe("Status display", () => {
    it("displays Active status", () => {
      render(<SubscriptionStatus tier="premium" status="active" />);

      expect(screen.getByText("Active")).toBeInTheDocument();
    });

    it("displays Canceled status", () => {
      render(<SubscriptionStatus tier="premium" status="canceled" />);

      expect(screen.getByText("Canceled")).toBeInTheDocument();
      expect(screen.getByText("Service continues until period end")).toBeInTheDocument();
    });

    it("displays Payment Failed status", () => {
      render(<SubscriptionStatus tier="premium" status="payment_failed" />);

      expect(screen.getByText("Payment Failed")).toBeInTheDocument();
      expect(screen.getByText("Payment failed - please update payment method")).toBeInTheDocument();
    });

    it("displays Cancelling status", () => {
      render(<SubscriptionStatus tier="premium" status="cancelling" />);

      expect(screen.getByText("Cancelling")).toBeInTheDocument();
      expect(screen.getByText("Cancellation scheduled - access until period end")).toBeInTheDocument();
    });

    it("displays Incomplete status", () => {
      render(<SubscriptionStatus tier="premium" status="incomplete" />);

      expect(screen.getByText("Incomplete")).toBeInTheDocument();
      expect(screen.getByText("Payment setup incomplete - please complete setup")).toBeInTheDocument();
    });

    it("displays Not Subscribed status for non-standard tier", () => {
      render(<SubscriptionStatus tier="premium" status="never_subscribed" />);

      expect(screen.getByText("Not Subscribed")).toBeInTheDocument();
    });
  });

  describe("Billing information", () => {
    it("displays next billing date for active subscriptions", () => {
      render(<SubscriptionStatus tier="premium" status="active" nextBillingDate="2024-12-31" />);

      expect(screen.getByText("Next billing: 2024-12-31")).toBeInTheDocument();
    });

    it("does not display billing date for non-active subscriptions", () => {
      render(<SubscriptionStatus tier="premium" status="canceled" nextBillingDate="2024-12-31" />);

      expect(screen.queryByText("Next billing: 2024-12-31")).not.toBeInTheDocument();
    });

    it("does not display billing date when not provided", () => {
      render(<SubscriptionStatus tier="premium" status="active" />);

      expect(screen.queryByText(/Next billing:/)).not.toBeInTheDocument();
    });
  });

  describe("Standard tier behavior", () => {
    it("does not show status badge for standard tier", () => {
      render(<SubscriptionStatus tier="standard" status="never_subscribed" />);

      // Should show tier but not status for standard
      expect(screen.getByText("Standard Plan")).toBeInTheDocument();
      expect(screen.queryByText("Not Subscribed")).not.toBeInTheDocument();
    });

    it("shows status badge for premium tier", () => {
      render(<SubscriptionStatus tier="premium" status="active" />);

      expect(screen.getByText("Premium Plan")).toBeInTheDocument();
      expect(screen.getByText("Active")).toBeInTheDocument();
    });

    it("shows status badge for max tier", () => {
      render(<SubscriptionStatus tier="max" status="active" />);

      expect(screen.getByText("Max Plan")).toBeInTheDocument();
      expect(screen.getByText("Active")).toBeInTheDocument();
    });
  });

  describe("Custom styling", () => {
    it("applies custom className", () => {
      const { container } = render(<SubscriptionStatus tier="premium" status="active" className="custom-class" />);

      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("Accessibility", () => {
    it("provides proper aria labels", () => {
      render(<SubscriptionStatus tier="premium" status="active" />);

      expect(screen.getByLabelText("Current subscription status")).toBeInTheDocument();
      expect(screen.getByLabelText("Current plan: Premium Plan")).toBeInTheDocument();
      expect(screen.getByLabelText("Subscription status: Active")).toBeInTheDocument();
    });

    it("includes screen reader text", () => {
      render(<SubscriptionStatus tier="premium" status="active" nextBillingDate="2024-12-31" />);

      expect(screen.getByText("Billing information:")).toHaveClass("sr-only");
    });

    it("includes screen reader text for payment issues", () => {
      render(<SubscriptionStatus tier="premium" status="payment_failed" />);

      expect(screen.getByText("Payment issue:")).toHaveClass("sr-only");
    });

    it("includes screen reader text for cancellation", () => {
      render(<SubscriptionStatus tier="premium" status="canceled" />);

      expect(screen.getByText("Cancellation notice:")).toHaveClass("sr-only");
    });
  });
});
