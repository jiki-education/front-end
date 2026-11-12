"use client";

import type { MembershipTier } from "@/lib/pricing";
import { useTranslations } from "next-intl";
import styles from "../PremiumCheckoutModal.module.css";

// The order header, with the payment form (or its loading or error state) below it
export function ModalBody({ selectedTier, children }: { selectedTier: MembershipTier; children: React.ReactNode }) {
  const t = useTranslations("modals.subscriptionCheckout");
  const tTiers = useTranslations("subscription.tiers");
  const tierName = tTiers(`${selectedTier}.name`);

  return (
    <div className={styles.bodyWrapper}>
      {/* Order Header */}
      <div className={styles.orderHeader}>
        <div>
          <div className={styles.orderTitle}>{t("orderTitle", { tier: tierName })}</div>
          <div className={styles.orderBilling}>{t("orderBilling")}</div>
        </div>
      </div>

      {children}
    </div>
  );
}
