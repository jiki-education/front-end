import { useTranslations } from "next-intl";
import type { User } from "@/types/auth";
import { getMembershipKind } from "../subscription/membership";
import { useSubscriptionPrice } from "../subscription/useSubscriptionPrice";
import styles from "../Settings.module.css";
import statusStyles from "./SubscriptionStatus.module.css";

interface SubscriptionStatusProps {
  user: User;
  nextBillingDate: string | null;
  className?: string;
}

export default function SubscriptionStatus({ user, nextBillingDate, className = "" }: SubscriptionStatusProps) {
  const t = useTranslations("settings.subscriptionStatus");
  const kind = getMembershipKind(user);
  const plan = (chunks: React.ReactNode) => <span className={styles.gradientText}>{chunks}</span>;
  const strong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;

  if (kind === "lifetime") {
    return (
      <div className={`${styles.settingItem} ${styles.currentPlanItem} ${className}`}>
        <h3>{t("lifetimeHeading")}</h3>
        <p>{t.rich("lifetime", { plan })}</p>
      </div>
    );
  }

  if (kind === "premium") {
    return (
      <div className={`${styles.settingItem} ${styles.currentPlanItem} ${className}`}>
        <h3>{t("currentPlan")}</h3>
        <p>{t.rich("premiumIncluded", { plan })}</p>
      </div>
    );
  }

  if (kind === "free") {
    return (
      <div className={`${styles.settingItem} ${className}`}>
        <h3>{t("currentPlan")}</h3>
        <p className={statusStyles.freeText}>{t.rich("free", { strong })}</p>
      </div>
    );
  }

  return <LegacySubscriptionStatus user={user} nextBillingDate={nextBillingDate} className={className} />;
}

// A member who subscribed before Premium became a one-off purchase.
function LegacySubscriptionStatus({ user, nextBillingDate, className = "" }: SubscriptionStatusProps) {
  const t = useTranslations("settings.subscriptionStatus");
  const tTiers = useTranslations("subscription.tiers");
  const price = useSubscriptionPrice(user.subscription);
  const tierName = tTiers(`${user.membership_type}.name`);
  const status = user.subscription_status;
  const plan = (chunks: React.ReactNode) => <span className={styles.gradientText}>{chunks}</span>;
  const strong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;

  if (user.membership_type === "premium" && status === "active") {
    return (
      <div className={`${styles.settingItem} ${styles.currentPlanItem} ${className}`}>
        <div className={statusStyles.planRow}>
          <h3>{t("currentPlan")}</h3>
        </div>
        <p>
          {price
            ? t.rich("subscribedWithPrice", { tier: tierName, price, plan, strong })
            : t.rich("subscribed", { tier: tierName, plan })}
          {nextBillingDate && <> {t.rich("nextBillingDate", { date: nextBillingDate, strong })}</>}
        </p>
      </div>
    );
  }

  if (status === "cancelling") {
    const daysRemaining = calculateDaysRemaining(nextBillingDate);

    return (
      <div className={`${styles.settingItem} ${styles.currentPlanItemCancelled} ${className}`}>
        <h3>{t("currentPlan")}</h3>
        <p>
          {t("cancellingMessage")}
          {daysRemaining !== null && <> {t.rich("cancellingRemaining", { count: daysRemaining, strong })}</>}
          {nextBillingDate && <> {t.rich("cancellingEnds", { date: nextBillingDate, strong })}</>}
        </p>
      </div>
    );
  }

  // A live subscription that isn't healthy: payment failed or setup incomplete.
  const statusText = {
    active: t("statusActive"),
    canceled: t("statusCanceled"),
    payment_failed: t("statusPaymentFailed"),
    cancelling: t("statusCancelling"),
    incomplete: t("statusIncomplete"),
    incomplete_expired: t("statusSessionExpired"),
    never_subscribed: t("statusNotSubscribed")
  }[status];

  return (
    <div
      className={`${statusStyles.statusCard} ${className}`}
      role="region"
      aria-label={t("statusAriaLabel", { status: statusText })}
    >
      <div className={statusStyles.statusHeader}>
        <div className={statusStyles.badgeGroup}>
          <div
            className={statusStyles.planBadge}
            role="status"
            aria-label={t("currentPlanAriaLabel", { plan: tierName })}
          >
            {t("planLabel", { tier: tierName })}
          </div>
          <div
            className={statusStyles.statusBadge}
            data-status={status}
            role="status"
            aria-label={t("statusAriaLabel", { status: statusText })}
          >
            {statusText}
          </div>
        </div>
      </div>

      <div className={statusStyles.statusDetails}>
        {price && <p>{price}</p>}

        {status === "payment_failed" && <p className={statusStyles.statusMessageError}>{t("messagePaymentFailed")}</p>}
        {status === "incomplete" && <p className={statusStyles.statusMessageWarning}>{t("messageIncomplete")}</p>}
      </div>
    </div>
  );
}

function calculateDaysRemaining(dateString: string | null): number | null {
  if (!dateString) {
    return null;
  }

  const endDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
}
