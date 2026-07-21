import { DEFAULT_LOCALE, getLocaleDirection, RTL_LOCALES, SUPPORTED_LOCALES, type Locale } from "@/lib/locales";

export { DEFAULT_LOCALE, getLocaleDirection, RTL_LOCALES, SUPPORTED_LOCALES };
export type { Locale };

// Cookie that carries the active UI locale into SSR/edge requests. Written when
// the user changes their locale (which also persists to the Rails preference);
// read by resolveLocale() since the Rails value isn't synchronously available
// to the edge runtime on every request.
export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

// Fixed time zone next-intl formats dates in, on both the server (UTC on the
// Cloudflare Worker) and the client. Pinning it avoids hydration mismatches and
// the ENVIRONMENT_FALLBACK warning. Shared by the server request config
// (request.ts) and the client provider (ClientLocaleProvider) so they can't
// drift. Site dates are mostly date-only blog/article dates, so a fixed zone is
// correct; a per-user zone can come later from /me.
export const DEFAULT_TIME_ZONE = "UTC";

// Request header set by middleware to the URL's locale segment (e.g. "hu" for
// /hu/blog). Read by resolveLocale() so an explicit URL locale wins over the
// cookie. Middleware always sets or clears it from the trusted path, so it can't
// be spoofed by a client-supplied header.
export const URL_LOCALE_HEADER = "x-url-locale";

// Request header set by middleware to the request pathname, so server components
// (e.g. the locale banner) can read the current path.
export const PATHNAME_HEADER = "x-pathname";

// Public sections: an index plus detail pages, matched by prefix (/blog,
// /blog/my-post). Cacheable and locale-routed, in naked and locale-prefixed form.
export const PUBLIC_SECTIONS = ["/blog", "/help", "/guides", "/concepts", "/build", "/projects"] as const;

// Public single pages, matched exactly (no sub-paths). Cacheable and locale-routed.
export const PUBLIC_PAGES = ["/premium", "/roadmap", "/testimonials"] as const;

/**
 * Flows that are reachable logged-out and localized like the public pages, but are
 * never edge-cached: auth carries OAuth/CSRF state, and delete-account/unsubscribe
 * carry per-user tokens the cache key would strip (a shared entry would leak across
 * users). Hence they drive routing/link-building but not `isCacheableRoute`.
 */
export const UNCACHED_FLOWS = ["/auth", "/delete-account", "/unsubscribe"] as const;

/**
 * Path bases (with any locale segment stripped) that have a `[locale]` route tree
 * and participate in locale prefixing. Add a base here only once the corresponding
 * `app/(hybrid)/[locale]/<base>` (or `(external)/[locale]/<base>`) route exists.
 *
 * This is the single source of truth shared by middleware locale routing
 * (`resolveLocaleRouting`) and link-building (`localePath`): a path not listed here
 * has no `[locale]` tree (e.g. the auth-gated `/dashboard`, `/settings`), so it is
 * served — and linked — naked in every locale.
 */
export const LOCALIZABLE_BASES = [...PUBLIC_SECTIONS, ...PUBLIC_PAGES, ...UNCACHED_FLOWS] as const;

export function isLocalizableBase(basePath: string): boolean {
  return LOCALIZABLE_BASES.some((base) => basePath === base || basePath.startsWith(`${base}/`));
}

export function isSupportedLocale(value: string | undefined | null): value is Locale {
  return value != null && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/**
 * The canonically-cased supported locale matching `value` case-insensitively
 * (e.g. "pt-br" -> "pt-BR"), or undefined when it isn't a locale at all. URL
 * paths are case-sensitive (RFC 3986), so a miscased locale segment isn't a
 * page of its own; middleware uses this to 308 it to the canonical casing.
 */
export function matchLocaleIgnoringCase(value: string): Locale | undefined {
  const lower = value.toLowerCase();
  return SUPPORTED_LOCALES.find((locale) => locale.toLowerCase() === lower);
}

export function normalizeLocale(value: string | undefined | null): Locale {
  return isSupportedLocale(value) ? value : DEFAULT_LOCALE;
}

/**
 * Strip a leading supported-locale segment, returning the naked base path
 * ("/hu/blog" -> "/blog", "/hu" -> "/", "/blog" -> "/blog"). Driven by
 * SUPPORTED_LOCALES, so it handles any locale including region subtags (e.g.
 * "pt-BR") and never strips an unsupported segment. Use this instead of ad-hoc
 * `/[a-z]{2}/` regexes so locale-prefix handling stays config-driven.
 */
export function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split("/");
  if (isSupportedLocale(segments[1])) {
    return `/${segments.slice(2).join("/")}`;
  }
  return pathname;
}
