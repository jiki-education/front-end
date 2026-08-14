import { getLanguageNames, type Language } from "@/lib/i18n/languages";

/**
 * Matched on the endonym, the English name and the code, so "magyar",
 * "Hungarian" and "hu" all find the same row — someone who cannot yet read the
 * interface still has a spelling that works.
 */
export function matchesQuery(language: Language, query: string, englishNames: Intl.DisplayNames): boolean {
  const trimmed = query.trim();
  if (!trimmed) {
    return true;
  }

  const needle = trimmed.toLocaleLowerCase();
  const { native, english } = getLanguageNames(language, englishNames);

  return (
    native.toLocaleLowerCase().includes(needle) ||
    english.toLocaleLowerCase().includes(needle) ||
    language.code.toLocaleLowerCase().includes(needle)
  );
}
