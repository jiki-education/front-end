import { useLocale } from "next-intl";
import { DEFAULT_LOCALE, normalizeLocale } from "./config";
import { FORUM_URL } from "@/lib/constants/social";

/**
 * Locale-aware forum URL. The forum (Discourse) is a separate app, so it can't
 * use `localePath`'s in-app path-prefix scheme; Discourse instead reads locale
 * from a `tl` query param (site setting "set locale from param" must be enabled
 * on the forum for this to take effect). The default locale is omitted, matching
 * `localePath`'s "default locale is naked" convention.
 */
export function forumUrl(locale: string): string {
  const activeLocale = normalizeLocale(locale);
  if (activeLocale === DEFAULT_LOCALE) {
    return FORUM_URL;
  }
  return `${FORUM_URL}?tl=${activeLocale}`;
}

/**
 * `forumUrl` bound to the ambient UI locale via next-intl's sync `useLocale()`.
 * Works in both client components and synchronously-rendered server components.
 */
export function useForumUrl(): string {
  return forumUrl(useLocale());
}
