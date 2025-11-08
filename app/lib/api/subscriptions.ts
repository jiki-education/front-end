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
  CancelSubscriptionResponse
} from "@/types/subscription";

/**
 * Create a Stripe checkout session for a subscription
 * @param product - Membership tier/product (premium or max)
 * @param returnUrl - Optional return URL after payment completion
 * @returns Checkout session with client secret
 */
export async function createCheckoutSession(product: string, returnUrl?: string): Promise<CheckoutSessionResponse> {
  const response = await api.post<CheckoutSessionResponse>("/internal/subscriptions/checkout_session", {
    product,
    return_url: returnUrl
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
 * @returns Verification result
 */
export async function verifyCheckoutSession(sessionId: string): Promise<{ success: boolean; status: string }> {
  const response = await api.post<{ success: boolean; status: string }>("/internal/subscriptions/verify_checkout", {
    session_id: sessionId
  });
  return response.data;
}

/**
 * Update subscription tier (upgrade or downgrade)
 * @param product - Target membership tier (premium or max)
 * @returns Updated subscription details
 */
export async function updateSubscription(product: "premium" | "max"): Promise<UpdateSubscriptionResponse> {
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
