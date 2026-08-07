#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Exercise Cache Generation Script
 *
 * ## Prose and code are separate artifacts
 *
 * An exercise has two kinds of cached content and they vary along DIFFERENT
 * axes. Instructions are translated prose, so they vary by locale and not at all
 * by programming language. Stubs and solutions are code, so they vary by
 * language and not at all by locale: there is exactly one `stub.javascript` per
 * exercise, and the corpus contains no per-locale variant of any code file.
 *
 * They used to share one artifact keyed by (slug, locale, language), which had
 * two consequences. It duplicated identical stub and solution bytes into every
 * locale, and, far more importantly, it made translated instructions
 * unpublishable on their own: the i18n repo cannot emit an artifact that must
 * also contain code it does not hold. Splitting them along their real keys is
 * what lets the largest translated content type publish independently.
 *
 * Produces:
 *
 *   public/static/exercises/{locale}/index-{hash}.json
 *     - PROSE index: [{ slug, title, description, proseHash }]. One per locale.
 *       The i18n repo publishes this for every non-English locale, alongside a
 *       mutable current.json pointer, so a translation goes live with no
 *       front-end deploy. It deliberately carries NO code hashes: an artifact
 *       the i18n repo owns cannot contain a fact only the front-end knows.
 *
 *   public/static/exercises/{slug}/{locale}/prose-{hash}.json
 *     - PROSE: { instructions }. Owned by the front-end for English, by the
 *       i18n repo for every other locale.
 *
 *   public/static/exercises/code/{language}/index-{hash}.json
 *     - CODE index: { [slug]: hash }. One per programming language, front-end
 *       owned, its hash compiled into the worker. `code` is a reserved segment
 *       here and can never be a locale.
 *
 *   public/static/exercises/{slug}/code/{language}/code-{hash}.json
 *     - CODE: { stub, solution }. Front-end owned, written once per language
 *       instead of once per (locale, language).
 *
 *   public/static/i18n/exercises/{slug}/{locale}/messages-{hash}.json
 *     - Curriculum-owned i18n message dicts (runtime logic-error/errorHtml strings)
 *
 *   lib/generated/exercise-hashes.ts
 *     - Hash manifests: locale -> prose index hash, language -> code index hash
 *
 *   lib/generated/exercise-message-hashes.ts
 *     - Hash manifest mapping slug -> locale -> messages hash
 *
 * Used by:
 * - Client-side exercise metadata API (title/description lookups)
 * - useExerciseLoader (instructions, stubs, solutions, runtime message dict)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { computeHash, writeFile } from "./lib/cache-utils.js";
import { parseFrontmatter, prepareInstructions } from "@jiki.io/content-renderer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXERCISES_DIR = path.join(__dirname, "../../curriculum/src/exercises");
const EXERCISE_CATEGORIES_DIR = path.join(__dirname, "../../curriculum/src/exercise-categories");
const STATIC_DIR = path.join(__dirname, "../public/static/exercises");
const I18N_DIR = path.join(__dirname, "../public/static/i18n/exercises");
const GENERATED_DIR = path.join(__dirname, "../lib/generated");

// Language name -> file extension mapping
const LANGUAGE_EXTENSIONS = {
  javascript: ".javascript",
  python: ".py",
  jikiscript: ".jiki"
};

const LANGUAGES = Object.keys(LANGUAGE_EXTENSIONS);

// English. Its index hash is compiled into the worker and its artifacts ship
// with the deploy, so it has no pointer and never needs one.
const DEFAULT_LOCALE = "en";

/**
 * Read a file, returning null if it doesn't exist
 */
function readFileOrNull(filePath) {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

/**
 * Deep-merge two message dicts; keys in `override` win on collision.
 */
function deepMerge(base, override) {
  const out = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const existing = out[key];
    const bothObjects =
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      existing !== null &&
      typeof existing === "object" &&
      !Array.isArray(existing);
    out[key] = bothObjects ? deepMerge(existing, value) : value;
  }
  return out;
}

