import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth/authStore";
import { trackEvent, type ModalTrigger } from "@/lib/analytics";
import { handlePurchasePremium } from "@/lib/subscriptions/handlers";
import { hideModal } from "../../store";

export interface PremiumUpsellProps {
  trigger?: ModalTrigger;
  // The exercise the user just finished, when shown after a completion
  contextSlug?: string;
  onContinue?: () => void;
}

// The behaviour every Premium upsell modal shares: analytics, Continue,
// Upgrade, and hiding the purchase while an earlier one is still clearing.
export function usePremiumUpsell({ trigger, contextSlug, onContinue }: PremiumUpsellProps) {
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const properties: Record<string, unknown> = {};
    if (trigger) {
      properties.trigger = trigger;
    }
    if (contextSlug) {
      properties.context_type = "lesson";
      properties.context_slug = contextSlug;
    }
    trackEvent("premium_modal_shown", properties);
  }, [trigger, contextSlug]);

  const handleContinue = () => {
    onContinue?.();
    hideModal();
  };

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      // Shows the checkout modal in place of this one
      await handlePurchasePremium({ trigger, returnPath: window.location.pathname });
    } catch {
      // handlePurchasePremium has already toasted the reason
      setIsLoading(false);
    }
  };

  return {
    isPending: user?.premium_purchase_pending === true,
    isLoading,
    handleContinue,
    handleUpgrade
  };
}
