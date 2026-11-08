import { useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { showModal } from "@/lib/modal";
import { toastError } from "@/lib/toast";
import * as handlers from "./handlers";
import type { User } from "./types";

interface UseSubscriptionProps {
  user: User | null;
  refreshUser: () => Promise<void>;
}

export function useSubscription({ user, refreshUser }: UseSubscriptionProps) {
  const format = useFormatter();
  const t = useTranslations("settings.cancelConfirm");
  const [isLoading, setIsLoading] = useState(false);

  // Format a date in the active locale (respects the request-configured time
  // zone via next-intl's formatter).
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

  // Only legacy subscribers have a billing date
  const nextBillingDate = formatBillingDate(user?.subscription?.subscription_valid_until);

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

  const handlePurchasePremium = () =>
    handleAsyncOperation(async () => {
      if (!user) {
        return;
      }

      if (!user.can_purchase_premium) {
        // The UI only offers the purchase when it's allowed, so this is a stale page
        toastError("subscription.alreadyPremium");
        return;
      }

      await handlers.handlePurchasePremium();
    });

  // Legacy subscription management
  const handleCancel = () => {
    const premiumEndDate = nextBillingDate || t("defaultBillingPeriodEnd");

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

  return {
    isLoading,
    nextBillingDate,
    handlePurchasePremium,
    handleCancel,
    handleReactivate
  };
}
