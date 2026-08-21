// Every locale the codebase knows about: types, message catalogs (messages/*.json)
// and localized content are all authored against this full set, regardless of
// which locales a given environment actually serves. `Locale` is derived from
// this, so hu types/content stay valid even when hu isn't served.
import { BUILD_DEPLOY_ENV } from "./env";
import productionLocales from "./production-locales.json";

export const ALL_LOCALES = ["en", "bn", "el", "es-419", "es-ES", "fr", "hu", "it", "pt-PT", "pt-BR", "uk"] as const;
export type Locale = (typeof ALL_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

// Locales complete enough to serve in PRODUCTION.
//
// A locale reaches this list only once the i18n repo reports it complete, which
// `pnpm locales:verify` checks. That is the one place strictness belongs:
// publishing is deliberately permissive, so work in progress reaches R2 and can
// be reviewed, and this is what stops a half-translated locale being served to a
// reader who has no way to tell.
//
// It lives in JSON so the deploy gate can read the same bytes this module does.
// That gate runs as a plain node script before the build, so it cannot import
// from here without pulling in a TypeScript module graph, and it used to find
// this list by matching a regex against this file. That regex could start at a
// mention of the name in a comment and run on to the next array, which made it
// read ALL_LOCALES while believing it had read this. One file, two readers, no
// parsing.
//
// ALL_LOCALES stays in TypeScript because `Locale` is derived from it, and a JSON
// import is `string[]` rather than a literal union.
export const PRODUCTION_LOCALES: readonly Locale[] = productionLocales as readonly Locale[];

// A production locale the codebase does not know is not a locale: no `Locale`
// type, no route, no catalog. The array type cannot enforce that once the values
// come from JSON, so it is asserted here, at import, which fails the build rather
// than a request. The failure this prevents is silent: a stray space or the wrong
// casing (`pt-pt` for `pt-PT`) yields an entry that is in the production list and
// serves nothing.
const unknownProductionLocales = productionLocales.filter((locale) => !ALL_LOCALES.includes(locale as Locale));
if (unknownProductionLocales.length > 0) {
  throw new Error(
    `production-locales.json lists locales the codebase does not know: ${unknownProductionLocales.join(", ")}. ` +
      `Add them to ALL_LOCALES first, or correct the spelling.`
  );
}

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
