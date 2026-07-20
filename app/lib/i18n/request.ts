import { getRequestConfig } from "next-intl/server";
import { appMessagesPath } from "@/lib/assets-paths";
import { assetsUrl } from "@/lib/server/origin";
import { messageHashes } from "@/lib/generated/messages-hashes";
import { DEFAULT_TIME_ZONE, isSupportedLocale } from "./config";
import { resolveLocale } from "./resolveLocale";

// UI catalogs are fetched from R2 (the content-hashed cache tree) rather than
// bundled into the worker, so the shipped bundle no longer grows with the locale
// count. This module-scope cache holds the in-flight/settled catalog fetch per
// `${locale}:${hash}`; the hash is immutable per build, so a resolved entry is
// always valid and is reused across requests on a warm isolate. A rejected fetch
// is evicted (see below) so the next request retries rather than caching failure.
const catalogCache = new Map<string, Promise<Record<string, unknown>>>();

async function loadMessages(locale: string): Promise<Record<string, unknown>> {
  const hash = messageHashes[locale];
  if (!hash) {
    throw new Error(`No UI message catalog hash for locale "${locale}"`);
  }

  const key = `${locale}:${hash}`;
  const cached = catalogCache.get(key);
  if (cached) {
    return cached;
  }

  const promise = fetchCatalog(locale, hash).catch((error) => {
    catalogCache.delete(key);
    throw error;
  });
  catalogCache.set(key, promise);
  return promise;
}

// Fetch the catalog with ONE retry. There is NO bundled fallback (deliberate): a
// UI locale that cannot load must fail the request loudly, never silently render
// English.
async function fetchCatalog(locale: string, hash: string): Promise<Record<string, unknown>> {
  const url = await assetsUrl(appMessagesPath(locale, hash));

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

export default getRequestConfig(async ({ requestLocale }) => {
  // An explicit locale (e.g. getTranslations({ locale }) for the locale banner,
  // which renders in the offered language) takes precedence; otherwise resolve
  // it from the request (URL/cookie/default).
  const requested = await requestLocale;
  const locale = isSupportedLocale(requested) ? requested : await resolveLocale();

  return {
    locale,
    messages: await loadMessages(locale),
    timeZone: DEFAULT_TIME_ZONE
  };
});
