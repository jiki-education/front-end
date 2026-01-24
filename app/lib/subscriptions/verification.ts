/**
 * Payment Verification Utilities
 * Functions for handling Stripe checkout returns
 */

/**
 * Extracts checkout_session_id from URL search params and clears it from the URL
 *
 * Only extracts if checkout_return=true is present (indicating a Stripe redirect)
 *
 * @returns The checkout_session_id if found, null otherwise
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
