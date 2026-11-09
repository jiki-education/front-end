"use client";

import { PremiumPrice } from "@/components/common/PremiumPrice";
import ExclamationCircleIcon from "@/icons/exclamation-circle.svg";
import ShieldIcon from "@/icons/shield.svg";
import { checkoutEventProperties, trackEvent, type CheckoutTrigger } from "@/lib/analytics";
import { PaymentElement, useCheckout } from "@stripe/react-stripe-js/checkout";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import styles from "../PremiumCheckoutModal.module.css";

export function PaymentForm({ trigger, priorError }: { trigger?: CheckoutTrigger; priorError?: string | null }) {
  const t = useTranslations("modals.subscriptionCheckout");
  const tCommon = useTranslations("common");
  // Seed the error banner with a previous attempt's failure (e.g. a declined retry);
  // it clears on the next submit like any other payment error.
  const [message, setMessage] = useState<string | null>(priorError ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const checkoutState = useCheckout();

  // Focus management for form accessibility
  useEffect(() => {
    // Focus the form when it loads
    if (formRef.current) {
      formRef.current.focus();
    }
  }, []);

  // Show loading state
  if (checkoutState.type === "loading") {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingSpinner}></div>
        <div className={styles.loadingText}>{t("connectingToStripe")}</div>
      </div>
    );
  }

  // This is handled before this.
  if (checkoutState.type === "error") {
    return null;
  }

  // At this point, checkoutState.type is guaranteed to be "success" due to early returns
  const { checkout } = checkoutState;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);
    setMessage(null);
    trackEvent("checkout_submitted", checkoutEventProperties(trigger));

    try {
      // Confirm the payment - AddressElement data is automatically included
      const confirmResult = await checkout.confirm();

      if (confirmResult.type === "error") {
        trackEvent("checkout_failed", {
          ...checkoutEventProperties(trigger),
          ...confirmErrorProperties(confirmResult.error)
        });
        setMessage(confirmResult.error.message || t("paymentFailed"));
        setIsLoading(false);
      }
      // If successful, Stripe will redirect automatically
    } catch (error) {
      console.error("Payment error:", error);
      trackEvent("checkout_failed", { ...checkoutEventProperties(trigger), error_code: "exception" });
      setMessage(t("unexpectedError"));
      setIsLoading(false);
    }
  };

  return (
    <form
      ref={formRef}
      tabIndex={-1}
      onSubmit={handleSubmit}
      className={styles.form}
      aria-label={t("paymentInfoAriaLabel")}
    >
      {message && (
        <div className={styles.errorBanner}>
          <ExclamationCircleIcon />
          <div className={styles.errorBannerContent}>
            <div className={styles.errorBannerTitle}>{t("paymentFailedTitle")}</div>
            <div className={styles.errorBannerMessage}>{message}</div>
          </div>
        </div>
      )}

      {/* Payment and Billing Section */}
      <PaymentElement options={{ layout: "tabs", wallets: { link: "never" } }} />

      <button
        type="submit"
        disabled={isLoading || !checkout.canConfirm}
        className={`ui-btn ui-btn-large ui-btn-primary ui-btn-purple ${styles.submitButton}`}
        id="submit-btn"
      >
        {isLoading ? (
          tCommon("processing")
        ) : (
          <>
            {t("pay")} <PremiumPrice />
          </>
        )}
      </button>

      <p className={styles.footerText}>
        <ShieldIcon />
        {t.rich("securedBy", { stripe: (chunks) => <span className={styles.stripeBrand}>{chunks}</span> })}
      </p>
    </form>
  );
}

// Stripe gives a code and decline reason only for a failed payment. Anything
// else (an incomplete form, a network error) arrives with a null code, which is
// recorded as "other".
function confirmErrorProperties(error: { code: string | null; paymentFailed?: { declineCode: string | null } }) {
  const declineCode = error.paymentFailed?.declineCode;
  return {
    error_code: error.code ?? "other",
    ...(declineCode && { decline_code: declineCode })
  };
}
