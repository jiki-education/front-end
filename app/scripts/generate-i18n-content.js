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
 * ## Coalescing a burst
 *
 * `onchange` does not debounce. It enqueues one job per file event and runs
 * them one at a time, so a `git pull` that touches thirty locales asks for
 * thirty publishes, several of them the same locale over and over, each paying
 * a fresh node and publisher startup. That is the difference between a watcher
 * that keeps up and one that spends minutes grinding through locales after
 * every branch switch.
 *
 * So the coalescing lives here instead. Each invocation records its locale in a
 * pending set and then races for a lock. Losers exit immediately, which is all
 * a duplicate event costs. The winner waits out the rest of the burst, drains
 * the set, publishes, and drains again for anything that landed meanwhile, so
 * every locale in the burst is published exactly once no matter how many files
 * of it changed. The pending set is only cleared once its locales have actually
 * been handed to the publisher, so a crash mid-burst loses nothing.
 *
 * Past a handful of locales the arithmetic flips: one full publish is ~2.2s,
 * while six separate ones are that plus six startups. A wide burst is therefore
 * turned back into a single `all`.
 *
 * ## Opting in
 *
 * Off unless JIKI_ALL_LOCALES is set, which `bin/dev --all-locales` does. Most
 * work here is English-only, and the price of being on is not the publish but
 * the watcher: chokidar walking every locale's corpus, then a republish every
 * time the i18n repo changes underneath it, which it does constantly. Anything
 * already published stays on disk, so the last locales built are still
 * browsable, just frozen.
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

if (!process.env.JIKI_ALL_LOCALES) {
  console.log(
    "Skipping translated content. Run `./bin/dev --all-locales` to build and watch it (English is unaffected)."
  );
  process.exit(0);
}

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

// Where a burst is accumulated. Under node_modules/.cache because it is derived
// dev-server state: already gitignored, and blown away by a reinstall, which is
// exactly the right lifetime for it.
const STATE_DIR = path.join(APP_DIR, "node_modules", ".cache", "i18n-content");
const PENDING_FILE = path.join(STATE_DIR, "pending.json");
const LOCK_DIR = path.join(STATE_DIR, "publishing.lock");

// How long to let a burst settle before draining it. A `git pull` or a save-all
// delivers its events over a few tens of ms; this is comfortably past that and
// still imperceptible when a single file changes.
const SETTLE_MS = 300;

// Past this many distinct locales, one full publish is cheaper than the
// per-locale runs plus their startups.
const FULL_PUBLISH_THRESHOLD = 5;

// A lock older than this is from a run that was killed (Ctrl-C on the dev
// server, most likely) rather than one still working, and must not wedge the
// watcher for the rest of the session.
const STALE_LOCK_MS = 5 * 60 * 1000;

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function readPending() {
  try {
    return new Set(JSON.parse(fs.readFileSync(PENDING_FILE, "utf8")));
  } catch {
    return new Set();
  }
}

function writePending(locales) {
  fs.mkdirSync(STATE_DIR, { recursive: true });
  fs.writeFileSync(PENDING_FILE, JSON.stringify([...locales]));
}

function addPending(locale) {
  const pending = readPending();
  pending.add(locale);
  writePending(pending);
}

// Take everything queued and clear the queue in one go, so locales that arrive
// while the publisher is running are seen by the next drain rather than lost.
function drainPending() {
  const pending = readPending();
  writePending([]);
  return pending;
}

// mkdir is the atomic test-and-set here: it either creates the directory or
// fails, with no window between the two.
function acquireLock() {
  fs.mkdirSync(STATE_DIR, { recursive: true });

  try {
    fs.mkdirSync(LOCK_DIR);
    return true;
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
  }

  const age = Date.now() - fs.statSync(LOCK_DIR).mtimeMs;
  if (age < STALE_LOCK_MS) return false;

  fs.rmSync(LOCK_DIR, { recursive: true, force: true });
  try {
    fs.mkdirSync(LOCK_DIR);
    return true;
  } catch {
    return false;
  }
}

function releaseLock() {
  fs.rmSync(LOCK_DIR, { recursive: true, force: true });
}

function publish(target) {
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

  // A non-zero exit is a real failure in the publisher and worth surfacing, but
  // it must not take the dev server down with it: English still works, and a
  // broken translation build is something to fix, not something to be blocked
  // by.
  if (result.status !== 0) {
    console.error(
      `\nThe i18n publisher exited ${result.status}. Translated content may be missing or stale; ` +
        `English is unaffected.`
    );
  }
}

// No argument means a cold `pnpm dev`: publish everything, with none of the
// queueing a watcher needs.
if (!process.argv[2]) {
  publish("all");
  process.exit(0);
}

addPending(localeFromChangedPath(process.argv[2]) ?? "all");

// Someone else is already draining, and will pick up what was just queued.
if (!acquireLock()) process.exit(0);

try {
  sleep(SETTLE_MS);

  for (let pending = drainPending(); pending.size > 0; pending = drainPending()) {
    if (pending.has("all") || pending.size > FULL_PUBLISH_THRESHOLD) {
      publish("all");
      continue;
    }

    for (const locale of [...pending].sort()) publish(locale);
  }
} finally {
  releaseLock();
}
