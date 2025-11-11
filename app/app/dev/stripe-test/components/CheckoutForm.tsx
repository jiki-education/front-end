"use client";

import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { getPricingTier } from "@/lib/pricing";
import type { MembershipTier } from "@/lib/pricing";

export function CheckoutForm({ tier, onCancel }: { tier: MembershipTier; onCancel: () => void }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const pricingTier = getPricingTier(tier);

  if (!stripe || !elements) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-800">Loading payment form...</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    // Confirm the payment using Stripe's confirmPayment
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href // Return to the same page after payment
      }
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (error) {
      setMessage(error.message || "An unexpected error occurred.");
      setIsLoading(false);
    } else {
      // Payment succeeded - redirect will happen automatically
      // Note: The redirect to return_url happens automatically by Stripe
      // The page will reload with the session_id in the URL
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Summary */}
      <div className="bg-gray-50 border rounded-lg p-4">
        <h3 className="font-semibold mb-2">Order Summary</h3>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{pricingTier.name} Plan</p>
            <p className="text-sm text-gray-600">{pricingTier.description}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">${pricingTier.price}</p>
            <p className="text-sm text-gray-600">per month</p>
          </div>
        </div>
      </div>

      {/* Payment Element */}
      <div>
        <h4 className="text-sm font-medium mb-2">Payment</h4>
        <PaymentElement id="payment-element" />
      </div>

      {/* Error/Success Messages */}
      {message && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p id="payment-message" className="text-sm text-red-800">
            {message}
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          id="submit"
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          disabled={isLoading || !stripe || !elements}
          className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="spinner inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
          ) : (
            `Pay $${pricingTier.price} now`
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-3 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Additional Info */}
      <p className="text-xs text-gray-500 text-center">
        By subscribing, you agree to our terms and authorize recurring monthly charges.
      </p>
    </form>
  );
}
