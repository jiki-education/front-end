"use client";

import { useState } from "react";
import { useCheckout, PaymentElement } from "@stripe/react-stripe-js/checkout";
import { PremiumPrice } from "@/components/common/PremiumPrice";
import type { MembershipTier } from "@/lib/pricing";
import { DEV_TIER_DISPLAY } from "../tiers";
import styles from "./CheckoutForm.module.css";

export function CheckoutForm({ tier, onCancel }: { tier: MembershipTier; onCancel: () => void }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkoutState = useCheckout();
  const pricingTier = DEV_TIER_DISPLAY[tier];

  if (checkoutState.type === "error") {
    return (
      <div className={styles.errorBox}>
        <p className={styles.errorText}>Error: {checkoutState.error.message}</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (checkoutState.type !== "success") {
      return;
    }

    const { checkout } = checkoutState;
    setIsLoading(true);

    // Confirm the payment
    const confirmResult = await checkout.confirm();

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (confirmResult.type === "error") {
      setMessage(confirmResult.error.message);
      setIsLoading(false);
    } else {
      // Payment succeeded - redirect will happen automatically
      // Note: The redirect to return_url happens automatically by Stripe
      // The page will reload with the session_id in the URL
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Order Summary */}
      <div className={styles.orderSummary}>
        <h3 className={styles.orderTitle}>Order Summary</h3>
        <div className={styles.orderRow}>
          <div>
            <p className={styles.planName}>{pricingTier.name} Plan</p>
            <p className={styles.planDescription}>{pricingTier.description}</p>
          </div>
          <div className={styles.priceColumn}>
            <p className={styles.price}>
              <PremiumPrice interval="monthly" />
            </p>
            <p className={styles.perMonth}>per month</p>
          </div>
        </div>
      </div>

      {/* Payment Element */}
      <div>
        <h4 className={styles.paymentLabel}>Payment</h4>
        <PaymentElement id="payment-element" />
      </div>

      {/* Error/Success Messages */}
      {message && (
        <div className={styles.errorBox}>
          <p id="payment-message" className={styles.errorText}>
            {message}
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className={styles.buttonRow}>
        <button
          type="submit"
          id="submit"
          disabled={isLoading || checkoutState.type === "loading"}
          className={styles.submitButton}
        >
          {isLoading || checkoutState.type === "loading" ? (
            <div className={`spinner ${styles.spinner}`}></div>
          ) : (
            "Pay now"
          )}
        </button>
        <button type="button" onClick={onCancel} disabled={isLoading} className={styles.cancelButton}>
          Cancel
        </button>
      </div>

      {/* Additional Info */}
      <p className={styles.disclaimer}>
        By subscribing, you agree to our terms and authorize recurring monthly charges.
      </p>
    </form>
  );
}
