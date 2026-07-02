/**
 * Route cacheability checker for edge caching
 *
 * Determines which routes should be cached and which responses are cacheable.
 * Note: Only called for unauthenticated users (auth check happens in worker wrapper).
 */

/**
 * Check if a route is publicly cacheable at the edge.
 *
 * True for anonymously-viewable public pages (landing, blog, articles, concepts,
 * premium, roadmap, testimonials), in both naked and locale-prefixed form. These are the only
 * routes the edge cache (worker-wrapper) and the middleware's public
 * Cache-Control headers apply to. Everything else (authenticated app pages, auth
 * flows, the token-specific unsubscribe page, dev/test) is never cached.
 *
 * Note: Only consulted for unauthenticated users. Static assets are cached
 * separately by OpenNext and don't go through this wrapper.
 *
 * @param pathname - The URL pathname to check
 * @returns true if route should be cached
 */
export function isCacheableRoute(pathname: string): boolean {
  // Landing page (naked apex and locale homes, e.g. /hu)
  if (pathname === "/" || /^\/[a-z]{2}$/.test(pathname)) {
    return true;
  }

  // Blog routes (naked and locale-prefixed, e.g. /hu/blog)
  if (pathname === "/blog" || pathname.startsWith("/blog/") || /^\/[a-z]{2}\/blog(\/|$)/.test(pathname)) {
    return true;
  }

  // Articles routes (naked and locale-prefixed)
  if (pathname === "/articles" || pathname.startsWith("/articles/") || /^\/[a-z]{2}\/articles(\/|$)/.test(pathname)) {
    return true;
  }

  // Concepts routes (naked and locale-prefixed)
  if (pathname === "/concepts" || pathname.startsWith("/concepts/") || /^\/[a-z]{2}\/concepts(\/|$)/.test(pathname)) {
    return true;
  }

  // Single-page public marketing routes (naked and locale-prefixed)
  if (/^(?:\/[a-z]{2})?\/(?:premium|roadmap|testimonials)$/.test(pathname)) {
    return true;
  }

  return false;
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
