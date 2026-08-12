// The locale sets the app runs on. All three are DERIVED from the language
// roster in lib/i18n/language-registry.ts, which is the one place a locale's
// lifecycle is recorded; nothing here is a second list to keep in step.
//
// Every locale the codebase knows about (`ALL_LOCALES`) is the roster's `known`
// and `production` rungs. Types, message catalogs (messages.json) and localized
// content are authored against that full set regardless of which locales a given
// environment actually serves, so a locale's types and content stay valid while
// it is still only on staging.
import { BUILD_DEPLOY_ENV } from "./env";
import { KNOWN_LOCALES, ROSTER_PRODUCTION_LOCALES, type Locale } from "./i18n/language-registry";
import productionLocales from "./production-locales.json";

export type { Locale };

export const ALL_LOCALES: readonly Locale[] = KNOWN_LOCALES;

export const DEFAULT_LOCALE: Locale = "en";

// Locales complete enough to serve in PRODUCTION.
//
// A locale reaches this list only once the i18n repo reports it complete, which
// `pnpm locales:verify` checks. That is the one place strictness belongs:
// publishing is deliberately permissive, so work in progress reaches R2 and can
// be reviewed, and this is what stops a half-translated locale being served to a
// reader who has no way to tell.
//
// The VALUES come from the roster, like everything else here.
// `production-locales.json` still exists, but it is now GENERATED from the
// roster by `pnpm locales:generate` and checked in, so the deploy gate can read
// the same set this module derives. That gate runs as a plain node script before
// the build, so it cannot import from here without pulling in a TypeScript
// module graph, and it used to find this list by matching a regex against this
// file. That regex could start at a mention of the name in a comment and run on
// to the next array, which made it read ALL_LOCALES while believing it had read
// this. One roster, two readers, no parsing on the reading side.
//
// The roster stays in TypeScript because `Locale` is derived from it, and a JSON
// import is `string[]` rather than a literal union.
export const PRODUCTION_LOCALES: readonly Locale[] = ROSTER_PRODUCTION_LOCALES;

// The generated JSON must still say what the roster says.
//
// It is generated, so it cannot list a locale the codebase does not know the way
// a hand-edited file could. What it CAN be is stale: regenerated output that was
// never re-run after the roster changed, leaving the deploy gate checking a
// different set from the one the app serves. `pnpm locale:check` is the primary
// guard (it reports this alongside every other locale problem, in one message);
// this assertion is the backstop, and it fires at import so it fails the build
// rather than a request.
const generated = productionLocales as readonly string[];
const drifted =
  generated.length !== PRODUCTION_LOCALES.length ||
  PRODUCTION_LOCALES.some((locale, index) => generated[index] !== locale);
if (drifted) {
  throw new Error(
    `lib/production-locales.json is out of date: it says [${generated.join(", ")}] where the language ` +
      `roster says [${PRODUCTION_LOCALES.join(", ")}]. Run \`pnpm locales:generate\` and commit the result.`
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

// Locales that read right-to-left. Empty today: en, hu and it are all LTR. When
// an RTL locale (e.g. Arabic "ar", Hebrew "he") reaches the roster's `known`
// rung, add it here too so `<html dir>` flips to "rtl" for it.
export const RTL_LOCALES: ReadonlySet<Locale> = new Set([]);

// Text direction for a locale: "rtl" for locales in RTL_LOCALES, "ltr" otherwise
// (including any unknown/unsupported string). Drives `dir` on `<html>` (server via
// layout, client via ClientLocaleProvider on locale swap).
export function getLocaleDirection(locale: Locale | string): "ltr" | "rtl" {
  return RTL_LOCALES.has(locale as Locale) ? "rtl" : "ltr";
}
