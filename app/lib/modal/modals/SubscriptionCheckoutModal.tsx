"use client";

import { useState, useEffect, useRef } from "react";
import { CheckoutProvider, useCheckout, PaymentElement } from "@stripe/react-stripe-js/checkout";
import { stripePromise } from "@/lib/stripe";
import type { MembershipTier } from "@/lib/pricing";
import { PRICING_TIERS } from "@/lib/pricing";
import { hideModal } from "../store";
import styles from "./SubscriptionCheckoutModal.module.css";

interface SubscriptionCheckoutModalProps {
  clientSecret: string;
  selectedTier: MembershipTier;
  onCancel?: () => void;
  onSuccess?: () => void;
}

function CheckoutForm({ selectedTier, onCancel }: { selectedTier: MembershipTier; onCancel: () => void }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const checkoutState = useCheckout();
  const tierInfo = PRICING_TIERS[selectedTier];

  // Focus management for form accessibility
  useEffect(() => {
    // Focus the form when it loads
    if (formRef.current) {
      formRef.current.focus();
    }
  }, []);

  if (checkoutState.type === "error") {
    return (
      <div className="bg-bg-primary">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">Error: {checkoutState.error.message}</p>
        </div>
        <button
          onClick={onCancel}
          className="mt-4 w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

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
  };

  return (
    <div ref={formRef} tabIndex={-1} className="max-w-md mx-auto">
      {/* Order Header */}
      <div className={styles.orderHeader}>
        <div className={styles.orderInfo}>
          <div className={styles.orderTitle}>Jiki {tierInfo.name}</div>
          <div className={styles.orderBilling}>Billed monthly. Cancel anytime.</div>
        </div>
        <div className={styles.orderPrice}>
          <span className={styles.amount}>${tierInfo.price}</span>
          <span className={styles.period}>/mo</span>
        </div>
      </div>

      {/* Plan Features */}
      <section className="bg-bg-secondary p-4 rounded-lg mb-6" aria-labelledby="plan-features-title">
        <h3 id="plan-features-title" className="sr-only">Plan Features</h3>
        <p className="text-sm text-text-secondary mb-3">{tierInfo.description}</p>
        <ul className="text-sm text-text-secondary space-y-1" aria-label="Plan features">
          {tierInfo.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <span className="text-green-500 mr-2" aria-hidden="true">
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </section>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-4" aria-label="Payment information">
        <fieldset className="border border-border-secondary rounded-lg p-4">
          <legend className="sr-only">Payment details</legend>
          <PaymentElement />
        </fieldset>

        {message && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg" role="alert" aria-live="polite">
            <p className="text-sm text-red-800">{message}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-border-secondary rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
            aria-label="Cancel subscription and close modal"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || checkoutState.type === "loading"}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-describedby="subscribe-button-description"
          >
            {isLoading || checkoutState.type === "loading"
              ? "Processing..."
              : `Subscribe for $${tierInfo.price}/month`}
          </button>
        </div>
      </form>

      <p id="subscribe-button-description" className="text-xs text-text-secondary mt-4 text-center">
        Your subscription will renew automatically each month. You can cancel anytime from your settings.
      </p>
    </div>
  );
}

export function SubscriptionCheckoutModal({
  clientSecret,
  selectedTier,
  onCancel,
  onSuccess: _onSuccess
}: SubscriptionCheckoutModalProps) {
  const handleCancel = () => {
    onCancel?.();
    hideModal();
  };

  return (
    <CheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm selectedTier={selectedTier} onCancel={handleCancel} />
    </CheckoutProvider>
  );
}
