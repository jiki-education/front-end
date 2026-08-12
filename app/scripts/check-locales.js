#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * One check for everything a locale's existence implies. Fails ONCE, listing
 * every problem it found.
 *
 * ## Why this exists
 *
 * Launching a locale used to mean edits in three files that had to agree, and
 * you discovered them one CI failure at a time: the type error only after the
 * runtime throw, the deploy gate only after both. Each failure told you about
 * exactly one of them, so the loop was fix, push, wait, learn about the next one.
 *
 * The roster (`lib/i18n/language-registry.ts`) removed most of that by making the
 * other places derived. This closes the rest: everything the roster implies but
 * cannot itself contain — generated files that must be regenerated and committed,
 * catalogs that must exist in the other repo, a flag that must be on disk — is
 * asserted here, in one run, with every failure reported together.
 *
 * ## What it is not
 *
 * It is not the completeness gate. `verify-locale-completeness.js` asks the i18n
 * repo whether a locale is FULLY translated, from that repo's own published
 * record, and that stays the authority on whether a locale may be in production.
 * This checks the things visible from inside this repo.
 *
 * ## Without an i18n checkout
 *
 * The checks that read the other repo are skipped and SAID to be skipped, never
 * silently passed. CI has no i18n checkout, so the committed generated files are
 * what it checks against; a developer with the checkout gets the stronger version
 * that also regenerates them and diffs.
 */

import fs from "fs";
import path from "path";
import {
  APP_DIR,
  DEFAULT_LOCALE,
  GLOBAL_ERROR_COPY_FILE,
  GLOBAL_ERROR_KEYS,
  MESSAGES_FILE,
  PRODUCTION_LOCALES_FILE,
  evalTsModule,
  isValidStatus,
  knownLocales,
  productionLocales,
  readCatalog,
  readLanguageRegistry,
  resolveI18nRepo,
  statuses
} from "./lib/language-registry.js";
import { buildGlobalErrorCopy, renderModule } from "./lib/global-error-copy.js";

const problems = [];
const notes = [];
function rel(file) {
  return path.relative(APP_DIR, file);
}

function problem(summary, fix) {
  problems.push({ summary, fix });
}

// ---------------------------------------------------------------------------
// 1. The roster itself
// ---------------------------------------------------------------------------

const roster = readLanguageRegistry();
const seen = new Map();

for (const language of roster) {
  const { code, flag, status } = language;

  if (typeof code !== "string" || !/^[a-z]{2}(-[A-Za-z0-9]{2,3})?$/.test(code)) {
    problem(
      `roster: "${code}" is not a canonically-cased BCP-47 code.`,
      `The code is also the URL segment, the catalog filename and the i18n locale directory, so its casing is load-bearing (pt-BR, not pt-br).`
    );
  }

  if (seen.has(code)) {
    problem(`roster: ${code} is listed twice.`, `Delete one of the two entries in lib/i18n/language-registry.ts.`);
  }
  seen.set(code, language);

  if (!isValidStatus(status)) {
    problem(
      `roster: ${code} has status "${status}".`,
      `Valid statuses are ${statuses().join(", ")}. See the ladder documented in lib/i18n/language-registry.ts.`
    );
  }

  const flagFile = path.join(APP_DIR, "public", "static", "images", "flags", `${flag}.svg`);
  if (!fs.existsSync(flagFile)) {
    problem(
      `roster: ${code} names flag "${flag}", and ${rel(flagFile)} does not exist.`,
      `Add the 3x2 SVG from country-flag-icons, or point the entry at a flag that is already there.`
    );
  }
}

const known = knownLocales();
const production = productionLocales();

if (seen.get(DEFAULT_LOCALE)?.status !== "production") {
  problem(
    `roster: the default locale (${DEFAULT_LOCALE}) is not "production".`,
    `Everything falls back to it, so it is served everywhere by definition.`
  );
}

// ---------------------------------------------------------------------------
// 2. The generated production locale list the deploy gate reads
// ---------------------------------------------------------------------------

const expectedProductionJson = `${JSON.stringify(production)}\n`.replace(/","/g, '", "');
const actualProductionJson = fs.existsSync(PRODUCTION_LOCALES_FILE)
  ? fs.readFileSync(PRODUCTION_LOCALES_FILE, "utf8")
  : "";

if (actualProductionJson !== expectedProductionJson) {
  problem(
    `${rel(PRODUCTION_LOCALES_FILE)} is out of date: it says ${actualProductionJson.trim() || "(nothing)"} where the roster says ${expectedProductionJson.trim()}.`,
    `Run \`pnpm locales:generate\` and commit the result. This file is what the plain-node deploy gate reads, so it has to be in the tree.`
  );
}

// ---------------------------------------------------------------------------
// 3. The English copy the crash page falls back to
// ---------------------------------------------------------------------------

