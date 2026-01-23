/**
 * Subscriptions API
 * API functions for managing Stripe subscriptions
 */

import { api } from "./client";
import type {
  CheckoutSessionRequest,
  CheckoutSessionResponse,
  PortalSessionResponse,
  UpdateSubscriptionRequest,
  UpdateSubscriptionResponse,
  CancelSubscriptionResponse,
  ReactivateSubscriptionResponse,
  VerifyCheckoutResponse
} from "@/types/subscription";

/**
 * Create a Stripe checkout session for a subscription
 * @param product - Membership tier/product (premium)
 * @param returnUrl - Optional return URL after payment completion
 * @param customerEmail - Optional customer email for pre-filling and Link authentication
 * @returns Checkout session with client secret
 */
export async function createCheckoutSession(
  product: string,
  returnUrl?: string,
  customerEmail?: string
): Promise<CheckoutSessionResponse> {
  const response = await api.post<CheckoutSessionResponse>("/internal/subscriptions/checkout_session", {
    product,
    return_url: returnUrl,
    customer_email: customerEmail
  } as CheckoutSessionRequest);
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
 * @returns Verification result with payment status and tier
 */
export async function verifyCheckoutSession(sessionId: string): Promise<VerifyCheckoutResponse> {
  const response = await api.post<VerifyCheckoutResponse>("/internal/subscriptions/verify_checkout", {
    session_id: sessionId
  });
  return response.data;
}

/**
 * Update subscription tier (upgrade or downgrade)
 * @param product - Target membership tier (premium)
 * @returns Updated subscription details
 */
export async function updateSubscription(product: "premium"): Promise<UpdateSubscriptionResponse> {
  const response = await api.post<UpdateSubscriptionResponse>("/internal/subscriptions/update", {
    product
  } as UpdateSubscriptionRequest);
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
