#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Curriculum Copy Cache Generation Script
 *
 * The display title + description for everything a student opens — exercise
 * lessons, video lessons and challenges — is curriculum content, not app chrome,
 * so it lives with the curriculum and is fetched at runtime from the
 * content-hashed cache tree rather than bundled or served by the API.
 *
 * Exercises and challenges share one slug namespace with video lessons (every
 * challenge slug IS an exercise slug, and no video slug collides with either), so
 * this emits ONE flat catalog keyed by slug. Consumers resolve copy by slug alone
 * and never branch on the kind of thing they're rendering.
 *
 * Copy is authored in two places and merged here:
 *
 *   curriculum/src/exercises/{slug}/instructions.md
 *     - Frontmatter title + description. Already the source of truth for the
 *       exercise page itself, so it is NEVER duplicated into the catalog source
 *       below — this single-sourcing is the whole point of the catalog.
 *
 *   curriculum/src/video-lessons/messages.json
 *     - The video lessons, which have no other home.
 *
 * Both are English. The curriculum holds no other locale: translations are
 * authored in the i18n repo and published from there straight to R2. The
 * catalogs this emits stay keyed by locale all the same, because that is how
 * they are addressed on R2 and by the runtime.
 *
 * Badges are curriculum-owned copy too, but they carry a different shape
 * (name/description/funFact rather than title/description), so they get their own
 * catalog from their own source rather than being forced into the slug map.
 *
 * Produces:
 *
 *   public/static/i18n/curriculum/{locale}/messages-{hash}.json
 *     - { [slug]: { title, description } } for one human locale
 *
 *   public/static/i18n/badges/{locale}/messages-{hash}.json
 *     - { [slug]: { name, description, funFact } } for one human locale
 *
 *   lib/generated/curriculum-copy-hashes.ts
 *     - Hash manifests: locale -> messages hash, for both catalogs
 *
 * Uploaded to R2 immutably by `static:upload` (the whole `i18n` tree is hashed).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import { computeHash, writeFile } from "./lib/cache-utils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXERCISES_DIR = path.join(__dirname, "../../curriculum/src/exercises");
const VIDEO_LESSONS_FILE = path.join(__dirname, "../../curriculum/src/video-lessons/messages.json");
const BADGES_FILE = path.join(__dirname, "../../curriculum/src/badges/messages.json");
const STATIC_DIR = path.join(__dirname, "../public/static/i18n/curriculum");
const BADGES_STATIC_DIR = path.join(__dirname, "../public/static/i18n/badges");
const GENERATED_DIR = path.join(__dirname, "../lib/generated");

// Mirrors DEFAULT_LOCALE in lib/locales.ts. The only locale the curriculum
// authors, and so the only key any of the catalogs below carry.
const DEFAULT_LOCALE = "en";

/**
 * Read every exercise's title + description from its instructions frontmatter.
 * Returns { [locale]: { [slug]: { title, description } } }.
 */
function readExerciseCopy() {
  const byLocale = {};

  if (!fs.existsSync(EXERCISES_DIR)) {
    throw new Error(`No exercises dir at ${EXERCISES_DIR}`);
  }

  const slugDirs = fs.readdirSync(EXERCISES_DIR, { withFileTypes: true }).filter((d) => d.isDirectory());

  for (const slugDir of slugDirs) {
    const slug = slugDir.name;

    // Directories without metadata.json are not exercises (matches
    // generate-exercise-cache.js).
    if (!fs.existsSync(path.join(EXERCISES_DIR, slug, "metadata.json"))) {
      continue;
    }

    const filePath = path.join(EXERCISES_DIR, slug, "instructions.md");
    if (!fs.existsSync(filePath)) {
      continue;
    }

    const { data } = matter(fs.readFileSync(filePath, "utf-8"));

    if (!data.title) {
      throw new Error(`Missing title in frontmatter of ${filePath}`);
    }

    byLocale[DEFAULT_LOCALE] ??= {};
    byLocale[DEFAULT_LOCALE][slug] = {
      title: data.title,
      description: data.description || ""
    };
  }

  return byLocale;
}

/**
 * Read the authored video-lesson catalogs.
 * Returns { [locale]: { [slug]: { title, description } } }.
 */
function readVideoLessonCopy() {
  if (!fs.existsSync(VIDEO_LESSONS_FILE)) {
    throw new Error(`No video-lessons catalog at ${VIDEO_LESSONS_FILE}`);
  }

  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(VIDEO_LESSONS_FILE, "utf-8"));
  } catch (error) {
    throw new Error(`Invalid JSON in ${VIDEO_LESSONS_FILE}: ${error.message}`);
  }

  for (const [slug, entry] of Object.entries(parsed)) {
    if (!entry || !entry.title || !entry.description) {
      throw new Error(`Video lesson "${slug}" in ${VIDEO_LESSONS_FILE} is missing title or description`);
    }
  }

  return { [DEFAULT_LOCALE]: parsed };
}

