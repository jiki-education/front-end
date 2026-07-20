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
