"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/auth/authStore";
import { hideModal } from "../store";
import { handleSubscribe } from "@/lib/subscriptions/handlers";
import { PRICING_TIERS } from "@/lib/pricing";
import { PremiumPrice } from "@/components/common/PremiumPrice";
import SubscriptionButton from "@/components/settings/ui/SubscriptionButton";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

interface SubscriptionModalProps {
  // Entry context for analytics and flow optimization
  triggerContext?: "chat-gate" | "feature-gate" | "general" | "settings";

  // Pre-select a tier if coming from specific feature
  suggestedTier?: "premium" | "max";

  // Custom messaging based on trigger context
  headline?: string;
  description?: string;

  // Feature-specific messaging
  featuresContext?: {
    feature: string; // e.g., "AI Chat Assistant"
    benefits: string[]; // Specific benefits for this feature
  };

  // Callbacks
  onCancel?: () => void;
}

export function SubscriptionModal({
  triggerContext = "general",
  suggestedTier,
  headline,
  description,
  featuresContext,
  onCancel
}: SubscriptionModalProps) {
  const t = useTranslations("modals.subscription");
  const tToast = useTranslations("toasts.subscription");
  const [isLoading, setIsLoading] = useState(false);
  const user = useAuthStore((state: any) => state.user);

  const premiumTier = PRICING_TIERS.premium;

  // Default content based on context
  const getDefaultContent = () => {
    switch (triggerContext) {
      case "chat-gate":
        return {
          headline: t("chatGate.headline"),
          description: t("chatGate.description")
        };
      case "feature-gate":
        return {
          headline: t("featureGate.headline", {
            feature: featuresContext?.feature || t("featureGate.headlineFallback")
          }),
          description: t("featureGate.description")
        };
      case "settings":
        return {
          headline: t("settings.headline"),
          description: t("settings.description")
        };
      case "general":
      default:
        return {
          headline: t("general.headline"),
          description: t("general.description")
        };
    }
  };

  const defaultContent = getDefaultContent();
  const finalHeadline = headline || defaultContent.headline;
  const finalDescription = description || defaultContent.description;

  const handleTierSelection = async () => {
    if (!user) {
      toast.error(tToast("loginRequired"));
      return;
    }

    setIsLoading(true);
    try {
      // Close this modal first
      hideModal();

      // handleSubscribe will show the checkout modal
      await handleSubscribe({
        interval: "monthly",
        userEmail: user.email,
        returnPath: window.location.pathname
      });
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error(tToast("checkoutFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onCancel?.();
    hideModal();
  };

  // Note: Checkout modal is now triggered directly by handleSubscribe

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-2">{finalHeadline}</h2>
        <p className="text-text-secondary text-lg">{finalDescription}</p>
      </div>

      {/* Feature Context Benefits */}
      {featuresContext && (
        <div className="bg-bg-secondary p-4 rounded-lg border border-border-secondary">
          <h3 className="font-medium text-text-primary mb-12">
            {t("unlockWith", { feature: featuresContext.feature })}
          </h3>
          <ul className="space-y-2">
            {featuresContext.benefits.map((benefit, index) => (
              <li key={index} className="flex items-center text-sm text-text-secondary">
                <span className="text-green-500 mr-12 flex-shrink-0" aria-hidden="true">
                  ✓
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tier Selection */}
      <div className="grid grid-cols-1 gap-6">
        {/* Premium Tier */}
        <div
          className={`border rounded-lg p-6 relative transition-all ${
            suggestedTier === "premium"
              ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
              : "border-border-secondary bg-bg-primary hover:border-border-primary"
          }`}
        >
          {suggestedTier === "premium" && (
            <div className="absolute -top-12 left-4">
              <span className="bg-blue-600 text-white text-xs px-12 py-4 rounded-full">{t("recommended")}</span>
            </div>
          )}

          <div className="mb-4">
            <h3 className="text-xl font-bold text-text-primary">{premiumTier.name}</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold text-text-primary">
                <PremiumPrice interval="monthly" />
              </span>
              <span className="text-text-secondary">{t("perMonth")}</span>
            </div>
            <p className="text-text-secondary text-sm mt-2">{premiumTier.description}</p>
          </div>

          <ul className="space-y-2 mb-6">
            {premiumTier.features.map((feature: string, index: number) => (
              <li key={index} className="flex items-start text-sm text-text-secondary">
                <span className="text-green-500 mr-12 mt-0.5 flex-shrink-0" aria-hidden="true">
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>

          <SubscriptionButton
            variant="secondary"
            onClick={() => handleTierSelection()}
            loading={isLoading}
            className="w-full"
            ariaLabel={t("subscribeAriaLabel", { plan: premiumTier.name })}
          >
            {t("choosePremium")}
          </SubscriptionButton>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-4 border-t border-border-secondary">
        <p className="text-xs text-text-tertiary mb-12">{t("renewNotice")}</p>

        <button onClick={handleClose} className="text-text-secondary hover:text-text-primary text-sm underline">
          {t("notNow")}
        </button>
      </div>
    </div>
  );
}
