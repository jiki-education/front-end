"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { hideModal } from "../store";
import type { MembershipTier } from "@/lib/pricing";
import { PremiumPrice } from "@/components/common/PremiumPrice";
import styles from "./SubscriptionSuccessModal.module.css";

interface SubscriptionSuccessModalProps {
  tier: MembershipTier;
  triggerContext?: string;
  nextSteps?: {
    title: string;
    description: string;
    action?: () => void;
    buttonText?: string;
  };
  onClose?: () => void;
}

export function SubscriptionSuccessModal({ tier, triggerContext, nextSteps, onClose }: SubscriptionSuccessModalProps) {
  const t = useTranslations("modals.subscriptionSuccess");
  const format = useFormatter();
  const tCommon = useTranslations("common");
  const tTiers = useTranslations("subscription.tiers");
  const tPremium = useTranslations("subscription.tiers.premium");
  const tierName = tTiers(`${tier}.name`);
  // Highlight the three most relevant Premium benefits on the success screen.
  const premiumHighlights = [
    tPremium("features.unlimitedAi"),
    tPremium("features.allExercises"),
    tPremium("features.certificates")
  ];

  // Calculate the renewal date once at render time to avoid calling Date.now() during render.
  // Format in the active locale via next-intl's formatter (short month/day/year), matching the
  // billing-date formatting in components/settings/subscription/useSubscription.ts.
  const [renewalDate] = useState(() =>
    format.dateTime(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  );

  const getContextualContent = () => {
    switch (triggerContext) {
      case "chat-gate":
        return {
          title: t("chatGate.title"),
          description: t("chatGate.description"),
          features: [t("chatGate.feature1"), t("chatGate.feature2"), t("chatGate.feature3")]
        };
      case "feature-gate":
        return {
          title: t("featureGate.title"),
          description: t("featureGate.description"),
          features: premiumHighlights
        };
      case "settings":
        return {
          title: t("settings.title", { tier: tierName }),
          description: t("settings.description"),
          features: premiumHighlights
        };
      case "general":
      case undefined:
      default:
        return {
          title: t("general.title", { tier: tierName }),
          description: t("general.description"),
          features: premiumHighlights
        };
    }
  };

  const content = getContextualContent();

  const handleClose = () => {
    onClose?.();
    hideModal();
  };

  const handleNextSteps = () => {
    if (nextSteps?.action) {
      nextSteps.action();
    }
    handleClose();
  };

  return (
    <div className={styles.root}>
      {/* Success Icon */}
      <div className={styles.iconWrapper}>
        <div className={styles.iconCircle}>
          <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Header */}
      <div>
        <h2 className={styles.title}>{content.title}</h2>
        <p className={styles.description}>{content.description}</p>
      </div>

      {/* Subscription Details */}
      <div className={styles.detailsCard}>
        <div className={styles.detailsHeader}>
          <span className={styles.planLabel}>{t("planLabel", { tier: tierName })}</span>
          <span className={styles.planPrice}>
            <PremiumPrice interval="monthly" />
            <span className={styles.planPricePeriod}>{tCommon("perMonth")}</span>
          </span>
        </div>

        {content.features.length > 0 && (
          <div>
            <h4 className={styles.featuresTitle}>{t("whatYouCanDo")}</h4>
            <ul className={styles.featureList}>
              {content.features.map((feature, index) => (
                <li key={index} className={styles.featureItem}>
                  <span className={styles.check} aria-hidden="true">
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Next Steps */}
      {nextSteps && (
        <div className={styles.nextSteps}>
          <h3 className={styles.nextStepsTitle}>{nextSteps.title}</h3>
          <p className={styles.nextStepsDescription}>{nextSteps.description}</p>
          <button onClick={handleNextSteps} className={styles.nextStepsButton}>
            {nextSteps.buttonText || t("getStarted")}
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className={styles.actions}>
        {!nextSteps && (
          <button onClick={handleClose} className={styles.continueButton}>
            {t("continueLearning")}
          </button>
        )}

        <button onClick={handleClose} className={styles.secondaryButton}>
          {nextSteps ? t("skipForNow") : tCommon("close")}
        </button>
      </div>

      {/* Footer Info */}
      <div className={styles.footer}>
        <p className={styles.footerText}>{t("renewalNotice", { date: renewalDate })}</p>
      </div>
    </div>
  );
}
