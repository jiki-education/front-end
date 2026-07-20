import { useState } from "react";
import { useFormatter } from "next-intl";
import { showModal } from "@/lib/modal";
import { toastError } from "@/lib/toast";
import { getSubscriptionState } from "./utils";
import * as handlers from "./handlers";
import type { User, SubscriptionData } from "./types";

interface UseSubscriptionProps {
  user: User | null;
  refreshUser: () => Promise<void>;
}

export function useSubscription({ user, refreshUser }: UseSubscriptionProps) {
  const format = useFormatter();
  const [isLoading, setIsLoading] = useState(false);

  // Get subscription state and data
  const subscriptionState = user ? getSubscriptionState(user) : null;
  const currentTier = user?.membership_type || "standard";
  const subscriptionStatus = user?.subscription_status || "never_subscribed";

  // Create subscription data from user data
  const subscriptionData: SubscriptionData | null = user
    ? {
        tier: user.membership_type,
        status: user.subscription_status,
        nextBillingDate: user.subscription?.subscription_valid_until,
        graceEndDate: user.subscription?.grace_period_ends_at || undefined,
        previousTier: undefined // This would need to come from API
      }
    : null;

  // Helper function to format date in the active locale (respects the
  // request-configured time zone via next-intl's formatter).
  const formatBillingDate = (dateString: string | null | undefined) => {
    if (!dateString) {
      return null;
    }
    return format.dateTime(new Date(dateString), {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const nextBillingDate = formatBillingDate(subscriptionData?.nextBillingDate);

  // Helper function to handle async operations with loading state
  const handleAsyncOperation = async (operation: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await operation();
    } catch (error) {
      console.error("Operation failed:", error);
      // Error handling is done in individual handlers
    } finally {
      setIsLoading(false);
    }
  };

  // Event handlers for all subscription actions
  const handleUpgradeToPremium = () =>
    handleAsyncOperation(async () => {
      if (!user) {
        return;
      }

      if (user.membership_type === "standard") {
        // New subscription - use checkout flow
        await handlers.handleSubscribe({
          interval: "monthly",
          userEmail: user.email
        });
      } else {
        // Already on premium - this shouldn't happen if UI is correct
        toastError("subscription.alreadyPremium");
      }
    });

  const handleUpdatePayment = () =>
    handleAsyncOperation(async () => {
      await handlers.handleOpenPortal();
    });

  const handleCancel = () => {
    const premiumEndDate = nextBillingDate || "your billing period end";

    showModal("cancel-subscription-confirm-modal", {
      premiumEndDate,
      onConfirmCancel: async () => {
        await handlers.handleCancelSubscription(refreshUser);
      }
    });
  };

  const handleReactivate = () =>
    handleAsyncOperation(async () => {
      await handlers.handleReactivateSubscription(refreshUser);
    });

  const handleRetryPayment = () =>
    handleAsyncOperation(async () => {
      await handlers.handleRetryPayment(refreshUser);
    });

  const handleResubscribeToPremium = () =>
    handleAsyncOperation(async () => {
      if (!user) {
        return;
      }
      await handlers.handleSubscribe({
        interval: "monthly",
        userEmail: user.email
      });
    });

  const handleCompletePayment = () =>
    handleAsyncOperation(async () => {
      // For incomplete payment, direct to portal to complete setup
      await handlers.handleOpenPortal();
    });

  const handleTryPremiumAgain = () =>
    handleAsyncOperation(async () => {
      if (!user) {
        return;
      }
      await handlers.handleSubscribe({
        interval: "monthly",
        userEmail: user.email
      });
    });

  return {
    // State
    isLoading,
    user,
    subscriptionState,
    currentTier,
    subscriptionStatus,
    subscriptionData,
    nextBillingDate,

    // Handlers
    handleUpgradeToPremium,
    handleUpdatePayment,
    handleCancel,
    handleReactivate,
    handleRetryPayment,
    handleResubscribeToPremium,
    handleCompletePayment,
    handleTryPremiumAgain
  };
}
