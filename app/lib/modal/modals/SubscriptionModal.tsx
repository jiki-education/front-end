"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/auth/authStore";
import { hideModal, showModal } from "../store";
import { handleSubscribe } from "@/lib/subscriptions/handlers";
import { PRICING_TIERS } from "@/lib/pricing";
import type { MembershipTier } from "@/lib/pricing";
import SubscriptionButton from "@/components/settings/ui/SubscriptionButton";
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
  onSuccess?: (tier: MembershipTier) => void;
  onCancel?: () => void;
}

export function SubscriptionModal({
  triggerContext = "general",
  suggestedTier,
  headline,
  description,
  featuresContext,
  onSuccess,
  onCancel
}: SubscriptionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const user = useAuthStore((state: any) => state.user);

  const premiumTier = PRICING_TIERS.premium;

  // Default content based on context
  const getDefaultContent = () => {
    switch (triggerContext) {
      case "chat-gate":
        return {
          headline: "Unlock AI Chat Assistant",
          description: "Get instant help with your coding exercises from our AI assistant."
        };
      case "feature-gate":
        return {
          headline: `Unlock ${featuresContext?.feature || "Premium Features"}`,
          description: "Upgrade your plan to access advanced features and enhanced learning experiences."
        };
      case "settings":
        return {
          headline: "Choose Your Plan",
          description: "Select the subscription plan that best fits your learning needs."
        };
      case "general":
      default:
        return {
          headline: "Upgrade Your Plan",
          description: "Choose the plan that fits your learning goals and unlock advanced features."
        };
    }
  };

  const defaultContent = getDefaultContent();
  const finalHeadline = headline || defaultContent.headline;
  const finalDescription = description || defaultContent.description;

  const handleTierSelection = async (tier: "premium") => {
    if (!user) {
      toast.error("Please log in to upgrade your account");
      return;
    }

    setIsLoading(true);
    try {
      await handleSubscribe({
        tier,
        userEmail: user.email,
        setSelectedTier,
        setClientSecret,
        returnPath: window.location.pathname
      });

      // handleSubscribe will set the clientSecret and selectedTier
      // When those are set, we'll transition to the checkout modal
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to start checkout process. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onCancel?.();
    hideModal();
  };

  // When we have both clientSecret and selectedTier, transition to checkout modal
  useEffect(() => {
    if (clientSecret && selectedTier) {
      // Close this modal and show the checkout modal
      hideModal();

      // Small delay to ensure modal transition is smooth
      setTimeout(() => {
        showModal("subscription-checkout-modal", {
          clientSecret,
          selectedTier,
          onCancel: () => {
            // When checkout is cancelled, we can optionally show success or just close
            onCancel?.();
          },
          onSuccess: () => {
            // When checkout succeeds, show the success modal
            onSuccess?.(selectedTier);
          }
        });
      }, 100);
    }
  }, [clientSecret, selectedTier, onCancel, onSuccess]);

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
          <h3 className="font-medium text-text-primary mb-3">
            What you&apos;ll unlock with {featuresContext.feature}:
          </h3>
          <ul className="space-y-2">
            {featuresContext.benefits.map((benefit, index) => (
              <li key={index} className="flex items-center text-sm text-text-secondary">
                <span className="text-green-500 mr-3 flex-shrink-0" aria-hidden="true">
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
            <div className="absolute -top-3 left-4">
              <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">Recommended</span>
            </div>
          )}

          <div className="mb-4">
            <h3 className="text-xl font-bold text-text-primary">{premiumTier.name}</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold text-text-primary">${premiumTier.price}</span>
              <span className="text-text-secondary">/month</span>
            </div>
            <p className="text-text-secondary text-sm mt-2">{premiumTier.description}</p>
          </div>

          <ul className="space-y-2 mb-6">
            {premiumTier.features.map((feature: string, index: number) => (
              <li key={index} className="flex items-start text-sm text-text-secondary">
                <span className="text-green-500 mr-3 mt-0.5 flex-shrink-0" aria-hidden="true">
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>

          <SubscriptionButton
            variant="secondary"
            onClick={() => handleTierSelection("premium")}
            loading={isLoading}
            className="w-full"
            ariaLabel={`Subscribe to ${premiumTier.name} plan for $${premiumTier.price} per month`}
          >
            Choose Premium
          </SubscriptionButton>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-4 border-t border-border-secondary">
        <p className="text-xs text-text-tertiary mb-3">
          Your subscription will renew automatically each month. You can cancel anytime from your settings.
        </p>

        <button onClick={handleClose} className="text-text-secondary hover:text-text-primary text-sm underline">
          Not now, maybe later
        </button>
      </div>
    </div>
  );
}
