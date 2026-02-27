#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Concept Cache Generation Script
 *
 * Reads concept source files from curriculum and produces:
 *
 *   public/static/concepts/{locale}-{hash}.json
 *     - Metadata index: all concepts with slug, title, description, hierarchy, contentHash
 *
 *   public/static/concepts/{slug}/{locale}-{hash}.html
 *     - Content files: pre-rendered HTML from markdown
 *
 *   lib/generated/concept-hashes.ts
 *     - Hash manifest mapping locale -> metadata index hash
 *
 *   lib/generated/concept-meta-server.json
 *     - Minimal metadata for server-side SEO (slug, title, description)
 *
 * Used by:
 * - Client-side concept API (lib/api/concepts.ts)
 * - Server-side metadata generation (lib/concepts/metadata.ts)
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import { marked } from "marked";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONCEPTS_DIR = path.join(__dirname, "../../curriculum/src/concepts");
const EXERCISE_MAP_PATH = path.join(__dirname, "../../curriculum/dist/concepts/exercise-map.json");
const STATIC_DIR = path.join(__dirname, "../public/static/concepts");
const GENERATED_DIR = path.join(__dirname, "../lib/generated");

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
 * Process all concepts and return structured data
 *
 * Returns: { [slug]: { config, locales: { [locale]: { title, description, html } } } }
 */
function processConcepts() {
  const concepts = {};

  if (!fs.existsSync(CONCEPTS_DIR)) {
    console.error(`Concepts directory not found: ${CONCEPTS_DIR}`);
    return concepts;
  }

  // Load exercise-concept mapping
  let exerciseMap = {};
  if (fs.existsSync(EXERCISE_MAP_PATH)) {
    exerciseMap = JSON.parse(fs.readFileSync(EXERCISE_MAP_PATH, "utf-8"));
  }

  const slugDirs = fs.readdirSync(CONCEPTS_DIR, { withFileTypes: true }).filter((d) => d.isDirectory());

  // First pass: collect all configs to compute childrenCount
  const allConfigs = {};
  for (const slugDir of slugDirs) {
    const slug = slugDir.name;
    const configPath = path.join(CONCEPTS_DIR, slug, "config.json");

    if (!fs.existsSync(configPath)) {
      throw new Error(`Missing config.json for concept ${slug}`);
    }

    allConfigs[slug] = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  }

  // Compute childrenCount
  const childrenCount = {};
  for (const [slug, config] of Object.entries(allConfigs)) {
    childrenCount[slug] = childrenCount[slug] || 0;
    if (config.parent) {
      childrenCount[config.parent] = (childrenCount[config.parent] || 0) + 1;
    }
  }

  // Validate parent references
  for (const [slug, config] of Object.entries(allConfigs)) {
    if (config.parent && !allConfigs[config.parent]) {
      throw new Error(`Concept ${slug} references non-existent parent: ${config.parent}`);
    }
  }

  // Second pass: process markdown files
  for (const slugDir of slugDirs) {
    const slug = slugDir.name;
    const slugPath = path.join(CONCEPTS_DIR, slug);
    const config = allConfigs[slug];

    const mdFiles = fs
      .readdirSync(slugPath, { withFileTypes: true })
      .filter((f) => f.isFile() && f.name.endsWith(".md"));

    const locales = {};

    for (const file of mdFiles) {
      const locale = path.basename(file.name, ".md");
      const filePath = path.join(slugPath, file.name);

      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const parsed = matter(fileContent);
        const frontmatter = parsed.data;
        const markdown = parsed.content;

        if (!frontmatter.title) {
          throw new Error(`Missing title in frontmatter of ${filePath}`);
        }
        if (!frontmatter.description) {
          throw new Error(`Missing description in frontmatter of ${filePath}`);
        }

        // Render markdown to HTML for non-category concepts
        let html = null;
        if (!config.category) {
          html = marked.parse(markdown);
        } else if (markdown.trim()) {
          console.warn(`   Warning: category concept "${slug}" has body content in ${file.name} — it will be ignored`);
        }

        locales[locale] = {
          title: frontmatter.title,
          description: frontmatter.description,
          html
        };
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
        throw error;
      }
    }

    if (Object.keys(locales).length === 0) {
      console.warn(`   Warning: concept "${slug}" has no markdown files — skipping`);
      continue;
    }

    concepts[slug] = {
      config,
      exerciseSlugs: exerciseMap[slug] || [],
      childrenCount: childrenCount[slug] || 0,
      locales
    };
  }

  return concepts;
}

