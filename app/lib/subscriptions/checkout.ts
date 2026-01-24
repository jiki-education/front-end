/**
 * Checkout Utilities
 * Helper functions for Stripe checkout session management
 */

/**
 * Creates a return URL for Stripe checkout with session_id placeholder
 *
 * Stripe replaces {CHECKOUT_SESSION_ID} with the actual session ID when redirecting
 * after payment completion.
 *
 * @param pathname - The pathname to return to (e.g., "/dev/stripe-test")
 * @param origin - The origin URL (defaults to window.location.origin if in browser)
 * @returns Full URL with session_id placeholder
 *
 * @example
 * createCheckoutReturnUrl("/subscribe")
 * // Returns: "http://localhost:3071/subscribe?session_id={CHECKOUT_SESSION_ID}"
 */
export function createCheckoutReturnUrl(pathname: string, origin?: string): string {
  const baseOrigin = origin || (typeof window !== "undefined" ? window.location.origin : "");
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${baseOrigin}${normalizedPath}?checkout_return=true&checkout_session_id={CHECKOUT_SESSION_ID}`;
}
