/**
 * Subscription and Premium purchase types
 *
 * New members buy Premium once (a lifetime purchase). Members who subscribed
 * before that keep their monthly or annual Stripe subscription, so the
 * subscription types here describe those legacy subscribers only.
 */

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "never_subscribed"
  | "cancelling"
  | "payment_failed";

export type SubscriptionInterval = "monthly" | "annual";

// Present on the user while a legacy subscription is live (active, incomplete,
// payment_failed or cancelling), and null otherwise.
export interface SubscriptionDetails {
  interval: SubscriptionInterval;
  // What Stripe will charge on the next renewal, in the subscription's own
  // currency. Null until the API has backfilled it for that subscription.
  amount_in_cents: number | null;
  currency: string | null;
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

export interface CancelSubscriptionResponse {
  success: boolean;
  cancels_at: string; // ISO 8601 date string
}

export interface ReactivateSubscriptionResponse {
  success: boolean;
  subscription_valid_until: string; // ISO 8601 date string
}

// "processing" means a delayed payment method (e.g. a bank debit) is still
// clearing. The API grants Premium by webhook once it settles.
export type CheckoutPaymentState = "paid" | "processing";

export interface VerifyPurchaseResponse {
  success: boolean;
  payment_state: CheckoutPaymentState;
}
