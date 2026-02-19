/**
 * Subscriptions API
 * API functions for managing Stripe subscriptions
 */

import { api } from "./client";
import type {
  CheckoutSessionResponse,
  PortalSessionResponse,
  UpdateSubscriptionResponse,
  CancelSubscriptionResponse,
  ReactivateSubscriptionResponse,
  VerifyCheckoutResponse
} from "@/types/subscription";
import type { BillingInterval } from "@/lib/pricing";

/**
 * Create a Stripe checkout session for a subscription
 * @param interval - Billing interval (monthly or annual)
 * @param returnUrl - Optional return URL after payment completion
 * @param customerEmail - Optional customer email for pre-filling and Link authentication
 * @returns Checkout session with client secret
 */
export async function createCheckoutSession(
  interval: BillingInterval,
  returnUrl?: string,
  customerEmail?: string
): Promise<CheckoutSessionResponse> {
  const response = await api.post<CheckoutSessionResponse>("/internal/subscriptions/checkout_session", {
    interval,
    return_url: returnUrl,
    customer_email: customerEmail
  });
  return response.data;
}

/**
 * Create a Stripe Customer Portal session for subscription management
 * @returns Portal session with redirect URL
 */
export async function createPortalSession(): Promise<PortalSessionResponse> {
  const response = await api.post<PortalSessionResponse>("/internal/subscriptions/portal_session");
  return response.data;
}

/**
 * Verify a checkout session and sync subscription status
 * @param sessionId - Stripe checkout session ID
 * @returns Verification result with payment status and interval
 */
export async function verifyCheckoutSession(sessionId: string): Promise<VerifyCheckoutResponse> {
  const response = await api.post<VerifyCheckoutResponse>("/internal/subscriptions/verify_checkout", {
    session_id: sessionId
  });
  return response.data;
}

/**
 * Update subscription interval (monthly/annual)
 * @param interval - Target billing interval
 * @returns Updated subscription details
 */
export async function updateSubscription(interval: BillingInterval): Promise<UpdateSubscriptionResponse> {
  const response = await api.post<UpdateSubscriptionResponse>("/internal/subscriptions/update", {
    interval
  });
  return response.data;
}

/**
 * Cancel subscription (schedules cancellation at period end)
 * @returns Cancellation status and access end date
 */
export async function cancelSubscription(): Promise<CancelSubscriptionResponse> {
  const response = await api.delete<CancelSubscriptionResponse>("/internal/subscriptions/cancel");
  return response.data;
}

/**
 * Reactivate a cancelled subscription (resumes subscription)
 * @returns Reactivated subscription status
 */
export async function reactivateSubscription(): Promise<ReactivateSubscriptionResponse> {
  const response = await api.post<ReactivateSubscriptionResponse>("/internal/subscriptions/reactivate");
  return response.data;
}
