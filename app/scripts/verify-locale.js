#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Locale completeness check.
 *
 * Production serves only the LIVE languages (lib/locales.ts SUPPORTED_LOCALES —
 * currently just `en`), and en is the canonical source, so a live deploy can't
 * ship missing files. Before promoting another language to live (e.g. hu), run
 * this to confirm it's complete:
 *
 *   pnpm verify:locale hu            # strict: exit 1 if hu is missing anything
 *   pnpm verify:locale hu es-ES      # check several
 *   pnpm verify:locale               # report completeness of every non-en locale
 *
 * "Complete" means: for every content-hashed cache-tree file that exists for the
 * `en` baseline, the same file (same path, any hash) exists for the target
 * locale. Locale-independent artifacts (concept icons, content images) have no
 * locale path segment and are ignored.
 *
 * Reads the generated public/static tree, so run the cache generators first
 * (`pnpm build`, `pnpm dev`, or the individual *:generate scripts). The
 * `verify:locale` npm script regenerates the trees for you.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATIC_DIR = path.join(__dirname, "../public/static");
const BASELINE = "en";

// Cache trees that are keyed by locale (concept icons / content images live
// under these too but carry no locale segment, so they're naturally skipped).
const TREES = ["i18n", "exercises", "concepts", "content"];

// A content-hashed leaf: `{kind}-{12 hex}.{ext}`. We match siblings ignoring the
// hash, since the same logical file has a different hash in each locale.
const HASHED_LEAF = /^(.*)-[0-9a-f]{12}(\.[^.]+)$/;

/** Recursively collect every file path (absolute) under a directory. */
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) {
    return out;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

/** Does `dir` contain a file matching `{kind}-{hash}{ext}` (any hash)? */
function hasHashedSibling(dir, kind, ext) {
  if (!fs.existsSync(dir)) {
    return false;
  }
  return fs.readdirSync(dir).some((name) => {
    const m = HASHED_LEAF.exec(name);
    return m && m[1] === kind && m[2] === ext;
  });
}

/**
 * For a baseline (en) file, return the target locale's expected file location
 * as { dir, kind, ext }, or null if the file has no baseline locale segment
 * (locale-independent asset) or an un-hashed leaf.
 */
function expectedForLocale(baselineRelPath, locale) {
  const segments = baselineRelPath.split(path.sep);
  const localeIdx = segments.indexOf(BASELINE);
  if (localeIdx === -1) {
    return null; // no locale segment — locale-independent asset
  }
  const leaf = segments[segments.length - 1];
  const m = HASHED_LEAF.exec(leaf);
  if (!m) {
    return null; // not a content-hashed leaf
  }

  const targetSegments = [...segments];
  targetSegments[localeIdx] = locale;
  targetSegments.pop(); // drop the leaf; the hash differs per locale
  return { dir: path.join(STATIC_DIR, ...targetSegments), kind: m[1], ext: m[2] };
}

/** All baseline (en) cache-tree files, relative to STATIC_DIR. */
function baselineFiles() {
  const files = [];
  for (const tree of TREES) {
    for (const abs of walk(path.join(STATIC_DIR, tree))) {
      const rel = path.relative(STATIC_DIR, abs);
      if (rel.split(path.sep).includes(BASELINE)) {
        files.push(rel);
      }
    }
  }
  return files;
}

/**
 * Locales (other than en) present in the generated trees. Discovered from the JS
 * interpreter i18n dir (`i18n/interpreter/javascript/{locale}`), whose children
 * are unambiguously locale codes — never slugs. JavaScript is the launch language,
 * so every content locale ships a dict there. (Other positions like
 * `exercises/{locale}` are ambiguous with slug directories, e.g. the `if` concept.)
 */
function discoverLocales() {
  const dir = path.join(STATIC_DIR, "i18n", "interpreter", "javascript");
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== BASELINE)
    .map((d) => d.name)
    .sort();
}

/** Check one locale against the baseline. Returns { checked, missing[] }. */
function checkLocale(locale, base) {
  const missing = [];
  let checked = 0;
  for (const rel of base) {
    const expected = expectedForLocale(rel, locale);
    if (!expected) {
      continue;
    }
    checked += 1;
    if (!hasHashedSibling(expected.dir, expected.kind, expected.ext)) {
      const relDir = path.relative(STATIC_DIR, expected.dir);
      missing.push(`${relDir}/${expected.kind}-*${expected.ext}`);
    }
  }
  return { checked, missing };
}

function main() {
  if (!fs.existsSync(STATIC_DIR)) {
    console.error(`No generated cache at ${STATIC_DIR}. Run the generators first (pnpm build / pnpm dev).`);
    process.exit(1);
  }

  const base = baselineFiles();
  if (base.length === 0) {
    console.error(`No baseline (${BASELINE}) files found under ${STATIC_DIR}. Did the generators run?`);
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const strict = args.length > 0;
  const locales = strict ? args : discoverLocales();

  if (locales.length === 0) {
    console.log(`No non-${BASELINE} locales found in the generated cache — nothing to check.`);
    return;
  }

  console.log(`Baseline "${BASELINE}": ${base.length} cache-tree files.\n`);

  let anyIncomplete = false;
  for (const locale of locales) {
    const { checked, missing } = checkLocale(locale, base);
    if (missing.length === 0) {
      console.log(`✓ ${locale}: complete (${checked}/${checked} files present)`);
    } else {
      anyIncomplete = true;
      console.log(`✗ ${locale}: MISSING ${missing.length} of ${checked} files:`);
      for (const m of missing.slice(0, 50)) {
        console.log(`    ${m}`);
      }
      if (missing.length > 50) {
        console.log(`    …and ${missing.length - 50} more`);
      }
    }
  }

  // In strict mode (explicit locales — e.g. validating a candidate before making
  // it live) an incomplete locale is a hard failure. In report mode it's informational.
  if (strict && anyIncomplete) {
    console.log(`\nLocale check failed — do not make an incomplete locale live.`);
    process.exit(1);
  }
}

main();
