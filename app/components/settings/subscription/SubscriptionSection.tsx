import { useState } from "react";
import toast from "react-hot-toast";
import { showConfirmation } from "@/lib/modal";
import SettingsCard from "../ui/SettingsCard";
import SubscriptionStatus from "../ui/SubscriptionStatus";
import SubscriptionStateSwitch from "./SubscriptionStateSwitch";
import type { SubscriptionState, SubscriptionData } from "./types";

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
  const subscriptionData: SubscriptionData = {
    tier: "premium",
    status: "active",
    nextBillingDate: "December 15, 2024",
    cancellationDate: "January 15, 2025",
    graceEndDate: "November 20, 2024",
    lastPaymentAttempt: "November 10, 2024",
    previousTier: "max",
    lastActiveDate: "October 15, 2024"
  };

  // Helper function to handle async operations with loading state and user feedback
  const handleAsyncOperation = async (operation: () => Promise<void>, actionName: string, successMessage?: string) => {
    setIsLoading(true);

    try {
      await operation();

      // Show success toast if provided
      if (successMessage) {
        toast.success(successMessage);
      }
    } catch (error) {
      console.error(`Failed to ${actionName}:`, error);

      // Show error toast with user-friendly message
      const errorMessage = error instanceof Error ? error.message : `Failed to ${actionName}. Please try again.`;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Event handlers for all subscription actions with user feedback
  const handleUpgradeToPremium = () =>
    handleAsyncOperation(
      async () => {
        // TODO: Implement Stripe integration for Premium upgrade
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      },
      "upgrade to Premium",
      "Successfully upgraded to Premium!"
    );

  const handleUpgradeToMax = () =>
    handleAsyncOperation(
      async () => {
        // TODO: Implement Stripe integration for Max upgrade
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      },
      "upgrade to Max",
      "Successfully upgraded to Max!"
    );

  const handleDowngradeToPremium = () => {
    showConfirmation({
      title: "Downgrade to Premium",
      message:
        "You'll lose access to Max-exclusive features like AI-powered hints and priority support, but keep all Premium features. Changes take effect at your next billing cycle.",
      variant: "default",
      onConfirm: () => {
        void handleAsyncOperation(
          async () => {
            // TODO: Implement Stripe integration for downgrade to Premium
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
          },
          "downgrade to Premium",
          "Successfully downgraded to Premium"
        );
      },
      onCancel: () => {
        // User cancelled the action
      }
    });
  };

  const handleUpdatePayment = () =>
    handleAsyncOperation(
      async () => {
        // TODO: Open Stripe customer portal for payment method update
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      },
      "update payment method",
      "Payment method updated successfully"
    );

  const handleCancel = () => {
    showConfirmation({
      title: "Cancel Subscription",
      message:
        "Are you sure you want to cancel your subscription? You'll continue to have access until your current billing period ends, but you won't be charged again.",
      variant: "danger",
      onConfirm: () => {
        void handleAsyncOperation(
          async () => {
            // TODO: Implement subscription cancellation
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
          },
          "cancel subscription",
          "Subscription cancelled successfully"
        );
      },
      onCancel: () => {
        // User cancelled the action - no toast needed
      }
    });
  };

  const handleReactivate = () =>
    handleAsyncOperation(
      async () => {
        // TODO: Implement subscription reactivation
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      },
      "reactivate subscription",
      "Subscription reactivated successfully"
    );

  const handleRetryPayment = () =>
    handleAsyncOperation(
      async () => {
        // TODO: Retry failed payment
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      },
      "retry payment",
      "Payment processed successfully"
    );

  const handleResubscribeToPremium = () =>
    handleAsyncOperation(
      async () => {
        // TODO: Implement resubscription to Premium
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      },
      "resubscribe to Premium",
      "Successfully resubscribed to Premium!"
    );

  const handleResubscribeToMax = () =>
    handleAsyncOperation(
      async () => {
        // TODO: Implement resubscription to Max
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      },
      "resubscribe to Max",
      "Successfully resubscribed to Max!"
    );

  const handleCompletePayment = () =>
    handleAsyncOperation(
      async () => {
        // TODO: Complete incomplete payment setup
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      },
      "complete payment setup",
      "Payment setup completed successfully"
    );

  const handleTryPremiumAgain = () =>
    handleAsyncOperation(
      async () => {
        // TODO: Restart Premium subscription process
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      },
      "start Premium subscription",
      "Premium subscription started successfully!"
    );

  const handleTryMaxAgain = () =>
    handleAsyncOperation(
      async () => {
        // TODO: Restart Max subscription process
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      },
      "start Max subscription",
      "Max subscription started successfully!"
    );

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
