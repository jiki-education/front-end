import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./config";
import { LANGUAGES, type LanguageEntry } from "./language-registry";

/**
 * The switcher's view of the language roster.
 *
 * The roster itself (every language Jiki is being translated into, mirroring the
 * i18n categories on the forum, forum.jiki.io/c/i18n) lives in
 * `language-registry.ts`, together with each language's lifecycle status. This
 * module is only the presentation layer over it: display names, ordering, and
 * the split into "live here" and "coming soon".
 *
 * `Language` is deliberately NOT `Locale`: most of the roster is `advertised`,
 * with no message catalog and no `[locale]` route. `Locale` stays the set the
 * app can actually serve (`lib/locales.ts`, derived from the same roster);
 * `isLive()` is the join between the two.
 */
export type Language = LanguageEntry;

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
