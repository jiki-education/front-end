import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "@/lib/locales";

export { DEFAULT_LOCALE, SUPPORTED_LOCALES };
export type { Locale };

// Cookie that carries the active UI locale into SSR/edge requests. Written when
// the user changes their locale (which also persists to the Rails preference);
// read by resolveLocale() since the Rails value isn't synchronously available
// to the edge runtime on every request.
export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

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
export const PUBLIC_SECTIONS = ["/blog", "/articles", "/concepts"] as const;

// Public single pages, matched exactly (no sub-paths). Cacheable and locale-routed.
export const PUBLIC_PAGES = ["/premium", "/roadmap", "/testimonials"] as const;

export function isSupportedLocale(value: string | undefined | null): value is Locale {
  return value != null && (SUPPORTED_LOCALES as readonly string[]).includes(value);
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
