import { useState } from "react";
import { showConfirmation } from "@/lib/modal";
import type { MembershipTier } from "@/lib/pricing";
import { PRICING_TIERS } from "@/lib/pricing";
import toast from "react-hot-toast";
import { getSubscriptionState } from "./utils";
import * as handlers from "./handlers";
import type { User, SubscriptionData } from "./types";

interface UseSubscriptionProps {
  user: User | null;
  refreshUser: () => Promise<void>;
  selectedTier: MembershipTier | null;
  setSelectedTier: (tier: MembershipTier | null) => void;
  clientSecret: string | null;
  setClientSecret: (secret: string | null) => void;
}

export function useSubscription({
  user,
  refreshUser,
  selectedTier,
  setSelectedTier,
  clientSecret,
  setClientSecret
}: UseSubscriptionProps) {
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

  // Helper function to format date
  const formatBillingDate = (dateString: string | null | undefined) => {
    if (!dateString) {
      return null;
    }
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric"
    };
    return date.toLocaleDateString("en-US", options);
  };

  // Get tier details for display
  const tierDetails = PRICING_TIERS[currentTier];
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
          tier: "premium",
          userEmail: user.email,
          setSelectedTier,
          setClientSecret
        });
      } else if (user.membership_type === "premium") {
        // Already on premium - this shouldn't happen if UI is correct
        toast.error("Already on Premium tier");
      } else {
        // Max tier users trying to "upgrade" to premium is invalid
        toast.error("Cannot downgrade from Max to Premium tier");
      }
    });

  const handleUpgradeToMax = () =>
    handleAsyncOperation(async () => {
      if (!user) {
        return;
      }

      if (user.membership_type === "standard") {
        // New subscription - use checkout flow
        await handlers.handleSubscribe({
          tier: "max",
          userEmail: user.email,
          setSelectedTier,
          setClientSecret
        });
      } else {
        // Existing subscription - upgrade
        await handlers.handleUpgradeToMax(refreshUser);
      }
    });

  const handleDowngradeToPremium = () => {
    showConfirmation({
      title: "Downgrade to Premium",
      message:
        "You'll lose access to Max-exclusive features like AI-powered hints and priority support, but keep all Premium features. Changes take effect at your next billing cycle.",
      variant: "default",
      onConfirm: () => {
        void handleAsyncOperation(async () => {
          await handlers.handleDowngradeToPremium(refreshUser);
        });
      },
      onCancel: () => {
        // User cancelled the action
      }
    });
  };

  const handleUpdatePayment = () =>
    handleAsyncOperation(async () => {
      await handlers.handleOpenPortal();
    });

  const handleCancel = () => {
    showConfirmation({
      title: "Cancel Subscription",
      message:
        "Are you sure you want to cancel your subscription? You'll continue to have access until your current billing period ends, but you won't be charged again.",
      variant: "danger",
      onConfirm: () => {
        void handleAsyncOperation(async () => {
          await handlers.handleCancelSubscription(refreshUser);
        });
      },
      onCancel: () => {
        // User cancelled the action - no toast needed
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
        tier: "premium",
        userEmail: user.email,
        setSelectedTier,
        setClientSecret
      });
    });

  const handleResubscribeToMax = () =>
    handleAsyncOperation(async () => {
      if (!user) {
        return;
      }
      await handlers.handleSubscribe({
        tier: "max",
        userEmail: user.email,
        setSelectedTier,
        setClientSecret
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
        tier: "premium",
        userEmail: user.email,
        setSelectedTier,
        setClientSecret
      });
    });

  const handleTryMaxAgain = () =>
    handleAsyncOperation(async () => {
      if (!user) {
        return;
      }
      await handlers.handleSubscribe({
        tier: "max",
        userEmail: user.email,
        setSelectedTier,
        setClientSecret
      });
    });

  // Checkout flow handlers
  const handleCheckoutCancel = () => {
    setClientSecret(null);
    setSelectedTier(null);
  };

  return {
    // State
    isLoading,
    user,
    subscriptionState,
    currentTier,
    subscriptionStatus,
    subscriptionData,
    tierDetails,
    nextBillingDate,
    selectedTier,
    clientSecret,

    // Handlers
    handleUpgradeToPremium,
    handleUpgradeToMax,
    handleDowngradeToPremium,
    handleUpdatePayment,
    handleCancel,
    handleReactivate,
    handleRetryPayment,
    handleResubscribeToPremium,
    handleResubscribeToMax,
    handleCompletePayment,
    handleTryPremiumAgain,
    handleTryMaxAgain,
    handleCheckoutCancel
  };
}
