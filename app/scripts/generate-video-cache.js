#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Video Cache Generation Script
 *
 * Every video the platform plays is authored once in
 * `curriculum/src/videos/videos.json`. This resolves that catalog per locale and
 * publishes it as a front-end-owned artifact.
 *
 * ## Why videos are not part of any copy catalog
 *
 * A video is not translated prose. It is an asset produced by the video
 * pipeline, authored in THIS repo, and it changes only when this repo deploys.
 * The copy catalogs are the opposite: the i18n repo republishes them per locale
 * on its own cadence, and it builds each entry as a closed literal
 * (`{title, description, contentHash}`), so any field the front-end folded in
 * there is silently dropped for every locale it publishes. A video in a copy
 * catalog is therefore a video that works in English and vanishes everywhere
 * else. One artifact, one writer.
 *
 * That stays true when a locale gets its OWN recording, rather than less so: a
 * Hungarian re-record is a commit here, not a translation over there.
 *
 * ## Shape
 *
 *   /static/videos/{locale}/index-{hash}.json
 *     { sources: { [videoSlug]: VideoSource },
 *       refs:    { [conceptSlug|exerciseSlug|exerciseSlug:intro]: videoSlug } }
 *
 * `sources` is deduplicated by video slug, because one recording teaches several
 * concepts: the loops video covers break, continue, for-loops and while-loops.
 * `refs` points curriculum items at them. A video LESSON needs no ref, because a
 * video lesson's slug IS its video slug.
 *
 * Content-hashed with the hashes compiled into a manifest and no pointer,
 * exactly like the exercise code index: the front-end owns every locale's
 * resolution, so the hash is correct by construction and never needs resolving
 * at runtime.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { computeHash, writeFile } from "./lib/cache-utils.js";
import { loadVideoCatalog, resolveVideo } from "./lib/videos.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONCEPTS_DIR = path.join(__dirname, "../../curriculum/src/concepts");
const EXERCISES_DIR = path.join(__dirname, "../../curriculum/src/exercises");
const VIDEO_LESSONS_FILE = path.join(__dirname, "../../curriculum/src/video-lessons/messages.json");
const STATIC_DIR = path.join(__dirname, "../public/static/videos");
const GENERATED_DIR = path.join(__dirname, "../lib/generated");

// Mirrors DEFAULT_LOCALE in lib/locales.ts. Every locale without a recording of
// its own reads this locale's index, so it is always emitted.
const DEFAULT_LOCALE = "en";

/**
 * Every curriculum item that names a video, as `itemSlug -> videoSlug`.
 *
 * Locale-invariant: which video a concept teaches is a fact about the
 * curriculum, not about any translation of it.
 */
function readRefs() {
  const refs = {};

  for (const dir of fs.readdirSync(CONCEPTS_DIR, { withFileTypes: true })) {
    if (!dir.isDirectory()) {
      continue;
    }
    const configPath = path.join(CONCEPTS_DIR, dir.name, "config.json");
    if (!fs.existsSync(configPath)) {
      continue;
    }
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    if (config.video) {
      refs[dir.name] = config.video;
    }
  }

  for (const dir of fs.readdirSync(EXERCISES_DIR, { withFileTypes: true })) {
    if (!dir.isDirectory()) {
      continue;
    }
    const metadataPath = path.join(EXERCISES_DIR, dir.name, "metadata.json");
    if (!fs.existsSync(metadataPath)) {
      continue;
    }
    const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
    if (metadata.deepDiveVideo) {
      refs[dir.name] = metadata.deepDiveVideo;
    }
    // An exercise can name two videos playing different roles, so the intro is
    // namespaced rather than claiming the bare slug the deep dive already uses.
    // The suffix is INTRO_REF_SUFFIX in lib/videos/select.ts; keep them in step.
    if (metadata.introVideo) {
      refs[`${dir.name}:intro`] = metadata.introVideo;
    }
  }

  return refs;
}

