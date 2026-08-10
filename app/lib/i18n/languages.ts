import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./config";

/**
 * Every language Jiki is being translated into, mirroring the i18n categories on
 * the forum (forum.jiki.io/c/i18n) — which is also where the flag choices come
 * from. Codes match `translator/languages/names.json`.
 *
 * Deliberately NOT typed as `Locale`: all but a couple of these have no message
 * catalog and no `[locale]` route yet. `Locale` stays the set the app can
 * actually serve (`lib/locales.ts`); this is the wider set the switcher advertises.
 * `isLive()` is the join between the two.
 */
export interface Language {
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
}

const LANGUAGES: readonly Language[] = [
  { code: "en", flag: "gb" },
  { code: "ar", flag: "world" },
  { code: "bn", flag: "bd" },
  { code: "ca", flag: "ad" },
  { code: "de", flag: "de" },
  { code: "el", flag: "gr" },
  { code: "es-419", flag: "world" },
  { code: "es-ES", flag: "es" },
  { code: "fa", flag: "ir" },
  { code: "fi", flag: "fi" },
  { code: "fr", flag: "fr" },
  { code: "he", flag: "il" },
  { code: "hi", flag: "in" },
  { code: "hu", flag: "hu" },
  { code: "id", flag: "id" },
  { code: "it", flag: "it" },
  { code: "ja", flag: "jp" },
  { code: "ko", flag: "kr" },
  { code: "nl", flag: "nl" },
  { code: "pl", flag: "pl" },
  { code: "pt-BR", flag: "br" },
  { code: "pt-PT", flag: "pt" },
  { code: "ro", flag: "ro" },
  { code: "ru", flag: "ru" },
  { code: "sr", flag: "rs" },
  { code: "sv", flag: "se" },
  { code: "sw", flag: "tz" },
  { code: "th", flag: "th" },
  { code: "tr", flag: "tr" },
  { code: "uk", flag: "ua" },
  { code: "ur", flag: "pk" },
  { code: "vi", flag: "vn" },
  { code: "zh-CN", flag: "cn", displayCode: "zh-Hans" },
  { code: "zh-TW", flag: "tw", displayCode: "zh-Hant" }
];

/** Whether this environment actually serves the language (see SUPPORTED_LOCALES). */
export function isLive(code: string): boolean {
  return (SUPPORTED_LOCALES as readonly string[]).includes(code);
}

export interface LanguageNames {
  /** The name in the language itself ("magyar"), for someone scanning for their own. */
  native: string;
  /** The English name ("Hungarian"), for everyone else. */
  english: string;
}

/**
 * Display names come from `Intl.DisplayNames` rather than a hand-kept map, so
 * they are correct in every language without us authoring 33 x 2 strings.
 *
 * `.of()` returns the input code for anything it doesn't know, so a runtime with
 * thin ICU data degrades to bare codes rather than throwing. Endonyms are
 * lowercase in many languages ("magyar", "français") — that is correct in those
 * languages and is deliberately not "fixed".
 */
export function getLanguageNames(language: Language, englishNames: Intl.DisplayNames): LanguageNames {
  const displayCode = language.displayCode ?? language.code;

  let native: string;
  try {
    native = new Intl.DisplayNames([displayCode], { type: "language" }).of(displayCode) ?? displayCode;
  } catch {
    native = displayCode;
  }

  return { native, english: englishNames.of(displayCode) ?? displayCode };
}

/** Whether a name is written in the Latin alphabet, so it has a place in an A-Z run. */
function isLatinScript(name: string): boolean {
  return /^\p{Script=Latin}/u.test(name);
}

/**
 * Order within a group: Latin-script endonyms A-Z, then the rest.
 *
 * The rows lead with the endonym, so the list has to be sorted on the endonym or
 * it reads as unsorted. That only works inside one alphabet — Arabic, Thai and
 * Chinese names have no position in a Latin sort — so those settle at the bottom
 * as their own run, ordered by English name since nothing else compares them.
 */
function compareForDisplay(a: Language, b: Language, englishNames: Intl.DisplayNames) {
  const nameA = getLanguageNames(a, englishNames);
  const nameB = getLanguageNames(b, englishNames);
  const latinA = isLatinScript(nameA.native);
  const latinB = isLatinScript(nameB.native);

  if (latinA !== latinB) return latinA ? -1 : 1;
  if (latinA) return nameA.native.localeCompare(nameB.native, "en", { sensitivity: "base" });
  return nameA.english.localeCompare(nameB.english, "en");
}

/**
 * The switcher's two groups: languages this environment serves, then the rest as
 * "coming soon".
 *
 * The live group is pinned before it is sorted: the language you are reading in
 * leads, then English as the fallback everyone can read, then the ordering above.
 * Nothing in "coming soon" can be current, so only the live group is pinned.
 */
export function getGroupedLanguages(currentCode: string): { live: Language[]; comingSoon: Language[] } {
  const englishNames = new Intl.DisplayNames(["en"], { type: "language" });
  const order = (a: Language, b: Language) => compareForDisplay(a, b, englishNames);

  const rank = (language: Language) => {
    if (language.code === currentCode) return 0;
    if (language.code === DEFAULT_LOCALE) return 1;
    return 2;
  };

  return {
    live: LANGUAGES.filter((l) => isLive(l.code)).sort((a, b) => rank(a) - rank(b) || order(a, b)),
    comingSoon: LANGUAGES.filter((l) => !isLive(l.code)).sort(order)
  };
}
