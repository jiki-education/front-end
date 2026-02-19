"use client";

import { useState } from "react";
import { hideModal } from "../store";
import { PRICING_TIERS } from "@/lib/pricing";
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
  const tierInfo = PRICING_TIERS[tier];

  // Calculate renewal date once at render time to avoid calling Date.now() during render
  const [renewalDate] = useState(() => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString());

  const getContextualContent = () => {
    switch (triggerContext) {
      case "chat-gate":
        return {
          title: "Welcome to AI Chat!",
          description: "Your AI assistant is now unlocked and ready to help with your coding exercises.",
          features: [
            "Ask questions about your code",
            "Get explanations for complex concepts",
            "Receive personalized hints and guidance"
          ]
        };
      case "feature-gate":
        return {
          title: "Feature Unlocked!",
          description: "You now have access to premium features that will enhance your learning experience.",
          features: tierInfo.features.slice(1, 4) // Show subset of relevant features
        };
      case "settings":
        return {
          title: `Welcome to ${tierInfo.name}!`,
          description: "Your subscription has been activated. Explore your new features in the settings.",
          features: tierInfo.features.slice(1, 4) // Show subset of key features
        };
      case "general":
      case undefined:
      default:
        return {
          title: `Welcome to ${tierInfo.name}!`,
          description: "Thank you for upgrading your plan. You now have access to all premium features.",
          features: tierInfo.features.slice(1, 4) // Show subset of key features
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
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium text-text-primary">{tierInfo.name} Plan</span>
          <span className="text-2xl font-bold text-text-primary">
            <PremiumPrice interval="monthly" />
            <span className="text-sm font-normal text-text-secondary">/month</span>
          </span>
        </div>

        {content.features.length > 0 && (
          <div>
            <h4 className="font-medium text-text-primary mb-2 text-sm">What you can do now:</h4>
            <ul className="space-y-1 text-left">
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
          <p className="text-blue-800 text-sm mb-3">{nextSteps.description}</p>
          <button
            onClick={handleNextSteps}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {nextSteps.buttonText || "Get Started"}
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {!nextSteps && (
          <button
            onClick={handleClose}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Continue Learning
          </button>
        )}

        <button onClick={handleClose} className="text-text-secondary hover:text-text-primary text-sm underline">
          {nextSteps ? "Skip for now" : "Close"}
        </button>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-border-secondary">
        <p className="text-xs text-text-tertiary">
          Your subscription will renew automatically on {renewalDate}. Manage your subscription in Settings.
        </p>
      </div>
    </div>
  );
}
