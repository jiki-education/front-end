import SettingsCard from "../ui/SettingsCard";
import SubscriptionStatus from "../ui/SubscriptionStatus";
import PremiumUpsell from "./PremiumUpsell";
import BenefitSection from "./BenefitSection";
import { CancelSection } from "./CancelSection";
import PaymentHistory from "../payment-history";
import { useSubscription } from "./useSubscription";
import type { User } from "./types";
import { assembleClassNames } from "@/lib/assemble-classnames";

interface SubscriptionSectionProps {
  user: User | null;
  refreshUser: () => Promise<void>;
  className?: string;
}

export default function SubscriptionSection({ user, refreshUser, className = "" }: SubscriptionSectionProps) {
  const { isLoading, currentTier, subscriptionStatus, nextBillingDate, handleUpgradeToPremium, handleCancel } =
    useSubscription({
      user,
      refreshUser
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
    <div style={{ maxWidth: "774px" }} className={assembleClassNames(className, "space-y-[16px]")}>
      {/* Current Plan - rendered outside of SettingsCard */}
      <SubscriptionStatus tier={currentTier} status={subscriptionStatus} nextBillingDate={nextBillingDate} />

      {/* Premium Upsell for free users or Benefit Section for premium users */}
      {currentTier === "standard" ? (
        <PremiumUpsell onUpgrade={handleUpgradeToPremium} isLoading={isLoading} />
      ) : (
        <BenefitSection />
      )}

      {/* Payment History - always shown, will handle its own empty state */}
      <PaymentHistory />

      {/* Cancel Section - only show for premium users */}
      {currentTier !== "standard" && <CancelSection onCancelClick={handleCancel} />}

      {/* Checkout Modal is handled by the global modal system */}
    </div>
  );
}
