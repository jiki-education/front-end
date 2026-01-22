import { lazy, Suspense } from "react";
import type { MembershipTier } from "@/lib/pricing";
import SettingsCard from "../ui/SettingsCard";
import SubscriptionStatus from "../ui/SubscriptionStatus";
import PremiumUpsell from "./PremiumUpsell";
import PaymentHistory from "../payment-history";
import { useSubscription } from "./useSubscription";
import type { User } from "./types";

// Lazy load CheckoutModal since it's only shown when needed
const CheckoutModal = lazy(() => import("./CheckoutModal"));

interface SubscriptionSectionProps {
  user: User | null;
  refreshUser: () => Promise<void>;
  selectedTier: MembershipTier | null;
  setSelectedTier: (tier: MembershipTier | null) => void;
  clientSecret: string | null;
  setClientSecret: (secret: string | null) => void;
  className?: string;
}

export default function SubscriptionSection({
  user,
  refreshUser,
  selectedTier,
  setSelectedTier,
  clientSecret,
  setClientSecret,
  className = ""
}: SubscriptionSectionProps) {
  const {
    isLoading,
    currentTier,
    subscriptionStatus,
    nextBillingDate,
    handleUpgradeToPremium,
    handleCheckoutCancel
  } = useSubscription({
    user,
    refreshUser,
    selectedTier,
    setSelectedTier,
    clientSecret,
    setClientSecret
  });

  // If no user, show loading state
  if (!user) {
    return (
      <SettingsCard
        title="Subscription"
        description="Manage your subscription plan and billing details"
        className={className}
      >
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-link-primary"></div>
          <span className="ml-3 text-text-secondary">Loading subscription data...</span>
        </div>
      </SettingsCard>
    );
  }

  return (
    <div style={{ maxWidth: "774px" }} className={className}>
      {/* Current Plan - rendered outside of SettingsCard */}
      <SubscriptionStatus
        tier={currentTier}
        status={subscriptionStatus}
        nextBillingDate={nextBillingDate}
      />

      {/* Premium Upsell - shown only for free users */}
      {currentTier === "standard" && (
        <PremiumUpsell
          onUpgrade={handleUpgradeToPremium}
          isLoading={isLoading}
        />
      )}

      {/* Subscription Management - will be rendered in another section below */}

      {/* Payment History - shown for users with subscription history */}
      {/* {(currentTier !== "standard" || subscriptionStatus !== "never_subscribed") && ( */}
      <PaymentHistory />
      {/* )} */}

      {/* Checkout Modal */}
      {clientSecret && selectedTier && (
        <Suspense
          fallback={
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-modal-backdrop">
              <div className="bg-white p-6 rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-center">Loading checkout...</p>
              </div>
            </div>
          }
        >
          <CheckoutModal clientSecret={clientSecret} selectedTier={selectedTier} onCancel={handleCheckoutCancel} />
        </Suspense>
      )}
    </div>
  );
}