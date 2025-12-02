/**
 * Cache key generator for Cloudflare Workers Cache API
 *
 * Generates normalized cache keys with:
 * - Allowlisted query parameters (page, criteria)
 * - Deploy ID (git SHA) for automatic invalidation on deploy
 *
 * Note: RSC requests (client-side navigation) are not cached, only HTML requests.
 */

const ALLOWED_PARAMS = new Set(["page", "criteria"]);

/**
 * Check if a query parameter is allowed in cache keys
 */
export function isAllowedParam(key: string): boolean {
  return ALLOWED_PARAMS.has(key.toLowerCase());
}

/**
 * Normalize search params by filtering and sorting
 *
 * Only includes allowlisted params (page, criteria) and sorts them
 * alphabetically for consistent cache keys.
 */
export function normalizeSearchParams(searchParams: URLSearchParams): string {
  const filtered: [string, string][] = [];

  searchParams.forEach((value, key) => {
    if (isAllowedParam(key)) {
      filtered.push([key, value]);
    }
  });

  // Sort alphabetically for consistent keys
  filtered.sort(([a], [b]) => a.localeCompare(b));

  if (filtered.length === 0) {
    return "";
  }

  return "?" + filtered.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&");
}

/**
 * Generate a cache key for the Cache API
 *
 * Format: /blog/post?page=1#abc1234
 *
 * Components:
 * - Pathname (preserves locale)
 * - Normalized query params (page, criteria)
 * - Deploy ID (git SHA)
 *
 * Note: Only HTML requests are cached. RSC requests (client-side navigation) are not cached.
 *
 * @param request - The incoming request
 * @param deployId - Git SHA of current deployment
 * @returns Normalized cache key
 */
export function generateCacheKey(request: Request, deployId: string): string {
  const url = new URL(request.url);
  const normalizedParams = normalizeSearchParams(url.searchParams);

  return `${url.pathname}${normalizedParams}#${deployId}`;
}
