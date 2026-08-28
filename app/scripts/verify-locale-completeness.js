#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Refuse to ship a production locale that is not complete FOR THIS TREE.
 *
 * ## The question
 *
 * "If the English in this checkout were on main right now, would every locale in
 * `PRODUCTION_LOCALES` be fully translated?" The same question is asked on every
 * PR and again on the production deploy, by this one script, so a green PR is a
 * green deploy. Main is always deployed, so nothing may merge that the deploy
 * would then refuse.
 *
 * ## Why it is computed here rather than fetched
 *
 * The i18n repo publishes a completeness record to R2, generated against
 * front-end MAIN at the moment i18n last pushed. That record cannot answer the
 * question above for anything but main-as-of-then. Read from a PR it is wrong in
 * both directions: a PR adding untranslated English scores the same as one adding
 * none, and a PR whose English HAS been translated goes red, because i18n now
 * holds the PR's keys instead of main's, and main is the denominator. That second
 * case is the intended workflow succeeding (PR opens issue, i18n translates, PR
 * merges) and it was reported as a failure. Read from the deploy it is stale
 * too: after the merge, main's English is new but the record is not rebuilt
 * until something else pushes to i18n.
 *
 * So instead this runs the i18n repo's own publisher, pointed at THIS checkout as
 * its English (`JIKI_SOURCE_REPO`, its documented override), into a scratch
 * directory, and reads the completeness record it writes there. Same code, same
 * bytes, same rules as the real publish; only the English differs, and it is the
 * English that is about to ship.
 *
 * ## Where the i18n repo comes from
 *
 * `JIKI_I18N_REPO`, else a sibling checkout at `../../i18n` (the same resolution
 * as scripts/generate-i18n-content.js), else a shallow anonymous clone of main
 * into a temp directory. The repo is public, so CI needs no token. Main, not a
 * pin: the question is whether the translations exist NOW.
 *
 * A local checkout on a branch answers for that branch. Fine for a translator
 * checking their own work; for the deploy this always runs in CI, which clones.
 *
 * English is exempt: it is authored here and published with the deploy, so the
 * i18n repo has nothing to say about it.
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
import os from "os";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const APP_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPO_ROOT = path.join(APP_DIR, "..");

// The same file lib/locales.ts imports, read directly. This runs as a plain node
// script before the build, so it cannot import from lib/locales.ts without a
// TypeScript module graph. One file, two readers, no parsing.
const PRODUCTION_LOCALES = JSON.parse(fs.readFileSync(path.join(APP_DIR, "lib", "production-locales.json"), "utf8"));

const DEFAULT_LOCALE = "en";
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

function run(cmd, args, opts) {
  const result = spawnSync(cmd, args, { stdio: "inherit", ...opts });
  if (result.error) {
    console.error(`Locale completeness: failed to run ${cmd}: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`Locale completeness: ${cmd} ${args.join(" ")} exited ${result.status}.`);
    process.exit(1);
  }
}

/** A checkout of the i18n repo, found or cloned. */
function i18nCheckout() {
  const candidates = [process.env.JIKI_I18N_REPO, path.join(REPO_ROOT, "..", "i18n")].filter(Boolean);
  for (const candidate of candidates) {
    const resolved = path.resolve(candidate);
    if (fs.existsSync(path.join(resolved, "scripts", "publish.mjs"))) {
      console.log(`Locale completeness: using i18n checkout at ${resolved}`);
      return resolved;
    }
  }

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "jiki-i18n-"));
  console.log(`Locale completeness: cloning jiki-education/i18n into ${dir}`);
  run("git", ["clone", "--quiet", "--depth", "1", "https://github.com/jiki-education/i18n.git", dir]);
  return dir;
}

const i18nRepo = i18nCheckout();

// Only prose publishing has dependencies (it renders Markdown through the same
// package the front-end uses), but that is enough to need an install.
if (!fs.existsSync(path.join(i18nRepo, "node_modules"))) {
  run("pnpm", ["install", "--frozen-lockfile"], { cwd: i18nRepo });
}

// The publisher writes a lot (every artifact of every locale), so it streams to
// a file rather than a buffer, and only the completeness summary is echoed.
const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "jiki-i18n-out-"));
const log = path.join(outDir, "publish.log");
console.log(`Locale completeness: publishing every locale against ${REPO_ROOT} (log: ${log})`);
const logFd = fs.openSync(log, "w");
const publish = spawnSync("node", [path.join(i18nRepo, "scripts", "publish.mjs"), "all", `--out-dir=${outDir}`], {
  cwd: i18nRepo,
  env: { ...process.env, JIKI_SOURCE_REPO: REPO_ROOT },
  stdio: ["ignore", logFd, logFd]
});
fs.closeSync(logFd);
if (publish.error || publish.status !== 0) {
  console.error(
    `Locale completeness: the i18n publisher failed (${publish.error?.message ?? `exit ${publish.status}`}).\n` +
      `PRODUCTION_LOCALES contains ${locales.join(", ")}, and the publisher is the only thing that can say ` +
      `whether they are complete, so this fails rather than assuming they are. Its output:\n\n` +
      fs.readFileSync(log, "utf8").split("\n").slice(-40).join("\n")
  );
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(path.join(outDir, "static", "i18n", "completeness.json"), "utf8"));
const failures = [];

for (const locale of locales) {
  const entry = report.locales?.[locale];
  if (!entry) {
    failures.push({
      locale,
      summary: "absent from the completeness record; the i18n repo does not know this locale",
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
  console.error(`\nLocale completeness: ${failures.length} production locale(s) are NOT complete for this tree.\n`);
  for (const failure of failures) {
    console.error(`  ${failure.locale}: ${failure.summary}`);
    for (const line of failure.detail) console.error(`      ${line}`);
  }

  // Both remedies, stated plainly, because somebody hits this at an awkward
  // moment and has to decide in seconds. Translating is named first because on
  // a PR that is the normal case: the English this PR adds has not been
  // translated yet, and i18n-queue.yml has already opened the issue for it.
  console.error(
    `\nTwo ways out:\n` +
      `  1. Translate it in the i18n repo. If this is a PR, i18n-queue.yml has already opened an issue\n` +
      `     there carrying this branch's head SHA; once the translations land on i18n main, re-run\n` +
      `     this check and it goes green with no change to this branch.\n` +
      `  2. Remove ${names} from app/lib/production-locales.json. Production then serves only\n` +
      `     complete locales, which is correct rather than knowingly wrong, and the locale goes back\n` +
      `     the moment the translation lands. Staging serves every locale regardless.\n`
  );

  if (!bypassed) {
    console.error(
      `Blocking. To ship anyway, set the BYPASS_LOCALE_GUARD repository variable,\n` +
        `which reports this without failing. Unset it as soon as the incident is over.\n`
    );
    process.exit(1);
  }
}

if (failures.length === 0) {
  console.log(`Locale completeness: ${locales.join(", ")} all complete for this tree.`);
}

warnIfBypassed(failures.length > 0 ? `${failures.length} incomplete locale(s)` : "no problems found");