/**
 * Derive an exercise's family (its exercise-category base) from an
 * `../../exercise-categories/<family>/...` import in any of the exercise's source
 * files. Scans every `.ts` file in the dir rather than only `Exercise.ts`, since
 * some exercises name their class file differently (e.g. scroll-and-shoot uses
 * `ScrollAndShootExercise.ts`). Returns null for standalone exercises (no shared
 * base). This is how base catalogs get merged in below.
 */
function deriveFamily(exercisePath) {
  let files;
  try {
    files = fs.readdirSync(exercisePath).filter((f) => f.endsWith(".ts"));
  } catch {
    return null;
  }
  for (const file of files) {
    const raw = readFileOrNull(path.join(exercisePath, file));
    if (raw === null) {
      continue;
    }
    const match = raw.match(/exercise-categories\/([^/"'`\s]+)/);
    if (match) {
      return match[1];
    }
  }
  return null;
}

/**
 * Load per-family base catalogs (curriculum-owned shared strings, e.g. a base
 * class's logicError messages) authored once under
 * `exercise-categories/<family>/locales/<locale>/translation.json`. Merged into
 * each family member's emitted pack at build time, so the shared strings are
 * authored/translated once but every member's runtime dict is self-contained.
 * Returns { [family]: { [locale]: dict } }.
 */
function loadBaseCatalogs() {
  const bases = {};
  if (!fs.existsSync(EXERCISE_CATEGORIES_DIR)) {
    return bases;
  }
  for (const familyDir of fs.readdirSync(EXERCISE_CATEGORIES_DIR, { withFileTypes: true })) {
    if (!familyDir.isDirectory()) {
      continue;
    }
    const localesDir = path.join(EXERCISE_CATEGORIES_DIR, familyDir.name, "locales");
    if (!fs.existsSync(localesDir)) {
      continue;
    }
    const perLocale = {};
    for (const localeDir of fs.readdirSync(localesDir, { withFileTypes: true })) {
      if (!localeDir.isDirectory()) {
        continue;
      }
      const raw = readFileOrNull(path.join(localesDir, localeDir.name, "translation.json"));
      if (raw === null) {
        continue;
      }
      try {
        perLocale[localeDir.name] = JSON.parse(raw);
      } catch (error) {
        throw new Error(`Invalid JSON in base catalog ${familyDir.name}/${localeDir.name}: ${error.message}`);
      }
    }
    bases[familyDir.name] = perLocale;
  }
  return bases;
}

/**
 * Process all exercises and return structured data
 *
 * Returns: { [slug]: { metadata, locales: { [locale]: { title, description, instructions } }, stubs: { [lang]: string }, solutions: { [lang]: string } } }
 */
function processExercises() {
  const exercises = {};
  const baseCatalogs = loadBaseCatalogs();

  if (!fs.existsSync(EXERCISES_DIR)) {
    console.error(`Exercises directory not found: ${EXERCISES_DIR}`);
    return exercises;
  }

  const slugDirs = fs.readdirSync(EXERCISES_DIR, { withFileTypes: true }).filter((d) => d.isDirectory());

  for (const slugDir of slugDirs) {
    const slug = slugDir.name;
    const exercisePath = path.join(EXERCISES_DIR, slug);

    // Read metadata.json
    const metadataPath = path.join(exercisePath, "metadata.json");
    if (!fs.existsSync(metadataPath)) {
      continue; // Skip directories without metadata (not exercises)
    }

    let metadata;
    try {
      metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
    } catch (error) {
      throw new Error(`Invalid JSON in ${metadataPath}: ${error.message}`);
    }

    // Read instruction files per locale
    const instructionsDir = path.join(exercisePath, "instructions");
    const locales = {};

    if (fs.existsSync(instructionsDir)) {
      const mdFiles = fs
        .readdirSync(instructionsDir, { withFileTypes: true })
        .filter((f) => f.isFile() && f.name.endsWith(".md"));

      for (const file of mdFiles) {
        // English is authored in source.md (the source of truth); map that file to
        // the "en" locale. Every other file is named <locale>.md (e.g. hu.md).
        const baseName = path.basename(file.name, ".md");
        const locale = baseName === "source" ? "en" : baseName;
        const filePath = path.join(instructionsDir, file.name);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const parsed = parseFrontmatter(fileContent);

        if (!parsed.data.title) {
          throw new Error(`Missing title in frontmatter of ${filePath}`);
        }

        // Exercise instructions are stored as raw markdown and rendered by marked
        // at runtime (InstructionsContent.tsx), so there is no build-time marked
        // hook to strip the custom <define>/<literal> tags the English source.md
        // may carry. prepareInstructions does the trim and the strip, and lives in
        // @jiki.io/content-renderer beside the concept renderer, because both
        // repos that publish instructions must agree on these bytes.
        const instructions = prepareInstructions(parsed.body);

        locales[locale] = {
          title: parsed.data.title,
          description: parsed.data.description || "",
          instructions
        };
      }
    }

    if (Object.keys(locales).length === 0) {
      console.warn(`   Warning: exercise "${slug}" has no instruction files — skipping`);
      continue;
    }

    // Read stubs and solutions per language
    const stubs = {};
    const solutions = {};

    for (const [language, ext] of Object.entries(LANGUAGE_EXTENSIONS)) {
      const stubContent = readFileOrNull(path.join(exercisePath, `stub${ext}`));
      const solutionContent = readFileOrNull(path.join(exercisePath, `solution${ext}`));

      if (stubContent !== null) {
        stubs[language] = stubContent;
      }
      if (solutionContent !== null) {
        solutions[language] = solutionContent;
      }
    }

    // Read per-locale message catalogs (curriculum-owned i18n dicts). These are
    // decoupled from instruction locales: an exercise can ship a `hu` message
    // dict for its runtime logic-error strings without a `hu` instructions file.
    // Each catalog is emitted as a standalone artifact and fetched by the ACTIVE
    // UI locale at runtime, independent of the (content) instruction locale.
    const messages = {};
    const localesDir = path.join(exercisePath, "locales");
    if (fs.existsSync(localesDir)) {
      const localeDirs = fs.readdirSync(localesDir, { withFileTypes: true }).filter((d) => d.isDirectory());
      for (const localeDir of localeDirs) {
        const translationPath = path.join(localesDir, localeDir.name, "translation.json");
        const raw = readFileOrNull(translationPath);
        if (raw === null) {
          continue;
        }
        try {
          messages[localeDir.name] = JSON.parse(raw);
        } catch (error) {
          throw new Error(`Invalid JSON in ${translationPath}: ${error.message}`);
        }
      }
    }

    // Merge the family base catalog (authored once) into each locale's dict, so
    // the shared base-class strings are duplicated only in build output, never in
    // source. Member keys win over base keys on collision.
    const family = deriveFamily(exercisePath);
    const baseLocales = family ? baseCatalogs[family] : undefined;
    if (baseLocales) {
      const allLocales = new Set([...Object.keys(baseLocales), ...Object.keys(messages)]);
      for (const locale of allLocales) {
        messages[locale] = deepMerge(baseLocales[locale] || {}, messages[locale] || {});
      }
    }

    exercises[slug] = { metadata, locales, stubs, solutions, messages };
  }

  return exercises;
}

/**
 * Build the prose indexes (per locale), the code indexes (per language), the
 * prose and code artifacts, and the i18n message dicts (per exercise/locale).
 * Returns { indexHashes, codeIndexHashes, messageHashes }.
 */
function buildStaticFiles(exercises) {
  // Emit per-exercise per-locale message dicts as standalone, content-hashed
  // artifacts under the i18n tree. Fetched by the active UI locale at runtime and
  // injected into the exercise instance via `setMessages` — decoupled from the
  // instruction/content locale, so a `hu` dict can be delivered even without `hu`
  // instructions. messageHashes[slug][locale] = hash.
  const messageHashes = {};
  for (const [slug, exercise] of Object.entries(exercises)) {
    for (const [locale, dict] of Object.entries(exercise.messages)) {
      const content = JSON.stringify(dict);
      const hash = computeHash(content);
      if (!messageHashes[slug]) {
        messageHashes[slug] = {};
      }
      messageHashes[slug][locale] = hash;
      writeFile(path.join(I18N_DIR, slug, locale, `messages-${hash}.json`), content);
    }
  }

  // --- code: one artifact per (slug, language), no locale anywhere ------------
  //
  // codeBy[language][slug] = hash. A language an exercise ships neither a stub
  // nor a solution for is absent rather than empty, so the code index says which
  // languages an exercise actually supports.
  const codeBy = {};

  for (const [slug, exercise] of Object.entries(exercises)) {
    for (const language of LANGUAGES) {
      const stub = exercise.stubs[language];
      const solution = exercise.solutions[language];

      if (stub === undefined && solution === undefined) {
        continue;
      }

      const codeFile = JSON.stringify({ stub: stub || "", solution: solution || "" });
      const codeHash = computeHash(codeFile);
      writeFile(path.join(STATIC_DIR, slug, "code", language, `code-${codeHash}.json`), codeFile);

      if (!codeBy[language]) {
        codeBy[language] = {};
      }
      codeBy[language][slug] = codeHash;
    }
  }

  // --- prose: one artifact per (slug, locale), no language anywhere -----------
  const byLocale = {};

  for (const [slug, exercise] of Object.entries(exercises)) {
    for (const [locale, localeData] of Object.entries(exercise.locales)) {
      if (!byLocale[locale]) {
        byLocale[locale] = [];
      }

      const proseFile = JSON.stringify({ instructions: localeData.instructions });
      const proseHash = computeHash(proseFile);
      writeFile(path.join(STATIC_DIR, slug, locale, `prose-${proseHash}.json`), proseFile);

      byLocale[locale].push({
        slug,
        title: localeData.title,
        description: localeData.description,
        proseHash
      });
    }
  }

  // Sort each locale's exercises by slug for deterministic output
  for (const entries of Object.values(byLocale)) {
    entries.sort((a, b) => a.slug.localeCompare(b.slug));
  }

  // Write the prose indexes and collect their hashes
  const indexHashes = {};

  for (const [locale, entries] of Object.entries(byLocale)) {
    const indexContent = JSON.stringify(entries);
    const indexHash = computeHash(indexContent);
    indexHashes[locale] = indexHash;

    writeFile(path.join(STATIC_DIR, locale, `index-${indexHash}.json`), indexContent);

    // A LOCAL pointer for every non-default locale, so `pnpm dev` can serve
    // translated exercises with no i18n checkout: the client resolves a
    // non-English index hash from a pointer and never from the compiled
    // manifest, so without one there is nothing for it to read.
    //
    // These are never uploaded. `static:upload` excludes them, because on R2 the
    // i18n repo is the single writer of every non-English pointer and two
    // writers of one mutable object is exactly the race the pointer design
    // exists to avoid. Locally there is only ever one writer too: whichever of
    // the two most recently wrote this tree.
    if (locale !== DEFAULT_LOCALE) {
      writeFile(path.join(STATIC_DIR, locale, "current.json"), `${JSON.stringify({ hash: indexHash })}\n`);
    }
  }

  // Write the code indexes and collect their hashes. Keys are emitted in sorted
  // order because a JSON object's key order is part of its bytes, and its bytes
  // are its filename.
  const codeIndexHashes = {};

  for (const [language, slugHashes] of Object.entries(codeBy)) {
    const ordered = {};
    for (const slug of Object.keys(slugHashes).sort()) {
      ordered[slug] = slugHashes[slug];
    }
    const indexContent = JSON.stringify(ordered);
    const indexHash = computeHash(indexContent);
    codeIndexHashes[language] = indexHash;

    writeFile(path.join(STATIC_DIR, "code", language, `index-${indexHash}.json`), indexContent);
  }

  return { indexHashes, codeIndexHashes, messageHashes };
}

/**
 * Write the index hash manifests.
 *
 * `exerciseIndexHashes` (locale -> prose index hash) is read for the DEFAULT
 * locale only: every other locale resolves its hash at runtime from the pointer
 * the i18n repo rewrites on publish. The non-default entries are still written,
 * because they are what a local build without R2 runs on and what makes the
 * English and translated paths comparable in dev.
 *
 * `exerciseCodeIndexHashes` (language -> code index hash) has no pointer and
 * never will. Code is front-end owned and ships with the deploy, so its hash is
 * compiled in and is correct by construction.
 */
function writeHashManifest(indexHashes, codeIndexHashes) {
  const format = (hashes) =>
    Object.entries(hashes)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, hash]) => `  ${JSON.stringify(key)}: ${JSON.stringify(hash)}`)
      .join(",\n");

  const content = `// Auto-generated by scripts/generate-exercise-cache.js — DO NOT EDIT
export const exerciseIndexHashes: Record<string, string> = {
${format(indexHashes)},
};

export const exerciseCodeIndexHashes: Record<string, string> = {
${format(codeIndexHashes)},
};
`;

  writeFile(path.join(GENERATED_DIR, "exercise-hashes.ts"), content);
}

