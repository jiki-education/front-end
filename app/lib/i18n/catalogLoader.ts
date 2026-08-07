import { appMessagesPath, appMessagesPointerPath } from "@/lib/assets-paths";
import { messageHashes } from "@/lib/generated/messages-hashes";
import { createHashResolver, type ResolveUrl } from "./catalogPointer";

// UI catalogs are fetched from R2 (the content-hashed cache tree) rather than
// bundled into the worker, so the shipped bundle no longer grows with the locale
// count. This module builds the loader shared by the two fetch sites —
// `lib/i18n/request.ts` (SSR) and `ClientLocaleProvider` (client-side locale
// swaps) — which differ only in how a `/static/...` path resolves to a URL.
//
// The hash that names the artifact is resolved by `lib/i18n/catalogPointer.ts`:
// compiled in for English, read at runtime from the locale's pointer file for
// every other locale, so a translation published by the i18n repo goes live
// without a front-end rebuild.

export type { ResolveUrl };

/**
 * Build a catalog loader with its own promise cache keyed `${locale}:${hash}`.
 * The artifact at a given hash is immutable, so a resolved entry is always valid
 * and is reused for every later call (concurrent calls share one in-flight
 * fetch). A rejected fetch is evicted so the next call retries rather than
 * caching the failure forever.
 *
 * The hash itself is NOT cached here for non-English locales — that is the
 * pointer's job, and caching it would defeat the point of resolving it at
 * runtime. A republished locale therefore resolves to a new key and loads the
 * new artifact, while the old entry simply goes unused.
 *
 * There is NO bundled fallback (deliberate): a catalog that cannot load rejects
 * loudly, never silently renders English.
 */
export function createCatalogLoader(resolveUrl: ResolveUrl): (locale: string) => Promise<Record<string, unknown>> {
  const cache = new Map<string, Promise<Record<string, unknown>>>();
  const resolveHash = createHashResolver({
    label: "UI message catalog",
    compiledHashes: () => messageHashes,
    pointerPath: appMessagesPointerPath,
    resolveUrl
  });

  return function loadCatalog(locale: string): Promise<Record<string, unknown>> {
    return resolveHash(locale).then((hash) => {
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
    });
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
