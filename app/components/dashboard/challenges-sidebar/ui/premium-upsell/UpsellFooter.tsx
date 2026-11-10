"use client";

import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/auth/authStore";
import { formatPremiumPrice } from "@/lib/pricing";
import styles from "./UpsellCard.module.css";

// The price line and the upgrade button that end every upsell card. While an
// earlier purchase is still clearing, a note replaces the button.
export function UpsellFooter({ onUpgradeClick }: { onUpgradeClick: () => void }) {
  const t = useTranslations("dashboard.challengesSidebar.premiumUpsell");
  const user = useAuthStore((state) => state.user);
  const isPending = user?.premium_purchase_pending === true;

  if (isPending) {
    return (
      <p className={styles.pendingNote} role="status">
        {t("pendingNote")}
      </p>
    );
  }

  return (
    <>
      {/* Without a signed-in user there is no price to quote, and "Only ." would read as broken. */}
      {user && (
        <p className={styles.priceLine}>
          {t.rich("price", {
            price: () => <span className={styles.price}>{formatPremiumPrice(user.premium_prices)}</span>,
            muted: (chunks) => <span className={styles.muted}>{chunks}</span>
          })}
        </p>
      )}
      <button
        type="button"
        onClick={onUpgradeClick}
        className={`ui-btn ui-btn-default ui-btn-primary ui-btn-purple ${styles.button}`}
      >
        {t("upgrade")}
      </button>
    </>
  );
}
