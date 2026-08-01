import { appMessagesPath } from "@/lib/assets-paths";
import { messageHashes } from "@/lib/generated/messages-hashes";

// UI catalogs are fetched from R2 (the content-hashed cache tree) rather than
// bundled into the worker, so the shipped bundle no longer grows with the locale
// count. This module builds the loader shared by the two fetch sites —
// `lib/i18n/request.ts` (SSR) and `ClientLocaleProvider` (client-side locale
// swaps) — which differ only in how a `/static/...` path resolves to a URL.

/** Resolves a cache-tree path to a fetchable URL (sync on the client, async on the server). */
type ResolveUrl = (path: string) => string | Promise<string>;

// Catalog served for any locale that has no authored catalog of its own. Kept as a
// literal rather than imported from lib/locales to avoid a cycle, and because this
// is about which catalog FILE exists, not which locale is served.
const FALLBACK_CATALOG_LOCALE = "en";

/**
 * Build a catalog loader with its own promise cache keyed `${locale}:${hash}`.
 * The hash is immutable per build, so a resolved entry is always valid and is
 * reused for every later call (concurrent calls share one in-flight fetch). A
 * rejected fetch is evicted so the next call retries rather than caching the
 * failure forever.
 *
 * There is NO bundled fallback (deliberate): a catalog that cannot load rejects
 * loudly, never silently renders English.
 */
export function createCatalogLoader(resolveUrl: ResolveUrl): (locale: string) => Promise<Record<string, unknown>> {
  const cache = new Map<string, Promise<Record<string, unknown>>>();

  return function loadCatalog(requested: string): Promise<Record<string, unknown>> {
    // STAGING-ONLY BRANCH — DO NOT MERGE TO MAIN.
    //
    // SUPPORTED_LOCALES now serves every locale the curriculum translates, but the
    // app only authors UI catalogs for a couple of them (messages/*.json). Without
    // this fallback a locale with no catalog of its own rejects, and since there is
    // no bundled fallback that fails the whole request — /fr/blog would 500 rather
    // than render. Falling back to English lets the locale routing, hreflang and
    // /internal/me `locales` wiring be tested ahead of the catalogs existing.
    //
    // The consequence is that an untranslated locale renders English UI strings
    // under its own locale route, which is exactly why this must not reach
    // production: there it would silently serve English instead of failing loudly.
    const locale = messageHashes[requested] ? requested : FALLBACK_CATALOG_LOCALE;

    const hash = messageHashes[locale];
    if (!hash) {
      return Promise.reject(new Error(`No UI message catalog hash for locale "${locale}"`));
    }

    const key = `${locale}:${hash}`;
    const cached = cache.get(key);
    if (cached) {
      return cached;
    }

    const promise = fetchCatalog(resolveUrl, locale, hash).catch((error: unknown) => {
      cache.delete(key);
      throw error;
    });
    cache.set(key, promise);
    return promise;
  };
}

// Fetch the catalog with ONE retry, then throw.
async function fetchCatalog(resolveUrl: ResolveUrl, locale: string, hash: string): Promise<Record<string, unknown>> {
  const url = await resolveUrl(appMessagesPath(locale, hash));

  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return (await res.json()) as Record<string, unknown>;
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(`Failed to fetch UI message catalog for locale "${locale}": ${String(lastError)}`);
}
