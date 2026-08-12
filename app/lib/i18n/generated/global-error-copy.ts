// GENERATED FILE — DO NOT EDIT.
//
// Written by `pnpm global-error-copy:generate` from the app UI catalogs: English
// from this repo's `messages.json`, every other locale from the i18n repo's copy
// of it. Edit the catalogs, not this file, and commit what regenerating produces.
//
// It is committed rather than gitignored because `app/global-error.tsx` renders
// after the app has already failed and cannot fetch anything, and no build has an
// i18n checkout. See scripts/generate-global-error-copy.js for the full reasoning.

export interface GlobalErrorCopy {
  title: string;
  message: string;
  actionLabel: string;
}

/**
 * Deliberately keyed by `string` rather than `Record<Locale, ...>`: an exhaustive
 * map would make every new locale a compile error in a file nobody should be
 * editing, which is the coupling this generation removed. A locale with no entry
 * falls back to English at runtime, and `pnpm locale:check` reports it as a gap
 * alongside every other locale problem.
 */
export const GLOBAL_ERROR_COPY: Readonly<Record<string, GlobalErrorCopy>> = {
  en: {
    title: "Something went wrong",
    message: "We encountered an unexpected error. Sorry about that!",
    actionLabel: "Try again"
  },
  hu: {
    title: "Valami hiba történt",
    message: "Váratlan hiba lépett fel. Elnézést kérünk emiatt!",
    actionLabel: "Próbáld újra"
  },
  it: {
    title: "Qualcosa è andato storto",
    message: "Si è verificato un errore imprevisto. Ci dispiace!",
    actionLabel: "Riprova"
  }
};
