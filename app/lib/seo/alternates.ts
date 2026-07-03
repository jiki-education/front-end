import type { Metadata } from "next";
import { headers } from "next/headers";
import { DEFAULT_LOCALE, PATHNAME_HEADER, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n/config";
import { localeFromPath, swapLocaleInPath } from "@/lib/i18n/localeBanner";
import { SITE_URL } from "@/lib/site";

/**
 * Build reciprocal hreflang alternates plus a self-referential canonical for a
 * page, given its locale-less (naked English) path and the locale it is being
 * served in.
 *
 * - `canonical` points at this page's own absolute URL, so each localized variant
 *   canonicalizes to itself (never hu -> en).
 * - `languages` is the same map on every variant: one entry per supported locale
 *   plus `x-default` (the default-locale URL). Absolute URLs, as hreflang requires.
 *
 * Per-locale URLs are built with `swapLocaleInPath`, which applies the site's URL
 * rule (default locale naked, others `/<locale>`-prefixed).
 */
export function buildAlternates(localelessPath: string, currentLocale: Locale): Metadata["alternates"] {
  return {
    canonical: `${SITE_URL}${swapLocaleInPath(localelessPath, currentLocale)}`,
    languages: alternateLanguages(localelessPath)
  };
}

/**
 * The reciprocal hreflang map for a locale-less path: one absolute URL per
 * supported locale plus `x-default` (the default-locale URL). Shared by page
 * metadata and the sitemap so the two never drift.
 */
export function alternateLanguages(localelessPath: string): Record<string, string> {
  const absolute = (locale: Locale) => `${SITE_URL}${swapLocaleInPath(localelessPath, locale)}`;

  const languages: Record<string, string> = { "x-default": absolute(DEFAULT_LOCALE) };
  for (const locale of SUPPORTED_LOCALES) {
    languages[locale] = absolute(locale);
  }
  return languages;
}

/**
 * Layout-level `generateMetadata` helper: derive the current path from the
 * middleware-set `x-pathname` header and emit alternates for it. Wiring this into
 * a `[locale]` tree's layout gives every page below it hreflang + canonical with
 * no per-page code, since Next merges layout metadata with each page's own.
 */
export async function alternatesFromRequest(): Promise<Metadata> {
  const headerStore = await headers();
  const pathname = headerStore.get(PATHNAME_HEADER) ?? "/";
  const currentLocale = localeFromPath(pathname);
  const localelessPath = swapLocaleInPath(pathname, DEFAULT_LOCALE);

  return { alternates: buildAlternates(localelessPath, currentLocale) };
}
