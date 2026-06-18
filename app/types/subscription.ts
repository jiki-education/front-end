/**
 * Subscription Types
 * Type definitions for subscription and payment system
 */

import type { BillingInterval } from "@/lib/pricing";

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "never_subscribed"
  | "cancelling"
  | "payment_failed";

export interface SubscriptionDetails {
  in_grace_period: boolean;
  grace_period_ends_at: string | null; // ISO 8601 date string
  subscription_valid_until: string; // ISO 8601 date string
}

export interface CheckoutSessionResponse {
  client_secret: string;
}

export interface PortalSessionResponse {
  url: string;
}

export interface UpdateSubscriptionResponse {
  success: boolean;
  interval: BillingInterval;
  effective_at: string; // ISO 8601 date string
  subscription_valid_until: string; // ISO 8601 date string
}

export interface CancelSubscriptionResponse {
  success: boolean;
  cancels_at: string; // ISO 8601 date string
}

export interface ReactivateSubscriptionResponse {
  success: boolean;
  subscription_valid_until: string; // ISO 8601 date string
}

export type CheckoutPaymentState = "paid" | "processing" | "failed";

export interface VerifyCheckoutResponse {
  success: boolean;
  interval: BillingInterval;
  /** @deprecated raw Stripe value, kept during transition — branch on `payment_state` instead. */
  payment_status: "paid" | "unpaid";
  // Derived server-side from the first invoice's PaymentIntent. Best-effort: falls back
  // to "processing" (never "failed") when the PaymentIntent can't be read.
  payment_state: CheckoutPaymentState;
  subscription_status: "active" | "incomplete";
  // Customer-safe Stripe reason, only set when payment_state === "failed" (may still be null).
  decline_reason?: string | null;
  // Informational — the currency the session used. Currency is derived server-side from
  // the user on checkout creation, so the FE doesn't echo this back.
  currency?: string;
}
