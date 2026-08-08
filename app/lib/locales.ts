// Every locale the codebase knows about: types, message catalogs (messages/*.json)
// and localized content are all authored against this full set, regardless of
// which locales a given environment actually serves. `Locale` is derived from
// this, so hu types/content stay valid even when hu isn't served.
import { BUILD_DEPLOY_ENV } from "./env";

export const ALL_LOCALES = ["en", "hu"] as const;
export type Locale = (typeof ALL_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

// Locales complete enough to serve in PRODUCTION.
//
// A locale reaches this list only once the i18n repo reports it complete, which
// `pnpm locales:verify` checks. That is the one place strictness belongs:
// publishing is deliberately permissive, so work in progress reaches R2 and can
// be reviewed, and this is what stops a half-translated locale being served to a
// reader who has no way to tell.
export const PRODUCTION_LOCALES: readonly Locale[] = ["en"];

// Locales actually served in this environment.
//
// THREE tiers, not two. `next dev` and staging both serve the FULL set, because
// both exist to look at work in progress; only production is restricted to the
// complete ones. Staging serving incomplete locales is the whole point of
// staging for translation review, and it used to be impossible: every built
// environment reports `NODE_ENV === "production"`, so staging and production
// were indistinguishable here.
//
// Both tests resolve at BUILD time, which they must: this is read on the client
// as well as the server, so a runtime Worker var could not answer it. See
// BUILD_DEPLOY_ENV in lib/env.ts for why that one is available and `ENVIRONMENT`
// is not.
export const SUPPORTED_LOCALES: readonly Locale[] =
  process.env.NODE_ENV !== "production" || BUILD_DEPLOY_ENV === "staging" ? ALL_LOCALES : PRODUCTION_LOCALES;

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
