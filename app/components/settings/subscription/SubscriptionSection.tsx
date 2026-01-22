import { lazy, Suspense } from "react";
import type { MembershipTier } from "@/lib/pricing";
import SettingsCard from "../ui/SettingsCard";
import SubscriptionStatus from "../ui/SubscriptionStatus";
import SubscriptionStateSwitch from "./SubscriptionStateSwitch";
import PremiumUpsell from "./PremiumUpsell";
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
    subscriptionState,
    currentTier,
    subscriptionStatus,
    subscriptionData,
    nextBillingDate,
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
    <>
      {/* Current Plan - rendered outside of SettingsCard */}
      <SubscriptionStatus 
        tier={currentTier} 
        status={subscriptionStatus}
        nextBillingDate={nextBillingDate}
        className={className}
      />

      {/* Premium Upsell - shown only for free users */}
      {currentTier === "standard" && (
        <PremiumUpsell 
          onUpgrade={handleUpgradeToPremium}
          className="mt-4"
        />
      )}

      {/* Subscription Management - will be rendered in another section below */}
      <SettingsCard
        title="Subscription Management"
        description="Manage your subscription and billing"
        className="mt-4"
      >
        <SubscriptionStateSwitch
          subscriptionState={subscriptionState!}
          subscriptionData={subscriptionData!}
          isLoading={isLoading}
          onUpgradeToPremium={handleUpgradeToPremium}
          onUpgradeToMax={handleUpgradeToMax}
          onDowngradeToPremium={handleDowngradeToPremium}
          onUpdatePayment={handleUpdatePayment}
          onCancel={handleCancel}
          onReactivate={handleReactivate}
          onRetryPayment={handleRetryPayment}
          onResubscribeToPremium={handleResubscribeToPremium}
          onResubscribeToMax={handleResubscribeToMax}
          onCompletePayment={handleCompletePayment}
          onTryPremiumAgain={handleTryPremiumAgain}
          onTryMaxAgain={handleTryMaxAgain}
        />
      </SettingsCard>

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
    </>
  );
}