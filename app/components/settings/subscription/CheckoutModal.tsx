/**
 * Checkout Modal Component
 * Displays Stripe payment form when user initiates subscription
 */

import { useState, useEffect, useRef } from "react";
import { CheckoutProvider, useCheckout, PaymentElement } from "@stripe/react-stripe-js/checkout";
import { stripePromise } from "@/lib/stripe";
import type { MembershipTier } from "@/lib/pricing";
import { PRICING_TIERS } from "@/lib/pricing";

interface CheckoutModalProps {
  clientSecret: string;
  selectedTier: MembershipTier;
  onCancel: () => void;
}

function CheckoutForm({ selectedTier, onCancel }: { selectedTier: MembershipTier; onCancel: () => void }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const checkoutState = useCheckout();
  const tierInfo = PRICING_TIERS[selectedTier];

  // Focus management for modal accessibility
  useEffect(() => {
    // Focus the modal when it opens
    if (modalRef.current) {
      modalRef.current.focus();
    }

    // Handle escape key
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    // Prevent scrolling on body when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [onCancel]);

  if (checkoutState.type === "error") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-modal-backdrop">
        <div className="bg-bg-primary rounded-lg shadow-xl max-w-md w-full p-6">
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
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      onClick={(e) => {
        // Close modal when clicking backdrop
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        ref={modalRef}
        className="bg-bg-primary rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto"
        role="document"
        tabIndex={-1}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 id="checkout-modal-title" className="text-xl font-semibold text-text-primary">
              Subscribe to {tierInfo.name}
            </h2>
            <button
              onClick={onCancel}
              className="text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Close checkout modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Plan Summary */}
          <section className="bg-bg-secondary p-4 rounded-lg mb-6" aria-labelledby="plan-summary-title">
            <h3 id="plan-summary-title" className="font-medium text-text-primary mb-2">
              {tierInfo.name} Plan
            </h3>
            <p className="text-2xl font-bold text-text-primary mb-2" aria-label={`Monthly price: $${tierInfo.price}`}>
              ${tierInfo.price}
              <span className="text-sm font-normal text-text-secondary">/month</span>
            </p>
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
      </div>
    </div>
  );
}

export default function CheckoutModal({ clientSecret, selectedTier, onCancel }: CheckoutModalProps) {
  return (
    <CheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm selectedTier={selectedTier} onCancel={onCancel} />
    </CheckoutProvider>
  );
}
