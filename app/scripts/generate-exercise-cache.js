#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Exercise Cache Generation Script
 *
 * Reads exercise source files from curriculum and produces:
 *
 *   public/static/exercises/{locale}/index-{hash}.json
 *     - Metadata index: all exercises with title, description, contentHashes
 *
 *   public/static/exercises/{slug}/{locale}/{language}/content-{hash}.json
 *     - Content files: instructions, stub, solution per exercise/locale/language
 *
 *   public/static/i18n/exercises/{slug}/{locale}/messages-{hash}.json
 *     - Curriculum-owned i18n message dicts (runtime logic-error/errorHtml strings)
 *
 *   lib/generated/exercise-hashes.ts
 *     - Hash manifest mapping locale -> metadata index hash
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
import matter from "gray-matter";
import { computeHash, writeFile } from "./lib/cache-utils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXERCISES_DIR = path.join(__dirname, "../../curriculum/src/exercises");
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
 * Process all exercises and return structured data
 *
 * Returns: { [slug]: { metadata, locales: { [locale]: { title, description, instructions } }, stubs: { [lang]: string }, solutions: { [lang]: string } } }
 */
function processExercises() {
  const exercises = {};

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
        const locale = path.basename(file.name, ".md");
        const filePath = path.join(instructionsDir, file.name);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const parsed = matter(fileContent);

        if (!parsed.data.title) {
          throw new Error(`Missing title in frontmatter of ${filePath}`);
        }

        locales[locale] = {
          title: parsed.data.title,
          description: parsed.data.description || "",
          instructions: parsed.content.trim()
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

    exercises[slug] = { metadata, locales, stubs, solutions, messages };
  }

  return exercises;
}

/**
 * Build metadata indexes (per locale), content files (per exercise/locale/language),
 * and i18n message dicts (per exercise/locale). Returns { indexHashes, messageHashes }.
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

  // Group exercises by locale for metadata indexes
  const byLocale = {};

  for (const [slug, exercise] of Object.entries(exercises)) {
    for (const locale of Object.keys(exercise.locales)) {
      if (!byLocale[locale]) {
        byLocale[locale] = [];
      }

      // Build content files for each language in this locale and collect hashes
      const contentHashes = {};

      for (const language of LANGUAGES) {
        const stub = exercise.stubs[language];
        const solution = exercise.solutions[language];

        if (stub === undefined && solution === undefined) {
          continue; // Skip languages with no stub or solution
        }

        const localeData = exercise.locales[locale];
        const contentFile = JSON.stringify({
          instructions: localeData.instructions,
          stub: stub || "",
          solution: solution || ""
        });

        const contentHash = computeHash(contentFile);
        contentHashes[language] = contentHash;

        const contentPath = path.join(STATIC_DIR, slug, locale, language, `content-${contentHash}.json`);
        writeFile(contentPath, contentFile);
      }

      byLocale[locale].push({
        slug,
        title: exercise.locales[locale].title,
        description: exercise.locales[locale].description,
        contentHashes
      });
    }
  }

  // Sort each locale's exercises by slug for deterministic output
  for (const exercises of Object.values(byLocale)) {
    exercises.sort((a, b) => a.slug.localeCompare(b.slug));
  }

  // Write metadata indexes and collect index hashes
  const indexHashes = {};

  for (const [locale, entries] of Object.entries(byLocale)) {
    const indexContent = JSON.stringify(entries);
    const indexHash = computeHash(indexContent);
    indexHashes[locale] = indexHash;

    const indexPath = path.join(STATIC_DIR, locale, `index-${indexHash}.json`);
    writeFile(indexPath, indexContent);
  }

  return { indexHashes, messageHashes };
}

/**
 * Write the metadata-index hash manifest (locale -> index hash).
 */
function writeHashManifest(indexHashes) {
  const entries = Object.entries(indexHashes)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([locale, hash]) => `  ${JSON.stringify(locale)}: ${JSON.stringify(hash)}`)
    .join(",\n");

  const content = `// Auto-generated by scripts/generate-exercise-cache.js — DO NOT EDIT
export const exerciseIndexHashes: Record<string, string> = {
${entries},
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
  const { indexHashes, messageHashes } = buildStaticFiles(exercises);

  // Write hash manifests
  writeHashManifest(indexHashes);
  writeMessageHashManifest(messageHashes);

  // Count totals
  const exerciseCount = Object.keys(exercises).length;
  let contentFileCount = 0;
  for (const exercise of Object.values(exercises)) {
    const localeCount = Object.keys(exercise.locales).length;
    const langCount = Object.keys(exercise.stubs).length;
    contentFileCount += localeCount * langCount;
  }

  console.log("Exercise cache generated successfully:\n");
  console.log(`   Exercises: ${exerciseCount}`);
  console.log(`   Locales: ${Object.keys(indexHashes).join(", ")}`);
  console.log(`   Content files: ${contentFileCount}`);
  console.log(`   Output: ${STATIC_DIR}\n`);
}

// Run generation
try {
  generateExerciseCache();
} catch (error) {
  console.error("Failed to generate exercise cache:", error);
  process.exit(1);
}
