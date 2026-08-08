// Every locale the codebase knows about: types, message catalogs (messages/*.json)
// and localized content are all authored against this full set, regardless of
// which locales a given environment actually serves. `Locale` is derived from
// this, so a locale's types and content stay valid even when it isn't served.
import { BUILD_DEPLOY_ENV } from "./env";

// ┌──────────────────────────────────────────────────────────────────────────┐
// │ STAGING PREVIEW ONLY. THIS BRANCH IS DEPLOYED, NEVER MERGED.             │
// │ branch: translatathon-2-serve-all-locales                                │
// └──────────────────────────────────────────────────────────────────────────┘
//
// The list below is every locale the i18n repo translates into (the `targets` in
// its `locales.json`), rather than the locales this app is ready to serve. It
// exists so one staging deploy renders all 33 languages at once for translation
// review, and for nothing else.
//
// Why it must not merge. `SUPPORTED_LOCALES` below serves the full set in dev
// AND on staging, so widening this widens `next dev` for everyone, not just this
// deploy. It also puts 32 locales into the hreflang alternates, the edge cache
// key space and the locale banner's Accept-Language matching, none of which have
// been reviewed for them. Production is spared only because it is pinned to
// `PRODUCTION_LOCALES`, and that pin is the single thing in the way.
//
// The branch exists to be SAT UNDER the work that does merge, never to merge
// itself. Rebase that work off this branch before landing it, which is why this
// change is one self-contained commit touching as few files as it can.
//
// The real change, when it comes, is one locale at a time: add it here once its
// catalogs are published, and to `PRODUCTION_LOCALES` once i18n reports it
// complete. Do not merge this list wholesale.
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
  "fi",
  "fr",
  "he",
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
  "th",
  "tr",
  "uk",
  "ur",
  "vi",
  "zh-CN",
  "zh-TW"
] as const;
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

// Locales that read right-to-left, so `<html dir>` flips to "rtl" for them.
//
// These are the four RTL scripts in the target set: Arabic, Persian and Urdu all
// use the Arabic script, and Hebrew the Hebrew script. Nothing else in the list
// is RTL. This is not optional alongside the expansion above: without it those
// four render left-to-right and the staging preview is worthless for exactly the
// languages hardest to review.
export const RTL_LOCALES: ReadonlySet<Locale> = new Set<Locale>(["ar", "fa", "he", "ur"]);

// Text direction for a locale: "rtl" for locales in RTL_LOCALES, "ltr" otherwise
// (including any unknown/unsupported string). Drives `dir` on `<html>` (server via
// layout, client via ClientLocaleProvider on locale swap).
export function getLocaleDirection(locale: Locale | string): "ltr" | "rtl" {
  return RTL_LOCALES.has(locale as Locale) ? "rtl" : "ltr";
}
