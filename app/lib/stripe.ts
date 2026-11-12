/**
 * Stripe Initialization
 * Loads Stripe.js on demand and shares one Stripe instance across the app.
 */

// The pure entry point loads Stripe.js only when `loadStripe` is called. The
// default entry point would inject the script as soon as any chunk importing
// this module loads, e.g. on every exercise completion.
import { loadStripe } from "@stripe/stripe-js/pure";
import type { Stripe } from "@stripe/stripe-js";

// Stripe publishable key from environment
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.warn("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set. Stripe functionality will be disabled.");
}

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Starts loading Stripe.js on the first call and returns the same promise
 * after that. A failed load is forgotten, so the next call loads it again.
 * Resolves to null when no publishable key is configured.
 */
export function getStripe(): Promise<Stripe | null> {
  if (!stripePublishableKey) {
    return Promise.resolve(null);
  }

  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey).catch((error: unknown) => {
      stripePromise = null;
      throw error;
    });
  }
  return stripePromise;
}

/**
 * Starts loading Stripe.js ahead of checkout, e.g. when an upgrade offer is
 * shown. Failures are ignored here: checkout reports them when it opens.
 */
export function preloadStripe(): void {
  getStripe().catch(() => {});
}
