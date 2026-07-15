import type { MembershipTier } from "@/lib/pricing";
import { PRICING_TIERS } from "@/lib/pricing";
import { PremiumPrice } from "@/components/common/PremiumPrice";
import { useTranslations } from "next-intl";
import type { SubscriptionStatus as SubscriptionStatusType } from "../subscription/types";
import styles from "../Settings.module.css";

interface SubscriptionStatusProps {
  tier: MembershipTier;
  status: SubscriptionStatusType;
  nextBillingDate: string | null;
  className?: string;
}

export default function SubscriptionStatus({ tier, status, nextBillingDate, className = "" }: SubscriptionStatusProps) {
  const t = useTranslations("settings.subscriptionStatus");
  const tCommon = useTranslations("common");
  const tierDetails = PRICING_TIERS[tier];
  const isActiveSubscription = tier !== "standard" && status === "active";
  const isCancelling = tier !== "standard" && status === "cancelling";

  // Status badge configuration
  const statusConfig = {
    active: {
      text: t("statusActive"),
      color: "text-green-700",
      bgColor: "bg-green-50"
    },
    canceled: {
      text: t("statusCanceled"),
      color: "text-orange-700",
      bgColor: "bg-orange-50"
    },
    payment_failed: {
      text: t("statusPaymentFailed"),
      color: "text-red-700",
      bgColor: "bg-red-50"
    },
    cancelling: {
      text: t("statusCancelling"),
      color: "text-orange-700",
      bgColor: "bg-orange-50"
    },
    incomplete: {
      text: t("statusIncomplete"),
      color: "text-yellow-700",
      bgColor: "bg-yellow-50"
    },
    incomplete_expired: {
      text: t("statusSessionExpired"),
      color: "text-red-700",
      bgColor: "bg-red-50"
    },
    never_subscribed: {
      text: t("statusNotSubscribed"),
      color: "text-gray-700",
      bgColor: "bg-gray-50"
    }
  };

  const statusInfo = statusConfig[status];

  // Show Current Plan section for all users
  if (isActiveSubscription) {
    // Active paid subscription
    return (
      <div className={`${styles.settingItem} ${styles.currentPlanItem} ${className}`}>
        <div className="flex items-center justify-between">
          <h3>{t("currentPlan")}</h3>
        </div>
        <p>
          {t("activePrefix")}
          <span className={styles.gradientText}>{t("activePlanName", { tier: tierDetails.name })}</span>
          {t("activeMiddle")}
          <strong>
            <PremiumPrice interval="monthly" />
            {tCommon("perMonth")}
          </strong>
          {nextBillingDate && (
            <>
              {t("activeNextBillingPrefix")}
              <strong>{nextBillingDate}</strong>
            </>
          )}
          .
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
              {t("cancellingRemainingPrefix")}
              <strong>
                {daysRemaining} {daysRemaining === 1 ? t("cancellingDay") : t("cancellingDays")}
              </strong>
              {t("cancellingRemainingSuffix")}
            </>
          )}
          {nextBillingDate && (
            <>
              {t("cancellingEndsPrefix")}
              <strong>{nextBillingDate}</strong>.
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
        <p style={{ marginBottom: 0 }}>
          {t("freePrefix")}
          <strong>{t("freePlanName")}</strong>
          {t("freeSuffix")}
        </p>
      </div>
    );
  }

  // Show simple status for inactive/expired Premium subscriptions
  // At this point, tier must be "premium" with an inactive status
  return (
    <div
      className={`p-4 bg-bg-primary rounded border border-border-secondary ${className}`}
      role="region"
      aria-label={t("statusAriaLabel", { status: statusInfo.text })}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-12">
          <div
            className="px-12 py-4 rounded-full text-sm font-medium bg-blue-50 text-blue-700"
            role="status"
            aria-label={t("currentPlanAriaLabel", { plan: tierDetails.name })}
          >
            {tierDetails.name}
            {t("planSuffix")}
          </div>
          <div
            className={`px-2 py-4 rounded text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}
            role="status"
            aria-label={t("statusAriaLabel", { status: statusInfo.text })}
          >
            {statusInfo.text}
          </div>
        </div>
      </div>

      <div className="text-text-secondary text-sm">
        <p>
          <PremiumPrice interval="monthly" />
          {tCommon("perMonth")}
        </p>

        {/* Status-specific messages */}
        {status === "canceled" && <p className="mt-4">{t("messageCanceled")}</p>}
        {status === "payment_failed" && <p className="mt-4 text-red-600">{t("messagePaymentFailed")}</p>}
        {status === "cancelling" && <p className="mt-4">{t("messageCancelling")}</p>}
        {status === "incomplete" && <p className="mt-4 text-yellow-600">{t("messageIncomplete")}</p>}
        {status === "incomplete_expired" && <p className="mt-4 text-red-600">{t("messageIncompleteExpired")}</p>}
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
