/**
 * Utilities for handling return_to URL parameter for SSO flows.
 * Used to redirect users back to external services (like Discourse forum)
 * after successful authentication.
 */

const RETURN_TO_KEY = "auth_return_to";

/**
 * Validates that a return_to URL is safe to redirect to.
 * Only allows URLs on api.jiki.io to prevent open redirect vulnerabilities.
 */
export function isValidReturnToUrl(url: string | null): boolean {
  if (!url) {
    return false;
  }
  // Allow both http and https for dev/prod flexibility
  return /^https?:\/\/api\.jiki\.io\//.test(url);
}

/**
 * Stores a valid return_to URL in sessionStorage.
 * This persists across page navigations within the same tab.
 */
export function storeReturnTo(url: string | null): void {
  if (typeof window === "undefined") {
    return;
  }
  if (isValidReturnToUrl(url)) {
    sessionStorage.setItem(RETURN_TO_KEY, url!);
  }
}

/**
 * Retrieves the stored return_to URL from sessionStorage.
 */
export function getStoredReturnTo(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return sessionStorage.getItem(RETURN_TO_KEY);
}

/**
 * Clears the stored return_to URL from sessionStorage.
 * Should be called after successful redirect.
 */
export function clearStoredReturnTo(): void {
  if (typeof window === "undefined") {
    return;
  }
  sessionStorage.removeItem(RETURN_TO_KEY);
}

/**
 * Gets the redirect destination after successful authentication.
 * Checks the provided parameter first, then falls back to sessionStorage.
 * Returns "/dashboard" if no valid return_to URL is found.
 */
export function getPostAuthRedirect(returnToParam: string | null): string {
  const returnTo = returnToParam || getStoredReturnTo();
  if (isValidReturnToUrl(returnTo)) {
    clearStoredReturnTo();
    return returnTo!;
  }
  return "/dashboard";
}

/**
 * Builds a URL with the return_to parameter preserved.
 * Used for navigation links between login/signup pages.
 */
export function buildUrlWithReturnTo(basePath: string, returnTo: string | null): string {
  if (!returnTo || !isValidReturnToUrl(returnTo)) {
    return basePath;
  }
  return `${basePath}?return_to=${encodeURIComponent(returnTo)}`;
}