const english = readCatalog(DEFAULT_LOCALE);
const englishGlobalError = english?.globalError ?? {};
const missingEnglish = GLOBAL_ERROR_KEYS.filter((key) => typeof englishGlobalError[key] !== "string");
if (missingEnglish.length > 0) {
  problem(
    `${rel(MESSAGES_FILE)} has no globalError.${missingEnglish.join(", no globalError.")}.`,
    `The crash page falls back to English for every locale, so these three keys are the ones it cannot do without.`
  );
}

// ---------------------------------------------------------------------------
// 4. The generated crash-page copy
// ---------------------------------------------------------------------------

const committedCopy = fs.existsSync(GLOBAL_ERROR_COPY_FILE)
  ? evalTsModule(GLOBAL_ERROR_COPY_FILE, "the generated global-error copy").GLOBAL_ERROR_COPY
  : undefined;

if (!committedCopy) {
  problem(
    `${rel(GLOBAL_ERROR_COPY_FILE)} does not exist.`,
    `Run \`pnpm global-error-copy:generate\` (with an i18n checkout) and commit it. app/global-error.tsx imports it synchronously, because it renders when nothing can be fetched.`
  );
} else {
  for (const locale of known) {
    const copy = committedCopy[locale];
    const missing = copy ? GLOBAL_ERROR_KEYS.filter((key) => typeof copy[key] !== "string") : GLOBAL_ERROR_KEYS;
    if (missing.length === 0) continue;

    const severity = production.includes(locale) ? "is in PRODUCTION and" : "is served on staging and";
    problem(
      `${locale} ${severity} has no crash-page copy (${rel(GLOBAL_ERROR_COPY_FILE)} is missing ${missing.join(", ")}).`,
      `Translate globalError in the i18n repo's locales/${locale}/app/messages.json, then \`pnpm global-error-copy:generate\` and commit. Until then ${locale} readers get the English crash page.`
    );
  }

  for (const locale of Object.keys(committedCopy)) {
    if (!known.includes(locale)) {
      problem(
        `${rel(GLOBAL_ERROR_COPY_FILE)} carries copy for ${locale}, which is not a locale this codebase knows.`,
        `Either give ${locale} a non-advertised status in the roster, or regenerate to drop it.`
      );
    }
  }

  const committedEnglish = committedCopy[DEFAULT_LOCALE] ?? {};
  const staleEnglish = GLOBAL_ERROR_KEYS.filter((key) => committedEnglish[key] !== englishGlobalError[key]);
  if (missingEnglish.length === 0 && staleEnglish.length > 0) {
    problem(
      `${rel(GLOBAL_ERROR_COPY_FILE)} has stale English (${staleEnglish.join(", ")} differs from messages.json).`,
      `Run \`pnpm global-error-copy:generate\` and commit the result.`
    );
  }
}

// ---------------------------------------------------------------------------
// 5. The other repo (only when it is checked out)
// ---------------------------------------------------------------------------

const i18nRepo = resolveI18nRepo();

if (!i18nRepo) {
  notes.push(
    `No i18n checkout, so the catalogs themselves were not read and ${rel(GLOBAL_ERROR_COPY_FILE)} was checked as committed rather than regenerated. Set JIKI_I18N_REPO to check against the source.`
  );
} else {
  for (const locale of known) {
    if (locale === DEFAULT_LOCALE) continue;
    const catalogFile = path.join(i18nRepo, "locales", locale, "app", "messages.json");
    if (!fs.existsSync(catalogFile)) {
      problem(
        `${locale} has no app UI catalog in the i18n repo (${catalogFile}).`,
        `Run \`/translate-website-copy ${locale} outdated\` in the translator repo. Without it, ${locale} has no UI strings at all.`
      );
    }
  }

  const { entries } = buildGlobalErrorCopy(i18nRepo);
  const regenerated = renderModule(entries);
  const committed = fs.existsSync(GLOBAL_ERROR_COPY_FILE) ? fs.readFileSync(GLOBAL_ERROR_COPY_FILE, "utf8") : "";
  if (regenerated !== committed) {
    problem(
      `${rel(GLOBAL_ERROR_COPY_FILE)} differs from what regenerating produces.`,
      `Run \`pnpm global-error-copy:generate\` and commit the result. Somebody edited the catalogs (or the generated file) without regenerating.`
    );
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

console.log(
  `Locale check: ${roster.length} languages on the roster, ${known.length} known (${known.join(", ")}), ` +
    `${production.length} in production (${production.join(", ")}).`
);

for (const note of notes) console.log(`  note: ${note}`);

if (problems.length === 0) {
  console.log(`Locale check: everything agrees.`);
  process.exit(0);
}

console.error(`\nLocale check: ${problems.length} problem(s).\n`);
problems.forEach(({ summary, fix }, index) => {
  console.error(`  ${index + 1}. ${summary}`);
  console.error(`     -> ${fix}\n`);
});
console.error(
  `All of the above, together, is what this locale still needs. They are reported in one run on purpose: ` +
    `finding them one CI failure at a time is what this check replaced.\n`
);
process.exit(1);
