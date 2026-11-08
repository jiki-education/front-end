/**
 * Premium Purchases API
 * The one-off (lifetime) Premium purchase: start a checkout, then verify it.
 */

import { ApiError, CheckoutIncompleteError, api } from "./client";
import type { CheckoutSessionResponse, VerifyPurchaseResponse } from "@/types/subscription";

/**
 * Create a Stripe checkout session for a lifetime Premium purchase.
 * The API picks the currency and price from the user's country.
 * @param returnUrl - Where Stripe sends the user once payment completes
 */
export async function createPurchaseCheckoutSession(returnUrl: string): Promise<CheckoutSessionResponse> {
  const response = await api.post<CheckoutSessionResponse>("/internal/premium_purchases/checkout_session", {
    return_url: returnUrl
  });
  return response.data;
}

/**
 * Verify a completed purchase checkout session. The API grants Premium
 * immediately when the payment has cleared.
 * @param sessionId - Stripe checkout session ID
 */
export async function verifyPurchaseCheckout(sessionId: string): Promise<VerifyPurchaseResponse> {
  try {
    const response = await api.post<VerifyPurchaseResponse>("/internal/premium_purchases/verify_checkout", {
      session_id: sessionId
    });
    return response.data;
  } catch (error) {
    // A declined / abandoned / expired checkout (`checkout_payment_incomplete`) is an
    // expected payment outcome. It surfaces as a typed error so callers can reopen
    // checkout without reporting to Sentry. Everything else (invalid_session,
    // unauthorized, verification_failed, 5xx, …) propagates unchanged.
    if (error instanceof ApiError) {
      const body = error.data as { error?: { type?: string; decline_code?: string | null } } | undefined;
      if (body?.error?.type === "checkout_payment_incomplete") {
        throw new CheckoutIncompleteError(error.statusText, error.data, body.error.decline_code ?? null);
      }
    }
    throw error;
  }
}
