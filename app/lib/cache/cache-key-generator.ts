/**
 * Cache key generator for Cloudflare Workers Cache API
 *
 * Generates normalized cache keys with:
 * - Allowlisted query parameters (page, criteria)
 * - Deploy ID (git SHA) for automatic invalidation on deploy
 * - Locale bucket (the banner language this request would render, or "none") so
 *   the locale-mismatch banner never poisons another language's cached HTML
 *
 * Note: RSC requests (client-side navigation) are not cached, only HTML requests.
 */

import { readCookie } from "@/lib/cookies";
import { LOCALE_PREF_COOKIE_NAME } from "@/lib/i18n/config";
import { localeCacheBucket } from "@/lib/i18n/localeBanner";

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
 * Query params carrying the cache-key dimensions that aren't in the URL.
 *
 * They must be query params rather than a `#deployId@bucket` suffix: the Cache
 * API parses the key as a URL, and a URL fragment is not part of a request's
 * identity, so anything after `#` is discarded before the lookup. Written that
 * way, neither the deploy ID nor the locale bucket reached the key at all, and
 * entries outlived the deploy that produced them.
 *
 * Double-underscored so they can't collide with a real param, and absent from
 * ALLOWED_PARAMS so a visitor can't forge one and pick their own cache entry.
 */
const DEPLOY_PARAM = "__deploy";
const LANG_PARAM = "__lang";

/**
 * Generate a cache key for the Cache API
 *
 * Format: https://jiki.io/blog/post?page=1&__deploy=abc1234&__lang=en
 *
 * Components:
 * - Origin and pathname (preserves locale)
 * - Normalized query params (page, criteria)
 * - Deploy ID (git SHA)
 * - Locale bucket (the banner's offered language: "en" | "hu" | "none")
 *
 * The key is an absolute URL because the Cache API resolves it via `new
 * Request(key)`, which rejects a relative one. It is built on the incoming
 * request's own origin, so it is never used to address anything but this zone.
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
  const langBucket = localeCacheBucket(
    request.headers.get("accept-language"),
    readCookie(request.headers.get("Cookie"), LOCALE_PREF_COOKIE_NAME)
  );

  // normalizeSearchParams has already filtered and sorted the visitor's params;
  // appending the two internal ones after keeps the whole key deterministic.
  const key = new URL(`${url.pathname}${normalizedParams}`, url.origin);
  key.searchParams.set(DEPLOY_PARAM, deployId);
  key.searchParams.set(LANG_PARAM, langBucket);

  return key.toString();
}
