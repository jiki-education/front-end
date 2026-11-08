import SettingsCard from "../ui/SettingsCard";
import SubscriptionStatus from "../ui/SubscriptionStatus";
import PremiumUpsell from "./PremiumUpsell";
import PurchasePending from "./PurchasePending";
import BenefitSection from "./BenefitSection";
import { CancelSection } from "./CancelSection";
import PaymentHistory from "../payment-history";
import { useSubscription } from "./useSubscription";
import { getMembershipKind } from "./membership";
import type { User } from "./types";
import { assembleClassNames } from "@/lib/assemble-classnames";
import { useTranslations } from "next-intl";
import styles from "./SubscriptionSection.module.css";

interface SubscriptionSectionProps {
  user: User | null;
  refreshUser: () => Promise<void>;
  className?: string;
}

export default function SubscriptionSection({ user, refreshUser, className = "" }: SubscriptionSectionProps) {
  const t = useTranslations("settings.subscriptionSection");
  const { isLoading, nextBillingDate, handlePurchasePremium, handleCancel, handleReactivate } = useSubscription({
    user,
    refreshUser
  });

  // If no user, show loading state
  if (!user) {
    return (
      <SettingsCard title={t("loadingCardTitle")} description={t("loadingCardDescription")} className={className}>
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner}></div>
          <span className={styles.loadingText}>{t("loadingData")}</span>
        </div>
      </SettingsCard>
    );
  }

  const kind = getMembershipKind(user);
  const isPremium = user.membership_type === "premium";
  const isCancelling = kind === "subscription" && user.subscription_status === "cancelling";

  return (
    <div className={assembleClassNames(styles.container, className)}>
      {/* Current Plan - rendered outside of SettingsCard */}
      <SubscriptionStatus user={user} nextBillingDate={nextBillingDate} />

      {isPremium ? (
        <BenefitSection isCancelling={isCancelling} subscription={user.subscription} onResubscribe={handleReactivate} />
      ) : (
        <UpgradeOffer user={user} isLoading={isLoading} onUpgrade={handlePurchasePremium} />
      )}

      {/* Payment History - always shown, will handle its own empty state */}
      <PaymentHistory />

      {/* Only a live legacy subscription has anything to cancel */}
      {kind === "subscription" && !isCancelling && <CancelSection onCancelClick={handleCancel} />}
    </div>
  );
}

// What a user without Premium is offered. Nothing while a legacy subscription
// in trouble (e.g. a failed payment) still blocks a purchase.
function UpgradeOffer({
  user,
  isLoading,
  onUpgrade
}: {
  user: User;
  isLoading: boolean;
  onUpgrade: () => Promise<void>;
}) {
  if (user.premium_purchase_pending) {
    return <PurchasePending />;
  }
  if (!user.can_purchase_premium) {
    return null;
  }
  return <PremiumUpsell onUpgrade={onUpgrade} isLoading={isLoading} />;
}
