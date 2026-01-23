"use client";

import { useState, useEffect, useRef } from "react";
import { CheckoutProvider, useCheckout, PaymentElement } from "@stripe/react-stripe-js/checkout";
import { stripePromise } from "@/lib/stripe";
import type { MembershipTier } from "@/lib/pricing";
import { PRICING_TIERS } from "@/lib/pricing";
import { hideModal } from "../store";
import ShieldIcon from "@/icons/shield.svg";
import ExclamationCircleIcon from "@/icons/exclamation-circle.svg";
import styles from "./SubscriptionCheckoutModal.module.css";

interface SubscriptionCheckoutModalProps {
  clientSecret: string;
  selectedTier: MembershipTier;
  onCancel?: () => void;
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

  // Show loading state
  if (checkoutState.type === "loading") {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment form...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (checkoutState.type === "error") {
    return (
      <div className="bg-bg-primary p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-800">Error: {checkoutState.error.message}</p>
        </div>
        <button
          onClick={onCancel}
          className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // At this point, checkoutState.type is guaranteed to be "success" due to early returns
    const { checkout } = checkoutState;

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

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-6" aria-label="Payment information">
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
        <PaymentElement options={{ layout: "tabs" }} />

        <button
          type="submit"
          disabled={isLoading}
          className="mt-10 ui-btn ui-btn-large ui-btn-primary ui-btn-purple w-full"
          id="submit-btn"
        >
          {isLoading ? "Processing..." : "Pay"}
        </button>

        <p className={styles.footerText}>
          <ShieldIcon />
          Secured by <span className={styles.stripeBrand}>stripe</span>
        </p>
      </form>
    </div>
  );
}

export function SubscriptionCheckoutModal({ clientSecret, selectedTier, onCancel }: SubscriptionCheckoutModalProps) {
  const handleCancel = () => {
    onCancel?.();
    hideModal();
  };

  const appearance = {
    inputs: "condensed" as const,
    labels: "auto" as const,

    variables: {
      fontFamily: '"Poppins", "-apple-system", "system-ui", "Segoe UI", Roboto, sans-serif',
      borderRadius: "10px",
      spacingUnit: "5px",
      fontSmooth: "always",
      colorText: "#343a46", // Should match gray-900
      colorDanger: "#ef4444", // Should match red-900
      gridRowSpacing: "10px"
    },

    rules: {
      ".Tab": {
        borderRadius: "10px"
      },
      ".Tab--selected": {
        borderColor: "#2570eb"
      },
      ".Error": {
        marginTop: "12px",
        fontWeight: "500"
      },
      ".Input": {
        lineHeight: "1"
      }
    }
  };

  const options = {
    clientSecret,
    elementsOptions: {
      fonts: [{ cssSrc: "https://fonts.googleapis.com/css?family=Poppins" }],
      appearance
    }
  };

  return (
    <CheckoutProvider stripe={stripePromise} options={options}>
      <CheckoutForm selectedTier={selectedTier} onCancel={handleCancel} />
    </CheckoutProvider>
  );
}
