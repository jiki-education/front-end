import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "@/lib/locales";

export { DEFAULT_LOCALE, SUPPORTED_LOCALES };
export type { Locale };

// Cookie that carries the active UI locale into SSR/edge requests. Written when
// the user changes their locale (which also persists to the Rails preference);
// read by resolveLocale() since the Rails value isn't synchronously available
// to the edge runtime on every request.
export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

export function isSupportedLocale(value: string | undefined | null): value is Locale {
  return value != null && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function normalizeLocale(value: string | undefined | null): Locale {
  return isSupportedLocale(value) ? value : DEFAULT_LOCALE;
}
