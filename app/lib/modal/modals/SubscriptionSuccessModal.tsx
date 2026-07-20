"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { hideModal } from "../store";
import type { MembershipTier } from "@/lib/pricing";
import { PremiumPrice } from "@/components/common/PremiumPrice";

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

  // Calculate renewal date once at render time to avoid calling Date.now() during render
  const [renewalDate] = useState(() => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString());

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
    <div className="text-center space-y-6 max-w-md">
      {/* Success Icon */}
      <div className="mx-auto">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">{content.title}</h2>
        <p className="text-text-secondary">{content.description}</p>
      </div>

      {/* Subscription Details */}
      <div className="bg-bg-secondary p-4 rounded-lg border border-border-secondary">
        <div className="flex items-center justify-between mb-12">
          <span className="font-medium text-text-primary">{t("planLabel", { tier: tierName })}</span>
          <span className="text-2xl font-bold text-text-primary">
            <PremiumPrice interval="monthly" />
            <span className="text-sm font-normal text-text-secondary">{tCommon("perMonth")}</span>
          </span>
        </div>

        {content.features.length > 0 && (
          <div>
            <h4 className="font-medium text-text-primary mb-2 text-sm">{t("whatYouCanDo")}</h4>
            <ul className="space-y-4 text-left">
              {content.features.map((feature, index) => (
                <li key={index} className="flex items-start text-sm text-text-secondary">
                  <span className="text-green-500 mr-2 mt-0.5 flex-shrink-0" aria-hidden="true">
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
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">{nextSteps.title}</h3>
          <p className="text-blue-800 text-sm mb-12">{nextSteps.description}</p>
          <button
            onClick={handleNextSteps}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {nextSteps.buttonText || t("getStarted")}
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-12">
        {!nextSteps && (
          <button
            onClick={handleClose}
            className="w-full px-6 py-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {t("continueLearning")}
          </button>
        )}

        <button onClick={handleClose} className="text-text-secondary hover:text-text-primary text-sm underline">
          {nextSteps ? t("skipForNow") : tCommon("close")}
        </button>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-border-secondary">
        <p className="text-xs text-text-tertiary">{t("renewalNotice", { date: renewalDate })}</p>
      </div>
    </div>
  );
}
