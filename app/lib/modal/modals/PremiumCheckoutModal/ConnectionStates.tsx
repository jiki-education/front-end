"use client";

import ExclamationCircleIcon from "@/icons/exclamation-circle.svg";
import { useTranslations } from "next-intl";
import styles from "../PremiumCheckoutModal.module.css";

// Shown while Stripe.js and the checkout session load
export function ConnectingToStripe() {
  const t = useTranslations("modals.subscriptionCheckout");

  return (
    <div className={styles.loadingWrapper}>
      <div className={styles.loadingSpinner}></div>
      <div className={styles.loadingText}>{t("connectingToStripe")}</div>
    </div>
  );
}

// Shown when the payment form failed to load or took too long
export function ConnectionFailed({ onRetry }: { onRetry: () => void }) {
  const t = useTranslations("modals.subscriptionCheckout");
  const tCommon = useTranslations("common");

  return (
    <div className={styles.connectionFailed} role="alert">
      <ExclamationCircleIcon className={styles.connectionFailedIcon} />
      <div className={styles.connectionFailedTitle}>{t("connectionFailedTitle")}</div>
      <p className={styles.connectionFailedMessage}>{t("connectionFailedMessage")}</p>
      <button
        type="button"
        onClick={onRetry}
        className={`ui-btn ui-btn-large ui-btn-primary ui-btn-purple ${styles.connectionRetryButton}`}
      >
        {tCommon("retry")}
      </button>
    </div>
  );
}
