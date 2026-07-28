import type { MembershipTier } from "@/lib/pricing";
import { PremiumPrice } from "@/components/common/PremiumPrice";
import { useTranslations } from "next-intl";
import type { SubscriptionStatus as SubscriptionStatusType } from "../subscription/types";
import styles from "../Settings.module.css";
import statusStyles from "./SubscriptionStatus.module.css";

interface SubscriptionStatusProps {
  tier: MembershipTier;
  status: SubscriptionStatusType;
  nextBillingDate: string | null;
  className?: string;
}

export default function SubscriptionStatus({ tier, status, nextBillingDate, className = "" }: SubscriptionStatusProps) {
  const t = useTranslations("settings.subscriptionStatus");
  const tCommon = useTranslations("common");
  const tTiers = useTranslations("subscription.tiers");
  const tierName = tTiers(`${tier}.name`);
  const isActiveSubscription = tier !== "standard" && status === "active";
  const isCancelling = tier !== "standard" && status === "cancelling";

  // Status badge text (colors are driven by [data-status] in the CSS module)
  const statusText = {
    active: t("statusActive"),
    canceled: t("statusCanceled"),
    payment_failed: t("statusPaymentFailed"),
    cancelling: t("statusCancelling"),
    incomplete: t("statusIncomplete"),
    incomplete_expired: t("statusSessionExpired"),
    never_subscribed: t("statusNotSubscribed")
  };

  const statusInfo = { text: statusText[status] };

  // Show Current Plan section for all users
  if (isActiveSubscription) {
    // Active paid subscription
    return (
      <div className={`${styles.settingItem} ${styles.currentPlanItem} ${className}`}>
        <div className={statusStyles.planRow}>
          <h3>{t("currentPlan")}</h3>
        </div>
        <p>
          {t.rich(nextBillingDate ? "activeWithBilling" : "active", {
            tier: tierName,
            date: nextBillingDate ?? "",
            plan: (chunks) => <span className={styles.gradientText}>{chunks}</span>,
            strong: (chunks) => <strong>{chunks}</strong>,
            price: () => <PremiumPrice interval="monthly" />
          })}
        </p>
      </div>
    );
  }

  // Cancelling subscription
  if (isCancelling) {
    const daysRemaining = calculateDaysRemaining(nextBillingDate);

    return (
      <div className={`${styles.settingItem} ${styles.currentPlanItemCancelled} ${className}`}>
        <h3>{t("currentPlan")}</h3>
        <p>
          {t("cancellingMessage")}
          {daysRemaining !== null && (
            <>
              {" "}
              {t.rich("cancellingRemaining", {
                count: daysRemaining,
                strong: (chunks) => <strong>{chunks}</strong>
              })}
            </>
          )}
          {nextBillingDate && (
            <>
              {" "}
              {t.rich("cancellingEnds", {
                date: nextBillingDate,
                strong: (chunks) => <strong>{chunks}</strong>
              })}
            </>
          )}
        </p>
      </div>
    );
  }

  // Free plan (not subscribed)
  if (tier === "standard" || status === "never_subscribed") {
    return (
      <div className={`${styles.settingItem} ${className}`}>
        <h3>{t("currentPlan")}</h3>
        <p style={{ marginBottom: 0 }}>{t.rich("free", { strong: (chunks) => <strong>{chunks}</strong> })}</p>
      </div>
    );
  }

  // Show simple status for inactive/expired Premium subscriptions
  // At this point, tier must be "premium" with an inactive status
  return (
    <div
      className={`${statusStyles.statusCard} ${className}`}
      role="region"
      aria-label={t("statusAriaLabel", { status: statusInfo.text })}
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
            aria-label={t("statusAriaLabel", { status: statusInfo.text })}
          >
            {statusInfo.text}
          </div>
        </div>
      </div>

      <div className={statusStyles.statusDetails}>
        <p>
          <PremiumPrice interval="monthly" />
          {tCommon("perMonth")}
        </p>

        {/* Status-specific messages */}
        {status === "canceled" && <p className={statusStyles.statusMessage}>{t("messageCanceled")}</p>}
        {status === "payment_failed" && <p className={statusStyles.statusMessageError}>{t("messagePaymentFailed")}</p>}
        {status === "cancelling" && <p className={statusStyles.statusMessage}>{t("messageCancelling")}</p>}
        {status === "incomplete" && <p className={statusStyles.statusMessageWarning}>{t("messageIncomplete")}</p>}
        {status === "incomplete_expired" && (
          <p className={statusStyles.statusMessageError}>{t("messageIncompleteExpired")}</p>
        )}
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
