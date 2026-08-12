/**
 * Build the crash page's inlined copy: what goes into
 * `lib/i18n/generated/global-error-copy.ts`, and the exact bytes of that module.
 *
 * Separate from the generator so `check-locales.js` can regenerate in memory and
 * diff against the committed file without running (or importing the side effects
 * of) a script whose job is to write.
 *
 * The reasoning for the whole arrangement is in scripts/generate-global-error-copy.js.
 */

import { GLOBAL_ERROR_KEYS, knownLocales, readCatalog } from "./language-registry.js";

// The i18n repo marks an untranslated key with this sentinel rather than
// omitting it, so a present-but-untranslated string must not be inlined.
const UNTRANSLATED_SENTINEL = "�";

export function buildGlobalErrorCopy(i18nRepo) {
  const entries = [];
  const problems = [];

  for (const locale of knownLocales()) {
    const catalog = readCatalog(locale, i18nRepo);
    if (!catalog) {
      problems.push(`${locale}: no app UI catalog to read (looked in the i18n repo).`);
      continue;
    }

    const section = catalog.globalError;
    if (!section) {
      problems.push(`${locale}: its app UI catalog has no \`globalError\` section.`);
      continue;
    }

    const bad = GLOBAL_ERROR_KEYS.filter(
      (key) =>
        typeof section[key] !== "string" || section[key].trim() === "" || section[key].includes(UNTRANSLATED_SENTINEL)
    );
    if (bad.length > 0) {
      problems.push(`${locale}: globalError.${bad.join(", globalError.")} is missing or still untranslated.`);
      continue;
    }

    entries.push([locale, Object.fromEntries(GLOBAL_ERROR_KEYS.map((key) => [key, section[key]]))]);
  }

  return { entries, problems };
}

export function renderModule(entries) {
  const body = entries
    .map(([locale, copy]) => {
      const fields = GLOBAL_ERROR_KEYS.map((key) => `    ${key}: ${JSON.stringify(copy[key])}`).join(",\n");
      return `  ${/^[a-z]+$/.test(locale) ? locale : JSON.stringify(locale)}: {\n${fields}\n  }`;
    })
    .join(",\n");

  return `// GENERATED FILE — DO NOT EDIT.
//
// Written by \`pnpm global-error-copy:generate\` from the app UI catalogs: English
// from this repo's \`messages.json\`, every other locale from the i18n repo's copy
// of it. Edit the catalogs, not this file, and commit what regenerating produces.
//
// It is committed rather than gitignored because \`app/global-error.tsx\` renders
// after the app has already failed and cannot fetch anything, and no build has an
// i18n checkout. See scripts/generate-global-error-copy.js for the full reasoning.

export interface GlobalErrorCopy {
  title: string;
  message: string;
  actionLabel: string;
}

/**
 * Deliberately keyed by \`string\` rather than \`Record<Locale, ...>\`: an exhaustive
 * map would make every new locale a compile error in a file nobody should be
 * editing, which is the coupling this generation removed. A locale with no entry
 * falls back to English at runtime, and \`pnpm locale:check\` reports it as a gap
 * alongside every other locale problem.
 */
export const GLOBAL_ERROR_COPY: Readonly<Record<string, GlobalErrorCopy>> = {
${body}
};
`;
}
