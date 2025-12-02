/**
 * Route cacheability checker for edge caching
 *
 * Determines which routes should be cached and which responses are cacheable.
 * Note: Only called for unauthenticated users (auth check happens in worker wrapper).
 */

import { isExternalUrl } from "@/lib/routing/external-urls";

/**
 * Check if a route is cacheable
 *
 * Only external URLs (blog, articles, concepts, etc.) are cacheable.
 * Static assets are already cached by OpenNext and don't go through this wrapper.
 *
 * @param pathname - The URL pathname to check
 * @returns true if route should be cached
 */
export function isCacheableRoute(pathname: string): boolean {
  return isExternalUrl(pathname);
}

/**
 * Check if a response should be cached
 *
 * Criteria:
 * - Status 200-299 (success)
 * - Has Cache-Control: public header
 * - Not already a cache hit
 *
 * @param response - The response to check
 * @returns true if response should be cached
 */
export function shouldCacheResponse(response: Response): boolean {
  // Only cache successful responses
  if (response.status < 200 || response.status >= 300) {
    return false;
  }

  // Must have Cache-Control: public header
  const cacheControl = response.headers.get("Cache-Control");
  if (!cacheControl || !cacheControl.includes("public")) {
    return false;
  }

  // Don't re-cache already cached responses
  const xCache = response.headers.get("X-Cache");
  if (xCache === "HIT") {
    return false;
  }

  return true;
}