/** Video-lesson slugs. A video lesson's slug is its video slug. */
function readLessonSlugs() {
  if (!fs.existsSync(VIDEO_LESSONS_FILE)) {
    throw new Error(`No video-lessons catalog at ${VIDEO_LESSONS_FILE}`);
  }
  return Object.keys(JSON.parse(fs.readFileSync(VIDEO_LESSONS_FILE, "utf8")));
}

/**
 * The locales that need an index of their own: the default, plus any locale with
 * a recording in the catalog.
 *
 * A locale absent from here resolves identically to the default by definition,
 * since every one of its videos would be the fallback, so emitting one index per
 * supported locale would publish N byte-identical files. Consumers read the
 * default locale's hash when their own locale has no entry.
 */
function localesToEmit(catalog) {
  const locales = new Set([DEFAULT_LOCALE]);
  for (const entry of Object.values(catalog)) {
    for (const key of Object.keys(entry)) {
      if (key !== "fallback") {
        locales.add(key);
      }
    }
  }
  return [...locales].sort();
}

/** Sorted, so a hash moves only when the content does. */
function sortedByKey(object) {
  return Object.fromEntries(
    Object.keys(object)
      .sort()
      .map((key) => [key, object[key]])
  );
}

function writeHashManifest(hashes) {
  const entries = Object.entries(hashes)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([locale, hash]) => `  ${JSON.stringify(locale)}: ${JSON.stringify(hash)}`)
    .join(",\n");

  const content = `// Auto-generated by scripts/generate-video-cache.js — DO NOT EDIT
//
// No pointer, and every hash compiled in: videos are authored in this repo and
// change only when it deploys, so unlike the translated catalogs there is
// nothing to resolve at runtime. Only locales with a recording of their own get
// an entry; every other locale reads the default locale's index, because each of
// its videos would resolve to the same fallback anyway.
export const videoIndexHashes: Record<string, string> = {
${entries},
};
`;

  writeFile(path.join(GENERATED_DIR, "video-hashes.ts"), content);
}

function generateVideoCache() {
  console.log("Generating video cache...\n");

  if (fs.existsSync(STATIC_DIR)) {
    fs.rmSync(STATIC_DIR, { recursive: true });
  }
  fs.mkdirSync(GENERATED_DIR, { recursive: true });

  const catalog = loadVideoCatalog();
  const refs = readRefs();
  const lessonSlugs = readLessonSlugs();

  // Only videos something actually plays are published. An unreferenced catalog
  // entry is not shipped, so a recording that is staged but not yet wired into
  // the curriculum does not have its playback id served to everyone.
  const reachable = new Set([...lessonSlugs, ...Object.values(refs)]);
  for (const slug of reachable) {
    if (!catalog[slug]) {
      throw new Error(`Unknown video "${slug}" — not in curriculum/src/videos/videos.json`);
    }
  }
  const unreferenced = Object.keys(catalog).filter((slug) => !reachable.has(slug));

  const hashes = {};
  for (const locale of localesToEmit(catalog)) {
    const sources = {};
    for (const slug of [...reachable].sort()) {
      sources[slug] = resolveVideo(slug, locale);
    }

    const content = JSON.stringify({ sources, refs: sortedByKey(refs) });
    const hash = computeHash(content);
    hashes[locale] = hash;
    writeFile(path.join(STATIC_DIR, locale, `index-${hash}.json`), content);
  }

  writeHashManifest(hashes);

  const unreferencedNote = unreferenced.length > 0 ? ` (${unreferenced.length} unreferenced, not published)` : "";
  console.log("Video cache generated successfully:\n");
  console.log(`   Videos: ${reachable.size}${unreferencedNote}`);
  console.log(`   References: ${Object.keys(refs).length} concepts/exercises, ${lessonSlugs.length} lessons by slug`);
  console.log(`   Locales: ${Object.keys(hashes).join(", ")}`);
  console.log(`   Output: ${STATIC_DIR}\n`);
}

try {
  generateVideoCache();
} catch (error) {
  console.error("Failed to generate video cache:", error);
  process.exit(1);
}
