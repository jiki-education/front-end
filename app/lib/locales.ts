// Every locale the codebase knows about: types, message catalogs (messages/*.json)
// and localized content are all authored against this full set, regardless of
// which locales a given environment actually serves. `Locale` is derived from
// this, so a locale's types/content stay valid even when it isn't served.
//
// This mirrors the locale set the curriculum package ships translations for
// (curriculum/src/**/locales/*), in canonical BCP-47 casing.
export const ALL_LOCALES = [
  "en",
  "ar",
  "bn",
  "ca",
  "de",
  "el",
  "es-419",
  "es-ES",
  "fa",
  "fr",
  "hi",
  "hu",
  "id",
  "it",
  "ja",
  "ko",
  "nl",
  "pl",
  "pt-BR",
  "pt-PT",
  "ro",
  "ru",
  "sr",
  "sv",
  "sw",
  "tr",
  "uk",
  "ur",
  "vi",
  "zh-CN",
  "zh-TW"
] as const;
export type Locale = (typeof ALL_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

// STAGING-ONLY BRANCH — DO NOT MERGE TO MAIN.
//
// Every known locale is served unconditionally so the full locale surface
// (routing, hreflang, Accept-Language negotiation, the `locales` preference list
// from /internal/me) can be exercised end-to-end on staging.jiki.io.
//
// This deliberately has no environment gate. `ENVIRONMENT=staging` cannot be used
// here: it is a Cloudflare Worker runtime var, so it exists only server-side and is
// NOT inlined into the client bundle. Gating on it would make the server serve every
// locale while the browser still believed in `en` alone, desyncing locale routing and
// link-building from SSR. `NODE_ENV` is inlined in both bundles but cannot separate
// staging from production, since staging is a production build.
//
// So the safety property here is branch discipline, not code: this branch ships to
// staging only and must never be deployed to production.
export const SUPPORTED_LOCALES: readonly Locale[] = ALL_LOCALES;

// Locales that read right-to-left, driving `dir="rtl"` on `<html>` via
// getLocaleDirection() (server-rendered in app/layout.tsx, synced client-side on
// locale swap in ClientLocaleProvider).
export const RTL_LOCALES: ReadonlySet<Locale> = new Set(["ar", "fa", "ur"]);

// Text direction for a locale: "rtl" for locales in RTL_LOCALES, "ltr" otherwise
// (including any unknown/unsupported string). Drives `dir` on `<html>` (server via
// layout, client via ClientLocaleProvider on locale swap).
export function getLocaleDirection(locale: Locale | string): "ltr" | "rtl" {
  return RTL_LOCALES.has(locale as Locale) ? "rtl" : "ltr";
}
