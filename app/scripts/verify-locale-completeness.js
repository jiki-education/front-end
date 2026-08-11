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
 *
 * ## Where this runs
 *
 * As a PR check, and again as a gate on the PRODUCTION deploy. The second is not
 * redundant: completeness is a fact about the OTHER repo and can regress with no
 * front-end commit at all. A translator adding an English source file with no
 * counterpart makes a locale incomplete, and nothing re-runs the PR check that
 * approved that locale weeks earlier. The PR check is the primary control; the
 * deploy gate is the backstop for a later regression.
 *
 * It deliberately does NOT gate `deploy:staging`. Staging serves ALL_LOCALES on
 * purpose, so that incomplete work can be looked at, and gating it would block
 * the reviews it exists for.
 *
 * ## The escape hatch
 *
 * `BYPASS_LOCALE_GUARD` (a repository VARIABLE, not a secret, so it is visible
 * in the settings UI and in logs) makes this report without failing. The check
 * still runs in full: skipping the question would mean nobody knows what they
 * shipped. The failure mode being guarded against is somebody setting it during
 * an incident and never unsetting it, so every subsequent deploy shouts about it.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const COMPLETENESS_URL = "https://assets.jiki.io/static/i18n/completeness.json";

// The same file lib/locales.ts imports, read directly. This runs as a plain node
// script before the build, so it cannot import from lib/locales.ts without a
// TypeScript module graph. It used to find the list by matching a regex against
// that file, which could start at a mention of the name in a comment and run on
// to the next array: on a branch carrying 33 locales it read ALL_LOCALES and
// demanded completeness for every one of them. One file, two readers, no parsing.
const PRODUCTION_LOCALES_FILE = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "lib",
  "production-locales.json"
);

const DEFAULT_LOCALE = "en";
const PRODUCTION_LOCALES = JSON.parse(fs.readFileSync(PRODUCTION_LOCALES_FILE, "utf8"));

const url = process.env.JIKI_COMPLETENESS_URL ?? COMPLETENESS_URL;
const locales = PRODUCTION_LOCALES.filter((locale) => locale !== DEFAULT_LOCALE);

const bypass = (process.env.BYPASS_LOCALE_GUARD ?? "").trim();
const bypassed = bypass !== "" && bypass !== "false" && bypass !== "0";

/**
 * Shout about the bypass, on EVERY path that reaches an exit.
 *
 * Including the paths where nothing is wrong. The risk being managed is not a
 * bad deploy today, it is somebody setting this during an incident and never
 * unsetting it, and a toggle that only announces itself when it happens to be
 * suppressing something is silent for exactly as long as it takes to be
 * forgotten.
 */
function warnIfBypassed(state) {
  if (!bypassed) return;
  console.warn(
    `\n${"!".repeat(78)}\n` +
      `!! BYPASS_LOCALE_GUARD IS SET. The locale completeness gate is NOT enforcing.\n` +
      `!! This deploy may serve half-translated locales to readers. Current state: ${state}.\n` +
      `!! Unset the BYPASS_LOCALE_GUARD repository variable to restore the gate.\n` +
      `${"!".repeat(78)}\n`
  );
}

if (locales.length === 0) {
  console.log(`Locale completeness: nothing to check (production serves ${DEFAULT_LOCALE} only).`);
  warnIfBypassed("no non-default locales in PRODUCTION_LOCALES, so nothing was being gated anyway");
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
    failures.push({
      locale,
      summary: "absent from the completeness record; the i18n repo has never published it",
      detail: []
    });
    continue;
  }
  if (!entry.complete) {
    const gaps = entry.gaps ?? [];
    const items = gaps.reduce((sum, gap) => sum + (gap.count ?? 0), 0);
    const types = [...new Set(gaps.map((gap) => gap.type))];
    failures.push({
      locale,
      summary: `incomplete across ${types.length} content type(s), ${items} item(s) outstanding`,
      detail: gaps.map((gap) => `${gap.type}: ${gap.detail}`)
    });
  }
}

if (failures.length > 0) {
  const names = failures.map((failure) => failure.locale).join(", ");
  console.error(`\nLocale completeness: ${failures.length} production locale(s) are NOT complete.\n`);
  for (const failure of failures) {
    console.error(`  ${failure.locale}: ${failure.summary}`);
    for (const line of failure.detail) console.error(`      ${line}`);
  }

  // Both remedies, stated plainly, because somebody hits this at an awkward
  // moment and has to decide in seconds. Removing the locale is named first and
  // recommended because it leaves production CORRECT: serving a locale known to
  // be half-translated is shipping something knowingly wrong to readers who
  // cannot tell, and it can be put back the moment the translation lands.
  console.error(
    `\nTwo ways out:\n` +
      `  1. RECOMMENDED: remove ${names} from PRODUCTION_LOCALES in app/lib/locales.ts and deploy.\n` +
      `     Production keeps serving only complete locales, which is correct rather than\n` +
      `     knowingly wrong, and the locale goes back the moment the translation lands.\n` +
      `     Staging is unaffected either way: it serves every locale so the work stays reviewable.\n` +
      `  2. Finish the translation in the i18n repo, let it publish, and re-run this.\n`
  );

  if (!bypassed) {
    console.error(
      `Blocking the deploy. To ship anyway, set the BYPASS_LOCALE_GUARD repository variable,\n` +
        `which reports this without failing. Unset it as soon as the incident is over.\n`
    );
    process.exit(1);
  }
}

if (failures.length === 0) {
  console.log(`Locale completeness: ${locales.join(", ")} all complete.`);
}

warnIfBypassed(failures.length > 0 ? `${failures.length} incomplete locale(s)` : "no problems found");
