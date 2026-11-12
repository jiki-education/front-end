"use client";

import { PremiumPrice } from "@/components/common/PremiumPrice";
import ExclamationCircleIcon from "@/icons/exclamation-circle.svg";
import ShieldIcon from "@/icons/shield.svg";
import { PaymentElement, useCheckout } from "@stripe/react-stripe-js/checkout";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { ConnectingToStripe } from "./ConnectionStates";
import { capMessage, type CheckoutFunnel, type CheckoutLoadErrorSource } from "./useCheckoutFunnel";
import styles from "../PremiumCheckoutModal.module.css";

interface PaymentFormProps {
  funnel: CheckoutFunnel;
  priorError?: string | null;
  onReady: () => void;
  onLoadError: (source: CheckoutLoadErrorSource, message?: string) => void;
}

// A failed confirm shows a banner above the form. A declined payment is an
// error. A payment that didn't complete for any other reason (most often a
// wallet popup such as WeChat Pay or Alipay being closed) gets a calmer notice.
interface Notice {
  tone: "error" | "info";
  title: string;
  message: string;
}

interface ConfirmError {
  message: string;
  code: string | null;
  paymentFailed?: { declineCode: string | null };
}

export function PaymentForm({ funnel, priorError, onReady, onLoadError }: PaymentFormProps) {
  const t = useTranslations("modals.subscriptionCheckout");
  const tCommon = useTranslations("common");
  // Seed the banner with a previous attempt's failure (e.g. a declined retry);
  // it clears on the next submit like any other payment error.
  const [notice, setNotice] = useState<Notice | null>(
    priorError ? { tone: "error", title: t("paymentFailedTitle"), message: priorError } : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const checkoutState = useCheckout();
  const checkoutError = checkoutState.type === "error" ? checkoutState.error.message : null;

  // Focus management for form accessibility
  useEffect(() => {
    // Focus the form when it loads
    if (formRef.current) {
      formRef.current.focus();
    }
  }, []);

  // Stripe couldn't start the checkout session. The modal swaps this form for a retry.
  useEffect(() => {
    if (checkoutError !== null) {
      onLoadError("checkout", checkoutError);
    }
  }, [checkoutError, onLoadError]);

  if (checkoutState.type === "loading") {
    return <ConnectingToStripe />;
  }

  if (checkoutState.type === "error") {
    return null;
  }

  // At this point, checkoutState.type is guaranteed to be "success" due to early returns
  const { checkout } = checkoutState;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);
    setNotice(null);
    funnel.trackSubmitted();

    try {
      // Confirm the payment - AddressElement data is automatically included
      const confirmResult = await checkout.confirm();

      if (confirmResult.type === "error") {
        funnel.trackFailed(confirmErrorProperties(confirmResult.error));
        setNotice(confirmErrorNotice(confirmResult.error, t));
        setIsLoading(false);
      }
      // If successful, Stripe will redirect automatically
    } catch (error) {
      console.error("Payment error:", error);
      funnel.trackFailed({
        error_code: "exception",
        ...(error instanceof Error && error.message && { error_message: capMessage(error.message) })
      });
      setNotice({ tone: "error", title: t("paymentFailedTitle"), message: t("unexpectedError") });
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
      {notice && (
        <div className={`${styles.errorBanner} ${notice.tone === "info" ? styles.infoBanner : ""}`} role="alert">
          <ExclamationCircleIcon />
          <div className={styles.errorBannerContent}>
            <div className={styles.errorBannerTitle}>{notice.title}</div>
            <div className={styles.errorBannerMessage}>{notice.message}</div>
          </div>
        </div>
      )}

      {/* Payment and Billing Section */}
      <PaymentElement
        options={{ layout: "tabs", wallets: { link: "never" } }}
        onReady={onReady}
        onLoadError={(event) => onLoadError("payment_element", event.error.message)}
        onChange={(event) => funnel.setPaymentMethod(event.value.type)}
      />

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

// Only a declined payment keeps Stripe's own message, which says why it was
// declined. Anything without a decline code (a closed wallet popup, a failed
// authentication, a network error) asks the person to try again.
function confirmErrorNotice(
  error: ConfirmError,
  t: ReturnType<typeof useTranslations<"modals.subscriptionCheckout">>
): Notice {
  if (error.paymentFailed?.declineCode) {
    return { tone: "error", title: t("paymentFailedTitle"), message: error.message || t("paymentFailed") };
  }
  return { tone: "info", title: t("notCompletedTitle"), message: t("notCompletedMessage") };
}

// Stripe gives a code and decline reason only for a failed payment. Anything
// else (an incomplete form, a network error, a closed wallet popup) arrives
// with a null code, which is recorded as "other". Stripe's checkout types
// leave out the error's `type`, so it's read only when present.
function confirmErrorProperties(error: ConfirmError) {
  const declineCode = error.paymentFailed?.declineCode;
  const errorType = (error as { type?: unknown }).type;
  return {
    error_code: error.code ?? "other",
    ...(declineCode && { decline_code: declineCode }),
    ...(typeof errorType === "string" && { error_type: errorType }),
    ...(error.message && { error_message: capMessage(error.message) })
  };
}
