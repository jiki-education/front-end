/**
 * Unit tests for SubscriptionStatus component
 */
import { render, screen } from "@testing-library/react";
import SubscriptionStatus from "@/components/settings/ui/SubscriptionStatus";

describe("SubscriptionStatus", () => {
  describe("Tier display", () => {
    it("displays Standard Plan correctly", () => {
      render(<SubscriptionStatus tier="standard" status="never_subscribed" nextBillingDate={null} />);

      expect(screen.getByText(/Free/)).toBeInTheDocument();
      expect(screen.getByText(/This gives you all the content plus Jiki AI/)).toBeInTheDocument();
    });

    it("displays Premium Plan correctly", () => {
      render(<SubscriptionStatus tier="premium" status="active" nextBillingDate="2024-12-31" />);

      expect(screen.getByText(/Jiki Premium/)).toBeInTheDocument();
      expect(screen.getByText(/\$3\.99\/month/)).toBeInTheDocument();
    });

    // Max tier removed - only standard and premium now
  });

  describe("Status display", () => {
    it("displays Active status", () => {
      render(<SubscriptionStatus tier="premium" status="active" nextBillingDate="2024-12-31" />);

      expect(screen.getByText("Active")).toBeInTheDocument();
    });

    it("displays Canceled status", () => {
      render(<SubscriptionStatus tier="premium" status="canceled" nextBillingDate={null} />);

      expect(screen.getByText("Canceled")).toBeInTheDocument();
      expect(screen.getByText("Service continues until period end")).toBeInTheDocument();
    });

    it("displays Payment Failed status", () => {
      render(<SubscriptionStatus tier="premium" status="payment_failed" nextBillingDate={null} />);

      expect(screen.getByText("Payment Failed")).toBeInTheDocument();
      expect(screen.getByText("Payment failed - please update payment method")).toBeInTheDocument();
    });

    it("displays Cancelling status", () => {
      render(<SubscriptionStatus tier="premium" status="cancelling" nextBillingDate="2024-12-31" />);

      expect(screen.getByText("Cancelling")).toBeInTheDocument();
      expect(screen.getByText("Cancellation scheduled - access until period end")).toBeInTheDocument();
    });

    it("displays Incomplete status", () => {
      render(<SubscriptionStatus tier="premium" status="incomplete" nextBillingDate={null} />);

      expect(screen.getByText("Incomplete")).toBeInTheDocument();
      expect(screen.getByText("Payment setup incomplete - please complete setup")).toBeInTheDocument();
    });

    it("displays never_subscribed status for premium tier", () => {
      render(<SubscriptionStatus tier="premium" status="never_subscribed" nextBillingDate={null} />);

      // For premium tier with never_subscribed, it shows the Free plan message
      expect(screen.getByText(/Free/)).toBeInTheDocument();
      expect(screen.getByText(/This gives you all the content plus Jiki AI/)).toBeInTheDocument();
    });
  });

  describe("Billing information", () => {
    it("displays next billing date for active subscriptions", () => {
      render(<SubscriptionStatus tier="premium" status="active" nextBillingDate="2024-12-31" />);

      expect(screen.getByText(/Your next billing date is/)).toBeInTheDocument();
      expect(screen.getByText("2024-12-31")).toBeInTheDocument();
    });

    it("does not display billing date for non-active subscriptions", () => {
      render(<SubscriptionStatus tier="premium" status="canceled" nextBillingDate="2024-12-31" />);

      expect(screen.queryByText(/Your next billing date is/)).not.toBeInTheDocument();
    });

    it("does not display billing date when not provided", () => {
      render(<SubscriptionStatus tier="premium" status="active" nextBillingDate={null} />);

      expect(screen.queryByText(/Your next billing date is/)).not.toBeInTheDocument();
    });
  });

  describe("Standard tier behavior", () => {
    it("does not show status badge for standard tier", () => {
      render(<SubscriptionStatus tier="standard" status="never_subscribed" nextBillingDate={null} />);

      // Should show free plan message but not status for standard
      expect(screen.getByText(/Free/)).toBeInTheDocument();
      expect(screen.queryByText("Not Subscribed")).not.toBeInTheDocument();
    });

    it("shows status badge for premium tier", () => {
      render(<SubscriptionStatus tier="premium" status="active" nextBillingDate="2024-12-31" />);

      expect(screen.getByText(/Jiki Premium/)).toBeInTheDocument();
      expect(screen.getByText("Active")).toBeInTheDocument();
    });

    // Max tier removed - only standard and premium now
  });

  describe("Custom styling", () => {
    it("applies custom className", () => {
      const { container } = render(
        <SubscriptionStatus tier="premium" status="active" nextBillingDate="2024-12-31" className="custom-class" />
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("Accessibility", () => {
    it("provides proper aria labels", () => {
      render(<SubscriptionStatus tier="premium" status="active" nextBillingDate="2024-12-31" />);

      // Component provides aria-label for subscription status
      expect(screen.getByLabelText("Subscription status: Active")).toBeInTheDocument();
    });

    // Screen reader text tests removed - component doesn't include sr-only text elements
  });
});
