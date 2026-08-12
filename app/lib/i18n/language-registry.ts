/**
 * THE roster of languages, and the one place a language's lifecycle is recorded.
 *
 * Everything else about which locales exist is derived from this file: the
 * `Locale` type, `ALL_LOCALES`, `PRODUCTION_LOCALES`, the generated
 * `production-locales.json` the deploy gate reads, the generated global-error
 * copy, and the language switcher's two groups. Launching a locale is therefore
 * one word in this file plus `pnpm locales:generate`, and `pnpm locale:check`
 * lists everything that word implies and has not been done yet.
 *
 * ## Why this file imports nothing
 *
 * Two consumers, and both constrain it:
 *
 *   - `lib/locales.ts` derives `Locale` from it, so the array must stay a
 *     TypeScript `as const` literal. A JSON import is `string[]`, which cannot
 *     produce a literal union, and that is the whole reason this roster is not
 *     just data.
 *   - `scripts/lib/language-registry.js` reads it from plain node, to
 *     generate `production-locales.json`. It does that by handing this file to
 *     the TypeScript compiler's `transpileModule` and evaluating the result,
 *     which works only while this module has no imports of its own.
 *
 * So: no imports here, ever, and no logic beyond the roster and the types
 * derived from it. Anything that needs to reach for another module belongs in
 * `lib/locales.ts` or `lib/i18n/languages.ts`.
 *
 * ## The three statuses
 *
 * The lifecycle is a ladder and each rung strictly contains the one above it:
 *
 *   - `advertised` — the switcher lists it as "coming soon". The app cannot
 *     serve it: no `Locale` member, no `[locale]` route, no catalog. Most of
 *     the roster sits here, mirroring the i18n categories on the forum
 *     (forum.jiki.io/c/i18n).
 *   - `known` — the codebase knows the locale: it is in `ALL_LOCALES`, so it is
 *     a `Locale`, it routes, and `next dev` and STAGING serve it. Production
 *     does not. This is the rung a locale sits on while its translation is
 *     being reviewed, which is what staging exists for.
 *   - `production` — also served in production. A locale reaches this rung only
 *     once the i18n repo reports it complete, which
 *     `scripts/verify-locale-completeness.js` checks against that repo's own
 *     published record.
 *
 * Codes match `translator/languages/names.json` and the API's
 * `I18n::SUPPORTED_LOCALES`, in canonical BCP-47 casing (`pt-BR`, not `pt-br`).
 * The casing is load-bearing: the code is also the URL segment, the catalog
 * filename and the locale directory in the i18n repo.
 */

export type LanguageStatus = "advertised" | "known" | "production";

export interface LanguageEntry {
  /** Locale/URL code, e.g. "pt-BR". */
  code: string;
  /**
   * Basename in `public/static/images/flags`, named by **country** not language:
   * several languages share a flag, and two share the globe.
   *
   * The set is [country-flag-icons](https://github.com/catamphetamine/country-flag-icons)
   * (MIT) `3x2`, chosen over flag-icons because its coat-of-arms flags are two
   * orders of magnitude smaller (Serbia 180KB -> 861B) and the detail they drop is
   * invisible at the 21px these render at. `world.svg` is Wikimedia's World Flag
   * (2004), for the languages too widely spoken for one country's flag to be honest.
   */
  flag: string;
  /**
   * Code used only for the display name, when it differs from the routing code.
   * "zh-CN" reads as "Chinese (China)", where "zh-Hans" reads "Simplified
   * Chinese" — the label the forum uses and the one that means something to a
   * reader choosing a language.
   */
  displayCode?: string;
  /** Lifecycle rung. See the three statuses above. */
  status: LanguageStatus;
}

export const LANGUAGES = [
  { code: "en", flag: "gb", status: "production" },
  { code: "ar", flag: "world", status: "advertised" },
  { code: "bn", flag: "bd", status: "advertised" },
  { code: "ca", flag: "ad", status: "advertised" },
  { code: "de", flag: "de", status: "advertised" },
  { code: "el", flag: "gr", status: "advertised" },
  { code: "es-419", flag: "world", status: "advertised" },
  { code: "es-ES", flag: "es", status: "advertised" },
  { code: "fa", flag: "ir", status: "advertised" },
  { code: "fi", flag: "fi", status: "advertised" },
  { code: "fr", flag: "fr", status: "advertised" },
  { code: "he", flag: "il", status: "advertised" },
  { code: "hi", flag: "in", status: "advertised" },
  { code: "hu", flag: "hu", status: "production" },
  { code: "id", flag: "id", status: "advertised" },
  { code: "it", flag: "it", status: "production" },
  { code: "ja", flag: "jp", status: "advertised" },
  { code: "ko", flag: "kr", status: "advertised" },
  { code: "nl", flag: "nl", status: "advertised" },
  { code: "pl", flag: "pl", status: "advertised" },
  { code: "pt-BR", flag: "br", status: "advertised" },
  { code: "pt-PT", flag: "pt", status: "advertised" },
  { code: "ro", flag: "ro", status: "advertised" },
  { code: "ru", flag: "ru", status: "advertised" },
  { code: "sr", flag: "rs", status: "advertised" },
  { code: "sv", flag: "se", status: "advertised" },
  { code: "sw", flag: "tz", status: "advertised" },
  { code: "th", flag: "th", status: "advertised" },
  { code: "tr", flag: "tr", status: "advertised" },
  { code: "uk", flag: "ua", status: "advertised" },
  { code: "ur", flag: "pk", status: "advertised" },
  { code: "vi", flag: "vn", status: "advertised" },
  { code: "zh-CN", flag: "cn", displayCode: "zh-Hans", status: "advertised" },
  { code: "zh-TW", flag: "tw", displayCode: "zh-Hant", status: "advertised" }
] as const satisfies readonly LanguageEntry[];

type RosterEntry = (typeof LANGUAGES)[number];

/**
 * Every locale the codebase knows about: the `known` and `production` rungs.
 *
 * A literal union, derived from the `as const` roster above rather than written
 * out, so it cannot drift from it. Types, message catalogs and localized content
 * are all authored against this full set regardless of what a given environment
 * serves, which is what keeps a `known` locale's types and content valid while
 * it is still only on staging.
 */
export type Locale = Extract<RosterEntry, { status: "known" | "production" }>["code"];

/** The locales production serves. A subset of `Locale`, by construction. */
export type ProductionLocale = Extract<RosterEntry, { status: "production" }>["code"];

type KnownEntry = Extract<RosterEntry, { status: "known" | "production" }>;
type ProductionEntry = Extract<RosterEntry, { status: "production" }>;

function isKnown(language: RosterEntry): language is KnownEntry {
  return language.status !== "advertised";
}

function isProduction(language: RosterEntry): language is ProductionEntry {
  return language.status === "production";
}

/** Runtime counterparts of the two types above, in roster order. */
export const KNOWN_LOCALES: readonly Locale[] = LANGUAGES.filter(isKnown).map((language) => language.code);
export const ROSTER_PRODUCTION_LOCALES: readonly ProductionLocale[] = LANGUAGES.filter(isProduction).map(
  (language) => language.code
);
