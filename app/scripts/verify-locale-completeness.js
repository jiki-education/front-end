#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Refuse to ship a production locale the i18n repo does not call complete.
 *
 * ## Why this exists
 *
 * Publishing and serving answer different questions. The i18n repo publishes
 * whatever is on its main, deliberately, so work in progress reaches R2 and can
 * be reviewed on staging. That means R2 is NOT evidence that a locale is
 * finished, and `PRODUCTION_LOCALES` cannot be a judgement someone makes by hand
 * against what happens to be published.
 *
 * i18n is the only place that knows whether a locale is complete, and it says so
 * in `/static/i18n/completeness.json`. This reads that and fails if any locale in
 * `PRODUCTION_LOCALES` is not complete.
 *
 * ## Why a check rather than a runtime lookup
 *
 * Adding a locale to the production set is already a reviewed commit. A check
 * makes that commit provably safe, at the moment someone is looking at it,
 * instead of moving the decision to request time where it would cost a fetch on
 * every cacheable page and could still surface a half-translated locale between
 * a publish and a deploy.
 *
 * English is exempt: it is authored in this repo and published with the deploy,
 * so the i18n repo has nothing to say about it.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const COMPLETENESS_URL = "https://assets.jiki.io/static/i18n/completeness.json";

// PRODUCTION_LOCALES is read out of the source rather than imported, because
// importing it would drag in the app's whole TypeScript module graph for one
// array. There is still exactly one place the list is written down.
const LOCALES_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "lib", "locales.ts");

function readArray(name) {
  const source = fs.readFileSync(LOCALES_FILE, "utf8");
  const match = source.match(new RegExp(`${name}[^=]*=\\s*\\[([^\\]]*)\\]`));
  if (!match) {
    throw new Error(`could not find ${name} in ${LOCALES_FILE}`);
  }
  return [...match[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

const DEFAULT_LOCALE = "en";
const PRODUCTION_LOCALES = readArray("PRODUCTION_LOCALES");

const url = process.env.JIKI_COMPLETENESS_URL ?? COMPLETENESS_URL;
const locales = PRODUCTION_LOCALES.filter((locale) => locale !== DEFAULT_LOCALE);

if (locales.length === 0) {
  console.log(`Locale completeness: nothing to check (production serves ${DEFAULT_LOCALE} only).`);
  process.exit(0);
}

// A local path is accepted so this can be run against a publish that has not
// been uploaded yet, which is how it is tested and how a translator can check a
// locale before it goes anywhere.
async function readReport(source) {
  if (!source.startsWith("http")) {
    return JSON.parse(fs.readFileSync(source, "utf8"));
  }
  const res = await fetch(source);
  if (!res.ok) {
    console.error(
      `Locale completeness: cannot read ${source} (HTTP ${res.status}).\n` +
        `PRODUCTION_LOCALES contains ${locales.join(", ")}, and this is the only thing that can say whether ` +
        `they are complete, so this fails rather than assuming they are.`
    );
    process.exit(1);
  }
  return res.json();
}

const report = await readReport(url);
const failures = [];

for (const locale of locales) {
  const entry = report.locales?.[locale];
  if (!entry) {
    failures.push(`${locale}: absent from the completeness record; the i18n repo has never published it`);
    continue;
  }
  if (!entry.complete) {
    const gaps = (entry.gaps ?? []).map((gap) => `      ${gap.type}: ${gap.detail}`).join("\n");
    failures.push(`${locale}: incomplete\n${gaps}`);
  }
}

if (failures.length > 0) {
  console.error(`Locale completeness: ${failures.length} production locale(s) are not shippable.\n`);
  for (const failure of failures) console.error(`  ${failure}`);
  console.error(`\nRemove them from PRODUCTION_LOCALES in lib/locales.ts, or finish them in the i18n repo.`);
  process.exit(1);
}

console.log(`Locale completeness: ${locales.join(", ")} all complete.`);
