/**
 * Checkout Modal Component
 * Displays Stripe payment form when user initiates subscription
 */

import { useState } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import type { MembershipTier } from "@/lib/pricing";
import { PRICING_TIERS } from "@/lib/pricing";

interface CheckoutModalProps {
  clientSecret: string;
  selectedTier: MembershipTier;
  onSuccess: () => void;
  onCancel: () => void;
}

interface CheckoutFormProps {
  selectedTier: MembershipTier;
  onSuccess: () => void;
  onCancel: () => void;
}

function CheckoutForm({ selectedTier, onSuccess, onCancel }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tierInfo = PRICING_TIERS[selectedTier];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/settings?success=true`
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Stripe error handling
      if (submitError) {
        setError(submitError.message ?? "An error occurred processing your payment.");
      } else {
        onSuccess();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Payment error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-bg-primary rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-primary">Subscribe to {tierInfo.name}</h2>
            <button onClick={onCancel} className="text-text-secondary hover:text-text-primary transition-colors">
              <span className="sr-only">Close</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Plan Summary */}
          <div className="bg-bg-secondary p-4 rounded-lg mb-6">
            <h3 className="font-medium text-text-primary mb-2">{tierInfo.name} Plan</h3>
            <p className="text-2xl font-bold text-text-primary mb-2">
              ${tierInfo.price}
              <span className="text-sm font-normal text-text-secondary">/month</span>
            </p>
            <p className="text-sm text-text-secondary mb-3">{tierInfo.description}</p>
            <ul className="text-sm text-text-secondary space-y-1">
              {tierInfo.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border border-border-secondary rounded-lg p-4">
              <PaymentElement />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-border-secondary rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!stripe || isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Processing..." : `Subscribe for $${tierInfo.price}/month`}
              </button>
            </div>
          </form>

          <p className="text-xs text-text-secondary mt-4 text-center">
            Your subscription will renew automatically each month. You can cancel anytime from your settings.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutModal({ clientSecret, selectedTier, onSuccess, onCancel }: CheckoutModalProps) {
  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const
    }
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm selectedTier={selectedTier} onSuccess={onSuccess} onCancel={onCancel} />
    </Elements>
  );
}
