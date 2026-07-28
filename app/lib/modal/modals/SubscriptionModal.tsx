"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/auth/authStore";
import { hideModal } from "../store";
import { handleSubscribe } from "@/lib/subscriptions/handlers";
import { PremiumPrice } from "@/components/common/PremiumPrice";
import SubscriptionButton from "@/components/settings/ui/SubscriptionButton";
import { useTranslations } from "next-intl";
import { toastError } from "@/lib/toast";
import styles from "./SubscriptionModal.module.css";

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
  const tCommon = useTranslations("common");
  const tPremium = useTranslations("subscription.tiers.premium");
  const [isLoading, setIsLoading] = useState(false);
  const user = useAuthStore((state: any) => state.user);

  const premiumName = tPremium("name");
  const premiumDescription = tPremium("description");
  const premiumFeatures = [
    tPremium("features.allFreeFeatures"),
    tPremium("features.unlimitedAi"),
    tPremium("features.allExercises"),
    tPremium("features.certificates"),
    tPremium("features.adFree")
  ];

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
      toastError("subscription.loginRequired");
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
      toastError("subscription.checkoutFailed");
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
    <div className={styles.root}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.headline}>{finalHeadline}</h2>
        <p className={styles.description}>{finalDescription}</p>
      </div>

      {/* Feature Context Benefits */}
      {featuresContext && (
        <div className={styles.featureContext}>
          <h3 className={styles.featureContextTitle}>{t("unlockWith", { feature: featuresContext.feature })}</h3>
          <ul className={styles.featureList}>
            {featuresContext.benefits.map((benefit, index) => (
              <li key={index} className={styles.featureItem}>
                <span className={styles.check} aria-hidden="true">
                  ✓
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tier Selection */}
      <div className={styles.tierGrid}>
        {/* Premium Tier */}
        <div className={styles.tierCard} data-suggested={suggestedTier === "premium"}>
          {suggestedTier === "premium" && (
            <div className={styles.recommendedBadge}>
              <span className={styles.recommendedBadgeLabel}>{t("recommended")}</span>
            </div>
          )}

          <div className={styles.tierHeader}>
            <h3 className={styles.tierName}>{premiumName}</h3>
            <div className={styles.tierPrice}>
              <span className={styles.tierPriceAmount}>
                <PremiumPrice interval="monthly" />
              </span>
              <span className={styles.tierPricePeriod}>{tCommon("perMonth")}</span>
            </div>
            <p className={styles.tierDescription}>{premiumDescription}</p>
          </div>

          <ul className={styles.tierFeatureList}>
            {premiumFeatures.map((feature, index) => (
              <li key={index} className={styles.tierFeatureItem}>
                <span className={styles.checkStart} aria-hidden="true">
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
            className={styles.fullWidth}
            ariaLabel={t("subscribeAriaLabel", { plan: premiumName })}
          >
            {t("choosePremium")}
          </SubscriptionButton>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <p className={styles.renewNotice}>{t("renewNotice")}</p>

        <button onClick={handleClose} className={styles.notNow}>
          {t("notNow")}
        </button>
      </div>
    </div>
  );
}