/**
 * Write the i18n message-dict hash manifest (slug -> locale -> messages hash),
 * deterministically ordered.
 */
function writeMessageHashManifest(messageHashes) {
  const body = Object.keys(messageHashes)
    .sort()
    .map((slug) => {
      const inner = Object.keys(messageHashes[slug])
        .sort()
        .map((locale) => `    ${JSON.stringify(locale)}: ${JSON.stringify(messageHashes[slug][locale])}`)
        .join(",\n");
      return `  ${JSON.stringify(slug)}: {\n${inner}\n  }`;
    })
    .join(",\n");

  const content = `// Auto-generated by scripts/generate-exercise-cache.js — DO NOT EDIT
export const exerciseMessageHashes: Record<string, Record<string, string>> = {
${body}
};
`;

  writeFile(path.join(GENERATED_DIR, "exercise-message-hashes.ts"), content);
}

/**
 * Main generation function
 */
function generateExerciseCache() {
  console.log("Generating exercise cache...\n");

  // Clean output directories
  if (fs.existsSync(STATIC_DIR)) {
    fs.rmSync(STATIC_DIR, { recursive: true });
  }
  if (fs.existsSync(I18N_DIR)) {
    fs.rmSync(I18N_DIR, { recursive: true });
  }
  fs.mkdirSync(STATIC_DIR, { recursive: true });
  fs.mkdirSync(GENERATED_DIR, { recursive: true });

  // Process exercises
  const exercises = processExercises();

  // Build static files
  const { indexHashes, codeIndexHashes, messageHashes } = buildStaticFiles(exercises);

  // Write hash manifests
  writeHashManifest(indexHashes, codeIndexHashes);
  writeMessageHashManifest(messageHashes);

  // Count totals
  const exerciseCount = Object.keys(exercises).length;
  let proseFileCount = 0;
  let codeFileCount = 0;
  for (const exercise of Object.values(exercises)) {
    proseFileCount += Object.keys(exercise.locales).length;
    codeFileCount += new Set([...Object.keys(exercise.stubs), ...Object.keys(exercise.solutions)]).size;
  }

  console.log("Exercise cache generated successfully:\n");
  console.log(`   Exercises: ${exerciseCount}`);
  console.log(`   Locales: ${Object.keys(indexHashes).join(", ")}`);
  console.log(`   Languages: ${Object.keys(codeIndexHashes).join(", ")}`);
  console.log(`   Prose files: ${proseFileCount}`);
  console.log(`   Code files: ${codeFileCount}`);
  console.log(`   Output: ${STATIC_DIR}\n`);
}

// Run generation
try {
  generateExerciseCache();
} catch (error) {
  console.error("Failed to generate exercise cache:", error);
  process.exit(1);
}
