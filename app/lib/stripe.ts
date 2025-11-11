/**
 * Stripe Initialization
 * Provides Stripe instance for client-side payment processing
 */

import { loadStripe } from "@stripe/stripe-js";
import type { Stripe } from "@stripe/stripe-js";

// Stripe publishable key from environment
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.warn("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set. Stripe functionality will be disabled.");
}

// Initialize Stripe with publishable key
// This is a singleton - loadStripe caches the instance
export const stripePromise: Promise<Stripe | null> = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : Promise.resolve(null);
