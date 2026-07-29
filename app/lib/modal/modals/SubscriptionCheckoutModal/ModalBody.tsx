"use client";

import type { MembershipTier } from "@/lib/pricing";
import { PremiumPrice } from "@/components/common/PremiumPrice";
import { useCheckout } from "@stripe/react-stripe-js/checkout";
import { useTranslations } from "next-intl";
import { PaymentForm } from "./PaymentForm";
import styles from "../SubscriptionCheckoutModal.module.css";

export function ModalBody({
  selectedTier,
  priorError,
  onCancel
}: {
  selectedTier: MembershipTier;
  priorError?: string | null;
  onCancel: () => void;
}) {
  const t = useTranslations("modals.subscriptionCheckout");
  const tCommon = useTranslations("common");
  const tTiers = useTranslations("subscription.tiers");
  const checkoutState = useCheckout();
  const tierName = tTiers(`${selectedTier}.name`);

  // Show error state
  if (checkoutState.type === "error") {
    return (
      <div className={styles.errorState}>
        <div className={styles.errorBox}>
          <p className={styles.errorText}>{t("error", { message: checkoutState.error.message })}</p>
        </div>
        <button onClick={onCancel} className={styles.errorCloseButton}>
          {tCommon("close")}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.bodyWrapper}>
      {/* Order Header */}
      <div className={styles.orderHeader}>
        <div>
          <div className={styles.orderTitle}>{t("orderTitle", { tier: tierName })}</div>
          <div className={styles.orderBilling}>{t("orderBilling")}</div>
        </div>
        <div className={styles.orderPrice}>
          <span className={styles.amount}>
            <PremiumPrice interval="monthly" />
          </span>
          <span className={styles.period}>{t("perMonthShort")}</span>
        </div>
      </div>

      <PaymentForm priorError={priorError} />
    </div>
  );
}
