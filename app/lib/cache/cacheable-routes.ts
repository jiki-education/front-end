/**
 * Route cacheability checker for edge caching
 *
 * Determines which routes should be cached and which responses are cacheable.
 * Note: Only called for unauthenticated users (auth check happens in worker wrapper).
 */

import { PUBLIC_PAGES, PUBLIC_SECTIONS, stripLocalePrefix } from "@/lib/i18n/config";

/**
 * Check if a route is publicly cacheable at the edge.
 *
 * True for anonymously-viewable public pages (landing, blog, articles, concepts,
 * premium, roadmap, testimonials), in both naked and locale-prefixed form. The
 * locale prefix is stripped via SUPPORTED_LOCALES, so this stays correct for any
 * locale (including region subtags like pt-BR) and never caches an unsupported
 * "/xx/..." path. These are the only routes the edge cache (worker-wrapper) and
 * the middleware's public Cache-Control headers apply to. Everything else
 * (authenticated app pages, auth flows, the token-specific unsubscribe page, the
 * delete-account flow, dev/test) is never cached.
 *
 * Note: Only consulted for unauthenticated users. Static assets are cached
 * separately by OpenNext and don't go through this wrapper.
 *
 * @param pathname - The URL pathname to check
 * @returns true if route should be cached
 */
export function isCacheableRoute(pathname: string): boolean {
  const base = stripLocalePrefix(pathname);

  // Landing page (naked apex and locale homes, e.g. /hu)
  if (base === "/") {
    return true;
  }

  // Content sections: index and detail pages (/blog, /blog/my-post)
  if (PUBLIC_SECTIONS.some((section) => base === section || base.startsWith(`${section}/`))) {
    return true;
  }

  // Single public pages (exact match only)
  return (PUBLIC_PAGES as readonly string[]).includes(base);
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