/**
 * Build metadata indexes and content files.
 * Returns the index hashes for the manifest.
 */
function buildStaticFiles(concepts) {
  const byLocale = {};

  for (const [slug, concept] of Object.entries(concepts)) {
    for (const [locale, localeData] of Object.entries(concept.locales)) {
      if (!byLocale[locale]) {
        byLocale[locale] = [];
      }

      // Write content file for non-category concepts
      let contentHash = null;
      if (localeData.html !== null) {
        contentHash = computeHash(localeData.html);
        const contentPath = path.join(STATIC_DIR, slug, `${locale}-${contentHash}.html`);
        writeFile(contentPath, localeData.html);
      }

      byLocale[locale].push({
        slug,
        title: localeData.title,
        description: localeData.description,
        parentSlug: concept.config.parent || null,
        order: concept.config.order || 0,
        category: concept.config.category || false,
        childrenCount: concept.childrenCount,
        exerciseSlugs: concept.exerciseSlugs,
        contentHash
      });
    }
  }

  // Sort each locale's concepts by order for deterministic output
  for (const conceptList of Object.values(byLocale)) {
    conceptList.sort((a, b) => a.order - b.order);
  }

  // Write metadata indexes and collect hashes
  const indexHashes = {};

  for (const [locale, entries] of Object.entries(byLocale)) {
    const indexContent = JSON.stringify(entries);
    const indexHash = computeHash(indexContent);
    indexHashes[locale] = indexHash;

    const indexPath = path.join(STATIC_DIR, `${locale}-${indexHash}.json`);
    writeFile(indexPath, indexContent);
  }

  return { indexHashes, byLocale };
}

/**
 * Write the TypeScript hash manifest
 */
function writeHashManifest(indexHashes) {
  const entries = Object.entries(indexHashes)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([locale, hash]) => `  ${JSON.stringify(locale)}: ${JSON.stringify(hash)}`)
    .join(",\n");

  const content = `// Auto-generated by scripts/generate-concept-cache.js — DO NOT EDIT
export const conceptIndexHashes: Record<string, string> = {
${entries},
};
`;

  writeFile(path.join(GENERATED_DIR, "concept-hashes.ts"), content);
}

/**
 * Write the server-side metadata JSON (for SEO)
 */
function writeServerMeta(byLocale) {
  // Use English locale for server-side metadata (SEO)
  const enConcepts = byLocale["en"] || [];
  const serverMeta = enConcepts.map((c) => ({
    slug: c.slug,
    title: c.title,
    description: c.description
  }));

  writeFile(path.join(GENERATED_DIR, "concept-meta-server.json"), JSON.stringify(serverMeta, null, 2));
}

/**
 * Main generation function
 */
function generateConceptCache() {
  console.log("Generating concept cache...\n");

  // Clean output directory
  if (fs.existsSync(STATIC_DIR)) {
    fs.rmSync(STATIC_DIR, { recursive: true });
  }
  fs.mkdirSync(STATIC_DIR, { recursive: true });
  fs.mkdirSync(GENERATED_DIR, { recursive: true });

  // Process concepts
  const concepts = processConcepts();

  // Build static files
  const { indexHashes, byLocale } = buildStaticFiles(concepts);

  // Write hash manifest
  writeHashManifest(indexHashes);

  // Write server-side metadata
  writeServerMeta(byLocale);

  // Count totals
  const conceptCount = Object.keys(concepts).length;
  let contentFileCount = 0;
  for (const concept of Object.values(concepts)) {
    for (const localeData of Object.values(concept.locales)) {
      if (localeData.html !== null) {
        contentFileCount++;
      }
    }
  }

  console.log("Concept cache generated successfully:\n");
  console.log(`   Concepts: ${conceptCount}`);
  console.log(`   Locales: ${Object.keys(indexHashes).join(", ")}`);
  console.log(`   Content files: ${contentFileCount}`);
  console.log(`   Output: ${STATIC_DIR}\n`);
}

// Run generation
try {
  generateConceptCache();
} catch (error) {
  console.error("Failed to generate concept cache:", error);
  process.exit(1);
}
