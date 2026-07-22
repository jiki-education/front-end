// Every locale the codebase knows about: types, message catalogs (messages/*.json)
// and localized content are all authored against this full set, regardless of
// which locales a given environment actually serves. `Locale` is derived from
// this, so hu types/content stay valid even when hu isn't served.
export const ALL_LOCALES = ["en", "hu"] as const;
export type Locale = (typeof ALL_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

// Locales actually served in this environment. Production ships English only for
// now; local development serves the full set so the localization work stays
// testable. `NODE_ENV` is statically inlined by Next in both the server and
// client bundles, so this resolves identically on the edge and in the browser.
//
// Note: any built/deployed environment (including staging/preview) reports
// `NODE_ENV === "production"`, so those are en-only too; only `next dev` gets hu.
export const SUPPORTED_LOCALES: readonly Locale[] = process.env.NODE_ENV === "production" ? ["en"] : ALL_LOCALES;

// Locales that read right-to-left. Empty today: both en and hu are LTR. When an
// RTL locale (e.g. Arabic "ar", Hebrew "he") is added to ALL_LOCALES, add it
// here too so `<html dir>` flips to "rtl" for it.
export const RTL_LOCALES: ReadonlySet<Locale> = new Set([]);

// Text direction for a locale: "rtl" for locales in RTL_LOCALES, "ltr" otherwise
// (including any unknown/unsupported string). Drives `dir` on `<html>` (server via
// layout, client via ClientLocaleProvider on locale swap).
export function getLocaleDirection(locale: Locale | string): "ltr" | "rtl" {
  return RTL_LOCALES.has(locale as Locale) ? "rtl" : "ltr";
}
