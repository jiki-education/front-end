#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Build the sibling i18n repo's translated content into this app's local cache
 * tree, so `pnpm dev` serves translations the same way production does.
 *
 * ## Why this exists
 *
 * Translations left this repo. In production the front-end serves English from
 * its own deploy and every other locale from R2, where the i18n repo publishes
 * it independently. That split is the point of the migration, and it has one
 * cost: a dev server that only ever generates English shows a developer nothing
 * of what a translated page looks like, and the first time anyone sees a locale
 * end to end is after it is live.
 *
 * So this runs the i18n repo's own publisher, pointed at `public/` instead of
 * its `dist/`. Not a reimplementation and not an export format: the SAME script
 * that produces the R2 objects, writing the same bytes to the same paths. A
 * local tree that were built any other way would be a third pipeline, which is
 * the thing this whole migration exists to stop having.
 *
 * ## What it does NOT do
 *
 * It is not part of `build`. A production build gets non-English content from
 * R2, published on the i18n repo's own cadence, and baking a snapshot of it into
 * the worker would silently pin every locale to whatever was on disk at build
 * time. Dev only, on purpose.
 *
 * It also runs AFTER this repo's own generators rather than beside them: they
 * clear their output directories on the way in, so running in parallel would
 * race them and delete the locales this had just written.
 *
 * ## Scope
 *
 * With no argument it publishes every locale, which is what a cold `pnpm dev`
 * wants. The watcher passes the path that changed, and then only that path's
 * locale is republished: a full run is ~2.2s and 7,800 files, one locale is
 * ~0.4s and ~550, and someone mid-translation triggers this on every save.
 *
 * Per-locale is as narrow as it can safely go. Each locale's output includes
 * indexes assembled from its whole corpus (the curriculum catalog, the exercise
 * prose index, the concept and post copy indexes, the search indexes), and they
 * embed the content hashes of the files they point at. Publishing one file
 * without rebuilding those would leave an index naming an artifact that no
 * longer exists. Rebuilding them costs ~60ms once node is up, so there is
 * nothing to win by going finer.
 *
 * ## When there is no i18n checkout
 *
 * It says so once and exits 0. Most work in this repo needs no translations,
 * requiring the checkout would break `pnpm dev` for everyone who has not cloned
 * it, and a dev server that refuses to start is a worse failure than an English
 * one.
 */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_DIR = path.join(__dirname, "..");
const PUBLIC_DIR = path.join(APP_DIR, "public");

// The sibling checkout, matching how the i18n repo finds this one
// (scripts/lib/content-types.mjs resolveSourceRepo). JIKI_I18N_REPO overrides,
// for a worktree that does not sit beside the default.
const i18nRepo = path.resolve(process.env.JIKI_I18N_REPO || path.join(APP_DIR, "..", "..", "i18n"));
const publisher = path.join(i18nRepo, "scripts", "publish.mjs");

if (!fs.existsSync(publisher)) {
  console.log(
    `No i18n checkout at ${i18nRepo}, so only English content is available locally.\n` +
      `Clone https://github.com/jiki-education/i18n beside this repo (or set JIKI_I18N_REPO) to see translations.`
  );
  process.exit(0);
}

// The locale a changed path belongs to, or null for anything unrecognised. The
// locale is always the first segment under `locales/`. Unparseable input falls
// back to a full publish rather than guessing: the publisher hard-fails on a
// locale it does not know, and a slow refresh beats a dead watcher.
function localeFromChangedPath(changed) {
  if (!changed) return null;

  const relative = path.relative(path.join(i18nRepo, "locales"), path.resolve(changed));
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) return null;

  const [locale] = relative.split(path.sep);
  const { targets } = JSON.parse(fs.readFileSync(path.join(i18nRepo, "locales.json"), "utf8"));
  return targets.includes(locale) ? locale : null;
}

const target = localeFromChangedPath(process.argv[2]) ?? "all";

console.log(
  target === "all"
    ? `Generating translated content from ${i18nRepo}...\n`
    : `Generating ${target} content from ${i18nRepo}...\n`
);

const result = spawnSync("node", [publisher, target, `--out-dir=${PUBLIC_DIR}`], {
  cwd: i18nRepo,
  stdio: "inherit"
});

if (result.error) {
  console.error(`Failed to run the i18n publisher: ${result.error.message}`);
  process.exit(1);
}

// A non-zero exit is a real failure in the publisher and worth surfacing, but it
// must not take the dev server down with it: English still works, and a broken
// translation build is something to fix, not something to be blocked by.
if (result.status !== 0) {
  console.error(
    `\nThe i18n publisher exited ${result.status}. Translated content may be missing or stale; ` +
      `English is unaffected.`
  );
}
