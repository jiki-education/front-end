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
