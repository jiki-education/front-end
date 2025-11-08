/**
 * Subscription Types
 * Type definitions for subscription and payment system
 */

import type { MembershipTier } from "@/lib/pricing";

export type SubscriptionStatus = "active" | "canceled" | "past_due" | "incomplete" | "incomplete_expired" | "trialing";

export interface Subscription {
  tier: MembershipTier;
  status: SubscriptionStatus;
  current_period_end: string; // ISO 8601 date string
  payment_failed: boolean;
  in_grace_period: boolean;
  grace_period_ends_at: string | null; // ISO 8601 date string
  cancel_at_period_end: boolean; // True if subscription is scheduled for cancellation
}

export interface SubscriptionStatusResponse {
  subscription: Subscription;
}

export interface CheckoutSessionRequest {
  product: MembershipTier;
  return_url?: string;
}

export interface CheckoutSessionResponse {
  client_secret: string;
}

export interface PortalSessionResponse {
  url: string;
}

export interface UpdateSubscriptionRequest {
  product: "premium" | "max";
}

export interface UpdateSubscriptionResponse {
  tier: MembershipTier;
  subscription_valid_until: string; // ISO 8601 date string
}
