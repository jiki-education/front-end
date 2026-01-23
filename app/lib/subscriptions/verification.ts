/**
 * Payment Verification Utilities
 * Functions for verifying Stripe checkout sessions after payment completion
 */

import { verifyCheckoutSession } from "@/lib/api/subscriptions";

export interface VerificationResult {
  success: boolean;
  error?: string;
}

/**
 * Verifies a Stripe checkout session after payment redirect
 *
 * This function should be called when the user returns from Stripe payment
 * with a session_id in the URL. It verifies the session and syncs the
 * subscription status with the backend.
 *
 * @param sessionId - The Stripe checkout session ID from URL parameter
 * @returns Promise resolving to verification result
 *
 * @example
 * const result = await verifyPaymentSession("cs_test_abc123");
 * if (result.success) {
 *   // Payment verified, subscription synced
 * } else {
 *   // Handle error
 *   console.error(result.error);
 * }
 */
export async function verifyPaymentSession(sessionId: string): Promise<VerificationResult> {
  try {
    await verifyCheckoutSession(sessionId);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to verify payment";
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Extracts checkout_session_id from URL search params and clears it from the URL
 *
 * Only extracts if checkout_return=true is present (indicating a Stripe redirect)
 *
 * @returns The checkout_session_id if found, null otherwise
 *
 * @example
 * const sessionId = extractAndClearCheckoutSessionId();
 * if (sessionId) {
 *   await verifyPaymentSession(sessionId);
 * }
 */
export function extractAndClearCheckoutSessionId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const isCheckoutReturn = urlParams.get("checkout_return") === "true";
  const sessionId = urlParams.get("checkout_session_id");

  if (isCheckoutReturn && sessionId) {
    // Clear the checkout params from URL
    window.history.replaceState({}, "", window.location.pathname);
    return sessionId;
  }

  return null;
}
