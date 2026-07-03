#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Seed Language Stubs
 *
 * Creates a `{locale}.md` placeholder for every concept, blog post, and article
 * that has an English (`en.md`) source but is missing the given locale. This
 * gives a new language a *complete* content tree immediately, so the concept /
 * content caches generate a full per-locale index instead of a partial one.
 * Real translations replace the stubs later.
 *
 * Existing files are never overwritten, so real translations (and re-runs) are
 * safe.
 *
 * Usage:
 *   node scripts/seed-language.js <locale>
 *   pnpm seed-language <locale>
 *
 * Each stub carries the frontmatter its generator reads for the summary line —
 * concepts use `description`, blog + articles use `excerpt` — filled with
 * obvious placeholder text.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_LOCALE = "en";

// Content sets to seed. `descriptionKey` is the frontmatter field each type's
// generator reads for the summary: concepts read `description`, blog/articles
// read `excerpt`.
const CONTENT_SETS = [
  { name: "concepts", dir: path.join(__dirname, "../../curriculum/src/concepts"), descriptionKey: "description" },
  { name: "blog", dir: path.join(__dirname, "../../content/src/posts/blog"), descriptionKey: "excerpt" },
  { name: "articles", dir: path.join(__dirname, "../../content/src/posts/articles"), descriptionKey: "excerpt" }
];

function buildStub(slug, locale, descriptionKey, includeBody) {
  const frontmatter = `---
title: "${slug} - ${locale}"
${descriptionKey}: "Stub description for ${slug}"
---
`;
  // Category concepts render no body (the generator warns and ignores it), so
  // their stubs are frontmatter-only.
  return includeBody ? `${frontmatter}\nStub content for ${locale}\n` : frontmatter;
}

// Concept category dirs (config.json `category: true`) have no body content.
function hasBody(slugPath) {
  const configPath = path.join(slugPath, "config.json");
  if (!fs.existsSync(configPath)) {
    return true;
  }
  try {
    return JSON.parse(fs.readFileSync(configPath, "utf-8")).category !== true;
  } catch {
    return true;
  }
}

function seedSet({ name, dir, descriptionKey }, locale) {
  if (!fs.existsSync(dir)) {
    console.warn(`  ${name}: directory not found (${dir}) — skipping`);
    return { created: 0, skipped: 0 };
  }

  let created = 0;
  let skipped = 0;

  const slugDirs = fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory());
  for (const slugDir of slugDirs) {
    const slugPath = path.join(dir, slugDir.name);

    // Only seed real content dirs — those with an English source to mirror.
    if (!fs.existsSync(path.join(slugPath, `${BASE_LOCALE}.md`))) {
      continue;
    }

    const targetPath = path.join(slugPath, `${locale}.md`);
    if (fs.existsSync(targetPath)) {
      skipped++;
      continue;
    }

    fs.writeFileSync(targetPath, buildStub(slugDir.name, locale, descriptionKey, hasBody(slugPath)));
    created++;
  }

  console.log(`  ${name}: ${created} created, ${skipped} already present`);
  return { created, skipped };
}

function main() {
  const locale = process.argv[2];
  if (!locale) {
    console.error("Usage: node scripts/seed-language.js <locale>   (e.g. hu)");
    process.exit(1);
  }
  if (locale === BASE_LOCALE) {
    console.error(`Refusing to seed the base locale "${BASE_LOCALE}" — it is the source content.`);
    process.exit(1);
  }

  console.log(`Seeding "${locale}" stubs for missing translations...\n`);

  let created = 0;
  let skipped = 0;
  for (const set of CONTENT_SETS) {
    const res = seedSet(set, locale);
    created += res.created;
    skipped += res.skipped;
  }

  console.log(`\nDone: ${created} stub file(s) created, ${skipped} skipped (already present).`);
}

main();
