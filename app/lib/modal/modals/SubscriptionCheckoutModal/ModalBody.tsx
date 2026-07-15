"use client";

import type { MembershipTier } from "@/lib/pricing";
import { PRICING_TIERS } from "@/lib/pricing";
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
  const checkoutState = useCheckout();
  const tierInfo = PRICING_TIERS[selectedTier];

  // Show error state
  if (checkoutState.type === "error") {
    return (
      <div className="bg-bg-primary p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-800">
            {t("errorPrefix")}
            {checkoutState.error.message}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
        >
          {tCommon("close")}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Order Header */}
      <div className={styles.orderHeader}>
        <div>
          <div className={styles.orderTitle}>{t("orderTitle", { tier: tierInfo.name })}</div>
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
