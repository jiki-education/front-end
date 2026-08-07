import { DEFAULT_LOCALE } from "@/lib/locales";

// Runtime hash resolution.
//
// A content-hashed catalog URL has to come from somewhere. Compiling the hash
// into the worker (lib/generated/*-hashes.ts) binds every translation to a
// front-end build: the i18n repo can publish a locale perfectly and the running
// worker still points at the old hash until the front-end is rebuilt and
// redeployed. Breaking that binding is the whole point of this module.
//
// The mechanism is one small MUTABLE pointer per locale at a stable path
// (`/static/i18n/<namespace>/<locale>/current.json`, `{ "hash": "..." }`). The
// hashed artifact it names is untouched and still immutable. Exactly one repo
// writes any given pointer object, so the two publishers never race:
//
//   - English:      no pointer at all. Its hash is compiled in and its artifact
//                   ships with the worker deploy, atomically. The default-locale
//                   path does ZERO runtime lookups, which matters because almost
//                   all traffic is English.
//   - Every other:  the i18n repo owns the pointer and rewrites it on publish.
//
// The pointer is edge-cached with a short TTL plus stale-while-revalidate, so
// the steady state is a cache hit and a slow origin never blocks a render. That
// edge cache is deliberately the ONLY cache in front of it: adding a second,
// in-process TTL would stack an invisible staleness window on top of a
// deliberately chosen one.
//
// Note what this does NOT do. It answers "what hash", never "what locales".
// Which locales exist stays compile-time, from ALL_LOCALES in lib/locales.ts.

/** Resolves a cache-tree path to a fetchable URL (sync on the client, async on the server). */
export type ResolveUrl = (path: string) => string | Promise<string>;

interface HashResolverOptions {
  /** Human-readable catalog name, used in error messages. */
  label: string;
  /**
   * Build-time hash manifest for a scope. Only the DEFAULT LOCALE is ever read
   * from it: every other locale resolves through the pointer, which is what
   * decouples a translation from a front-end release.
   *
   * A scope is the dimension some namespaces carry besides the locale: an
   * exercise slug for exercise catalogs, an interpreter language for interpreter
   * catalogs. Namespaces with only a locale ignore it.
   */
  compiledHashes: (scope: string | undefined) => Record<string, string> | undefined;
  /** Cache-tree path of a locale's pointer file. */
  pointerPath: (locale: string, scope: string | undefined) => string;
  resolveUrl: ResolveUrl;
}

// A hash is the first 12 hex chars of a SHA-256 (scripts/lib/cache-utils.js).
// Validating the shape keeps a truncated or HTML error-page body from being
// pasted into a URL and failing later as a confusing 404.
const HASH_PATTERN = /^[0-9a-f]{8,64}$/;

/**
 * Build a hash resolver for one catalog namespace.
 *
 * Concurrent calls for the same locale share one in-flight pointer fetch, and
 * the entry is dropped as soon as it settles: dedupe without caching, so a
 * republished pointer is picked up on the next resolution rather than pinned
 * for the isolate's lifetime.
 *
 * Every failure throws. There is no fallback to a compiled non-English hash and
 * no fallback to English, deliberately: a locale that cannot resolve must fail
 * loudly rather than silently render the wrong language.
 */
export function createHashResolver({
  label,
  compiledHashes,
  pointerPath,
  resolveUrl
}: HashResolverOptions): (locale: string, scope?: string) => Promise<string> {
  const inFlight = new Map<string, Promise<string>>();

  return function resolveHash(locale: string, scope?: string): Promise<string> {
    if (locale === DEFAULT_LOCALE) {
      const hash = compiledHashes(scope)?.[locale];
      if (!hash) {
        return Promise.reject(
          new Error(`No compiled ${label} hash for the default locale "${locale}"${scope ? ` (${scope})` : ""}`)
        );
      }
      return Promise.resolve(hash);
    }

    const key = `${scope ?? ""}:${locale}`;
    const pending = inFlight.get(key);
    if (pending) {
      return pending;
    }

    const promise = fetchPointer(label, locale, scope, pointerPath, resolveUrl).finally(() => {
      inFlight.delete(key);
    });
    inFlight.set(key, promise);
    return promise;
  };
}

async function fetchPointer(
  label: string,
  locale: string,
  scope: string | undefined,
  pointerPath: (locale: string, scope: string | undefined) => string,
  resolveUrl: ResolveUrl
): Promise<string> {
  const path = pointerPath(locale, scope);
  const url = await resolveUrl(path);

  let response: Response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new Error(`Failed to fetch the ${label} pointer for locale "${locale}" (${path}): ${String(error)}`);
  }

  if (!response.ok) {
    throw new Error(`No ${label} pointer for locale "${locale}" (${path}): HTTP ${response.status}`);
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch (error) {
    throw new Error(`Malformed ${label} pointer for locale "${locale}" (${path}): not JSON (${String(error)})`);
  }

  const hash = (body as { hash?: unknown } | null)?.hash;
  if (typeof hash !== "string" || !HASH_PATTERN.test(hash)) {
    throw new Error(`Malformed ${label} pointer for locale "${locale}" (${path}): no usable "hash" field`);
  }

  return hash;
}
