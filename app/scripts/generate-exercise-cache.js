#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Exercise Cache Generation Script
 *
 * Reads exercise source files from curriculum and produces:
 *
 *   public/static/exercises/{locale}-{hash}.json
 *     - Metadata index: all exercises with title, description, contentHashes
 *
 *   public/static/exercises/{slug}/{locale}-{language}-{hash}.json
 *     - Content files: instructions, stub, solution per exercise/locale/language
 *
 *   lib/generated/exercise-hashes.ts
 *     - Hash manifest mapping locale -> metadata index hash
 *
 * Used by:
 * - Client-side exercise metadata API (title/description lookups)
 * - useExerciseLoader (instructions, stubs, solutions)
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXERCISES_DIR = path.join(__dirname, "../../curriculum/src/exercises");
const STATIC_DIR = path.join(__dirname, "../public/static/exercises");
const GENERATED_DIR = path.join(__dirname, "../lib/generated");

// Language name -> file extension mapping
const LANGUAGE_EXTENSIONS = {
  javascript: ".javascript",
  python: ".py",
  jikiscript: ".jiki"
};

const LANGUAGES = Object.keys(LANGUAGE_EXTENSIONS);

/**
 * Compute a 12-char SHA-256 hash of content
 */
function computeHash(content) {
  return crypto.createHash("sha256").update(content).digest("hex").slice(0, 12);
}

/**
 * Write a file, creating directories as needed
 */
function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

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

    exercises[slug] = { metadata, locales, stubs, solutions };
  }

  return exercises;
}

/**
 * Build metadata indexes (per locale) and content files (per exercise/locale/language).
 * Returns the index hashes for the manifest.
 */
function buildStaticFiles(exercises) {
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

        const contentPath = path.join(STATIC_DIR, slug, `${locale}-${language}-${contentHash}.json`);
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

    const indexPath = path.join(STATIC_DIR, `${locale}-${indexHash}.json`);
    writeFile(indexPath, indexContent);
  }

  return indexHashes;
}

/**
 * Write the TypeScript hash manifest
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
 * Main generation function
 */
function generateExerciseCache() {
  console.log("Generating exercise cache...\n");

  // Clean output directories
  if (fs.existsSync(STATIC_DIR)) {
    fs.rmSync(STATIC_DIR, { recursive: true });
  }
  fs.mkdirSync(STATIC_DIR, { recursive: true });
  fs.mkdirSync(GENERATED_DIR, { recursive: true });

  // Process exercises
  const exercises = processExercises();

  // Build static files
  const indexHashes = buildStaticFiles(exercises);

  // Write hash manifest
  writeHashManifest(indexHashes);

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
