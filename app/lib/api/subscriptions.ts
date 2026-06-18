/**
 * Subscriptions API
 * API functions for managing Stripe subscriptions
 */

import { ApiError, CheckoutIncompleteError, api } from "./client";
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
  try {
    const response = await api.post<VerifyCheckoutResponse>("/internal/subscriptions/verify_checkout", {
      session_id: sessionId
    });
    return response.data;
  } catch (error) {
    // A declined / abandoned / expired checkout (`checkout_payment_incomplete`) is an
    // expected payment failure, not a bug — surface it as a typed error so callers can
    // reopen checkout without reporting to Sentry. Everything else (invalid_session,
    // unauthorized, verification_failed, 5xx, …) propagates unchanged.
    if (error instanceof ApiError) {
      const body = error.data as
        | { error?: { type?: string; decline_reason?: string | null; interval?: BillingInterval } }
        | undefined;
      if (body?.error?.type === "checkout_payment_incomplete") {
        // `interval` is absent only for the pre-deploy migration tail; default it so the
        // retry can still reopen with a plan selected.
        throw new CheckoutIncompleteError(
          error.statusText,
          error.data,
          body.error.decline_reason ?? null,
          body.error.interval ?? "annual"
        );
      }
    }
    throw error;
  }
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
