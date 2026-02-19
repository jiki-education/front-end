"use client";

import { PremiumPrice } from "@/components/common/PremiumPrice";
import ExclamationCircleIcon from "@/icons/exclamation-circle.svg";
import ShieldIcon from "@/icons/shield.svg";
import { PaymentElement, useCheckout } from "@stripe/react-stripe-js/checkout";
import { useEffect, useRef, useState } from "react";
import styles from "../SubscriptionCheckoutModal.module.css";

export function PaymentForm() {
  const [message, setMessage] = useState<string | null>(null);
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
        <div className={styles.loadingText}>Connecting to Stripe</div>
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

    try {
      // Confirm the payment - AddressElement data is automatically included
      const confirmResult = await checkout.confirm();

      if (confirmResult.type === "error") {
        setMessage(confirmResult.error.message || "Payment failed");
        setIsLoading(false);
      }
      // If successful, Stripe will redirect automatically
    } catch (error) {
      console.error("Payment error:", error);
      setMessage("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <form ref={formRef} tabIndex={-1} onSubmit={handleSubmit} className="space-y-6" aria-label="Payment information">
      {message && (
        <div className={styles.errorBanner}>
          <ExclamationCircleIcon />
          <div className={styles.errorBannerContent}>
            <div className={styles.errorBannerTitle}>Payment failed</div>
            <div className={styles.errorBannerMessage}>{message}</div>
          </div>
        </div>
      )}

      {/* Payment and Billing Section */}
      <PaymentElement options={{ layout: "tabs", wallets: { link: "never" } }} />

      <button
        type="submit"
        disabled={isLoading || !checkout.canConfirm}
        className="mt-10 ui-btn ui-btn-large ui-btn-primary ui-btn-purple w-full"
        id="submit-btn"
      >
        {isLoading ? (
          "Processing..."
        ) : (
          <>
            Pay <PremiumPrice interval="monthly" />
          </>
        )}
      </button>

      <p className={styles.footerText}>
        <ShieldIcon />
        Secured by <span className={styles.stripeBrand}>stripe</span>
      </p>
    </form>
  );
}