/**
 * Read the authored badge catalogs.
 * Returns { [locale]: { [slug]: { name, description, funFact } } }.
 */
function readBadgeCopy() {
  if (!fs.existsSync(BADGES_FILE)) {
    throw new Error(`No badges catalog at ${BADGES_FILE}`);
  }

  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(BADGES_FILE, "utf-8"));
  } catch (error) {
    throw new Error(`Invalid JSON in ${BADGES_FILE}: ${error.message}`);
  }

  for (const [slug, entry] of Object.entries(parsed)) {
    if (!entry || !entry.name || !entry.description || !entry.funFact) {
      throw new Error(`Badge "${slug}" in ${BADGES_FILE} is missing name, description or funFact`);
    }
  }

  return { [DEFAULT_LOCALE]: parsed };
}

/**
 * Merge the two sources into one catalog per locale.
 *
 * A slug present in both sources is a hard error: the namespace is only unified
 * because it is collision-free, and a collision means one of the two copies would
 * silently win.
 */
function buildCatalogs(exerciseCopy, videoCopy) {
  const locales = new Set([...Object.keys(exerciseCopy), ...Object.keys(videoCopy)]);
  const catalogs = {};

  for (const locale of locales) {
    const exercises = exerciseCopy[locale] || {};
    const videos = videoCopy[locale] || {};

    for (const slug of Object.keys(videos)) {
      if (slug in exercises) {
        throw new Error(
          `Slug "${slug}" is defined as both an exercise and a video lesson (locale "${locale}"). ` +
            `The curriculum copy namespace must stay collision-free.`
        );
      }
    }

    // Sorted for deterministic output, so the content hash only changes when the
    // copy actually changes.
    const merged = {};
    for (const slug of [...Object.keys(exercises), ...Object.keys(videos)].sort()) {
      merged[slug] = exercises[slug] || videos[slug];
    }

    catalogs[locale] = merged;
  }

  return catalogs;
}

/**
 * Write one messages file per locale into `dir`. Returns the hash manifest.
 */
function writeCatalogs(catalogs, dir) {
  const hashes = {};

  for (const [locale, catalog] of Object.entries(catalogs)) {
    const content = JSON.stringify(catalog);
    const hash = computeHash(content);
    hashes[locale] = hash;
    writeFile(path.join(dir, locale, `messages-${hash}.json`), content);
  }

  return hashes;
}

/**
 * Write the TypeScript hash manifests.
 */
function writeHashManifest(copyHashes, badgeHashes) {
  const format = (hashes) =>
    Object.entries(hashes)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([locale, hash]) => `  ${JSON.stringify(locale)}: ${JSON.stringify(hash)}`)
      .join(",\n");

  const content = `// Auto-generated by scripts/generate-curriculum-copy-cache.js — DO NOT EDIT
export const curriculumCopyHashes: Record<string, string> = {
${format(copyHashes)},
};

export const badgeCopyHashes: Record<string, string> = {
${format(badgeHashes)},
};
`;

  writeFile(path.join(GENERATED_DIR, "curriculum-copy-hashes.ts"), content);
}

function generateCurriculumCopyCache() {
  console.log("Generating curriculum copy cache...\n");

  for (const dir of [STATIC_DIR, BADGES_STATIC_DIR]) {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true });
    }
  }

  const exerciseCopy = readExerciseCopy();
  const videoCopy = readVideoLessonCopy();
  const badgeCopy = readBadgeCopy();

  const catalogs = buildCatalogs(exerciseCopy, videoCopy);
  const copyHashes = writeCatalogs(catalogs, STATIC_DIR);
  const badgeHashes = writeCatalogs(badgeCopy, BADGES_STATIC_DIR);
  writeHashManifest(copyHashes, badgeHashes);

  const locales = Object.keys(copyHashes).sort();
  console.log("Curriculum copy cache generated successfully:\n");
  console.log(`   Exercises: ${Object.keys(exerciseCopy.en || {}).length}`);
  console.log(`   Video lessons: ${Object.keys(videoCopy.en || {}).length}`);
  console.log(`   Badges: ${Object.keys(badgeCopy.en || {}).length}`);
  console.log(`   Locales: ${locales.join(", ")}`);
  for (const locale of locales) {
    console.log(`     ${locale}: ${Object.keys(catalogs[locale]).length} entries`);
  }
  console.log(`   Output: ${STATIC_DIR}, ${BADGES_STATIC_DIR}\n`);
}

try {
  generateCurriculumCopyCache();
} catch (error) {
  console.error("Failed to generate curriculum copy cache:", error);
  process.exit(1);
}
