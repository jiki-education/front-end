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

export function isSupportedLocale(value: string | undefined | null): value is Locale {
  return value != null && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function normalizeLocale(value: string | undefined | null): Locale {
  return isSupportedLocale(value) ? value : DEFAULT_LOCALE;
}
