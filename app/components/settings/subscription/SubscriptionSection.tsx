import { useState } from "react";
import SettingsCard from "../ui/SettingsCard";
import SubscriptionStatus from "../ui/SubscriptionStatus";
import SubscriptionStateSwitch from "./SubscriptionStateSwitch";

type SubscriptionState = "never_subscribed" | "active_premium" | "active_max" | "canceled" | "past_due";

interface SubscriptionSectionProps {
  className?: string;
}

export default function SubscriptionSection({ className = "" }: SubscriptionSectionProps) {
  const [isLoading, setIsLoading] = useState(false);

  // For now, mock the subscription state - this will be replaced with real data from API
  const subscriptionState: SubscriptionState = "never_subscribed"; // This will come from API
  const currentTier = "free" as const;
  const subscriptionStatus = "active" as const;

  // Mock subscription data - this will come from API
  const subscriptionData = {
    tier: "premium" as const,
    status: "active" as const,
    nextBillingDate: "December 15, 2024",
    cancellationDate: "January 15, 2025",
    graceEndDate: "November 20, 2024",
    lastPaymentAttempt: "November 10, 2024",
    previousTier: "max" as const,
    lastActiveDate: "October 15, 2024"
  };

  // Helper function to handle async operations with loading state
  const handleAsyncOperation = async (operation: () => Promise<void>, actionName: string) => {
    setIsLoading(true);
    try {
      await operation();
    } catch (error) {
      console.error(`Failed to ${actionName}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Event handlers for all subscription actions
  const handleUpgradeToPremium = () =>
    handleAsyncOperation(async () => {
      // TODO: Implement Stripe integration for Premium upgrade
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
    }, "upgrade to Premium");

  const handleUpgradeToMax = () =>
    handleAsyncOperation(async () => {
      // TODO: Implement Stripe integration for Max upgrade
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
    }, "upgrade to Max");

  const handleDowngradeToPremium = () =>
    handleAsyncOperation(async () => {
      // TODO: Implement Stripe integration for downgrade to Premium
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
    }, "downgrade to Premium");

  const handleUpdatePayment = () =>
    handleAsyncOperation(async () => {
      // TODO: Open Stripe customer portal for payment method update
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
    }, "update payment method");

  const handleCancel = () =>
    handleAsyncOperation(async () => {
      // TODO: Implement subscription cancellation
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
    }, "cancel subscription");

  const handleReactivate = () =>
    handleAsyncOperation(async () => {
      // TODO: Implement subscription reactivation
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
    }, "reactivate subscription");

  const handleRetryPayment = () =>
    handleAsyncOperation(async () => {
      // TODO: Retry failed payment
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
    }, "retry payment");

  const handleResubscribeToPremium = () =>
    handleAsyncOperation(async () => {
      // TODO: Implement resubscription to Premium
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
    }, "resubscribe to Premium");

  const handleResubscribeToMax = () =>
    handleAsyncOperation(async () => {
      // TODO: Implement resubscription to Max
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
    }, "resubscribe to Max");

  const handleCompletePayment = () =>
    handleAsyncOperation(async () => {
      // TODO: Complete incomplete payment setup
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
    }, "complete payment setup");

  const handleTryPremiumAgain = () =>
    handleAsyncOperation(async () => {
      // TODO: Restart Premium subscription process
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
    }, "try Premium again");

  const handleTryMaxAgain = () =>
    handleAsyncOperation(async () => {
      // TODO: Restart Max subscription process
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
    }, "try Max again");

  return (
    <SettingsCard
      title="Subscription"
      description="Manage your subscription plan and billing details"
      className={className}
    >
      <SubscriptionStatus tier={currentTier} status={subscriptionStatus} />

      <SubscriptionStateSwitch
        subscriptionState={subscriptionState}
        subscriptionData={subscriptionData}
        isLoading={isLoading}
        onUpgradeToPremium={handleUpgradeToPremium}
        onUpgradeToMax={handleUpgradeToMax}
        onDowngradeToPremium={handleDowngradeToPremium}
        onUpdatePayment={handleUpdatePayment}
        onCancel={handleCancel}
        onReactivate={handleReactivate}
        onRetryPayment={handleRetryPayment}
        onResubscribeToPremium={handleResubscribeToPremium}
        onResubscribeToMax={handleResubscribeToMax}
        onCompletePayment={handleCompletePayment}
        onTryPremiumAgain={handleTryPremiumAgain}
        onTryMaxAgain={handleTryMaxAgain}
      />
    </SettingsCard>
  );
}
