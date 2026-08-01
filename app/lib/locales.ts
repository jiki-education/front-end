// Every locale the codebase knows about: types, message catalogs (messages/*.json)
// and localized content are all authored against this full set, regardless of
// which locales a given environment actually serves. `Locale` is derived from
// this, so hu types/content stay valid even when hu isn't served.
//
// Every locale here has a real catalog at messages/<locale>.json. `en` first
// (it is the source and the default), the rest alphabetical.
export const ALL_LOCALES = ["en", "el", "fa", "hu", "pt-BR", "pt-pt", "ru", "sr", "uk"] as const;
export type Locale = (typeof ALL_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

// Locales actually served in this environment. Production ships English only for
// now; local development serves the full set so the localization work stays
// testable. `NODE_ENV` is statically inlined by Next in both the server and
// client bundles, so this resolves identically on the edge and in the browser.
//
// Note: any built/deployed environment (including staging/preview) reports
// `NODE_ENV === "production"`, so those are en-only too; only `next dev` gets the
// non-en locales.
export const SUPPORTED_LOCALES: readonly Locale[] = process.env.NODE_ENV === "production" ? ["en"] : ALL_LOCALES;

// Locales that read right-to-left. Deliberately empty today: every locale in
// ALL_LOCALES is LTR except Persian ("fa"), which is knowingly left out until it
// has real routed content rather than just a message catalog. Adding a locale
// here is all it takes for `<html dir>` to flip to "rtl" for it.
export const RTL_LOCALES: ReadonlySet<Locale> = new Set([]);

// Text direction for a locale: "rtl" for locales in RTL_LOCALES, "ltr" otherwise
// (including any unknown/unsupported string). Drives `dir` on `<html>` (server via
// layout, client via ClientLocaleProvider on locale swap).
export function getLocaleDirection(locale: Locale | string): "ltr" | "rtl" {
  return RTL_LOCALES.has(locale as Locale) ? "rtl" : "ltr";
}
