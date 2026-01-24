/**
 * Subscription Types
 * Type definitions for subscription and payment system
 */

import type { MembershipTier } from "@/lib/pricing";

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

export interface CheckoutSessionRequest {
  product: MembershipTier;
  return_url?: string;
  customer_email?: string;
}

export interface CheckoutSessionResponse {
  client_secret: string;
}

export interface PortalSessionResponse {
  url: string;
}

export interface UpdateSubscriptionRequest {
  product: "premium";
}

export interface UpdateSubscriptionResponse {
  success: boolean;
  tier: MembershipTier;
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

export interface VerifyCheckoutResponse {
  success: boolean;
  tier: MembershipTier;
  payment_status: "paid" | "unpaid";
  subscription_status: "active" | "incomplete";
}
