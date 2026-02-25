#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Content Cache Generation Script
 *
 * Processes markdown files from the content package and writes them to
 * .content-cache/ in a flat file structure matching R2 storage keys:
 *
 *   blog/index/{locale}.json      - Metadata index for all blog posts
 *   blog/{slug}/{locale}.md       - Raw markdown (image paths fixed)
 *   articles/index/{locale}.json  - Metadata index for all articles
 *   articles/{slug}/{locale}.md   - Raw markdown (image paths fixed)
 *   concepts/index/{locale}.json  - Metadata index for all concepts
 *   concepts/{slug}/{locale}.md   - Raw markdown concept content
 *   search/articles-{locale}.json - Lunr search indexes
 *   manifest.json                 - All slugs, locales, and content hashes
 *
 * Used by:
 * - FilesystemContentLoader (local development)
 * - upload-content-to-r2.js (production deployment)
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import lunr from "lunr";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, "../../content/src/posts");
const AUTHORS_FILE = path.join(__dirname, "../../content/src/authors.json");
const CONCEPTS_DIR = path.join(__dirname, "../../curriculum/src/concepts");
const OUTPUT_DIR = path.join(__dirname, "../.content-cache");

// Load authors
let authorsData;
try {
  authorsData = JSON.parse(fs.readFileSync(AUTHORS_FILE, "utf-8"));
} catch (error) {
  console.error(`Failed to read authors file: ${AUTHORS_FILE}`);
  throw error;
}

const authorsJson = JSON.stringify(authorsData);

/**
 * Fix image paths in markdown content
 * Rewrites /images/ to /static/images/ for correct public/ serving
 */
function fixImagePaths(content) {
  return content.replace(/!\[([^\]]*)\]\(\/images\//g, "![$1](/static/images/");
}

/**
 * Fix coverImage path in config
 */
function fixCoverImagePath(coverImage) {
  if (coverImage && coverImage.startsWith("/images/")) {
    return coverImage.replace("/images/", "/static/images/");
  }
  return coverImage;
}

/**
 * Estimate reading time from markdown content
 */
function estimateReadingTime(markdownContent) {
  const wordsPerMinute = 200;
  const words = markdownContent.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/**
 * Compute content hash for a given slug/locale
 */
function computeContentHash(markdownContent, configJson) {
  const hash = crypto.createHash("sha256");
  hash.update(markdownContent);
  hash.update(configJson);
  hash.update(authorsJson);
  return hash.digest("hex").slice(0, 12);
}

/**
 * Write a file, creating directories as needed
 */
function writeOutputFile(relativePath, content) {
  const fullPath = path.join(OUTPUT_DIR, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

/**
 * Process a content directory (blog or articles) and return processed data
 */
function processContentDir(type, requiredFields, extraFields) {
  const contentDir = path.join(CONTENT_DIR, type);
  const result = {};

  if (!fs.existsSync(contentDir)) {
    return result;
  }

  const slugDirs = fs.readdirSync(contentDir, { withFileTypes: true }).filter((d) => d.isDirectory());

  for (const slugDir of slugDirs) {
    const slug = slugDir.name;
    const slugPath = path.join(contentDir, slug);
    const configPath = path.join(slugPath, "config.json");

    if (!fs.existsSync(configPath)) {
      throw new Error(`Missing config.json for ${type}/${slug}`);
    }

    let config;
    try {
      config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    } catch (error) {
      throw new Error(`Invalid JSON in ${configPath}: ${error.message}`);
    }

    const configJson = JSON.stringify(config);

    for (const field of requiredFields) {
      if (config[field] === undefined) {
        throw new Error(`Missing required field "${field}" in ${configPath}`);
      }
    }

    const mdFiles = fs
      .readdirSync(slugPath, { withFileTypes: true })
      .filter((f) => f.isFile() && f.name.endsWith(".md"));

    result[slug] = {};

    for (const file of mdFiles) {
      const locale = path.basename(file.name, ".md");
      const filePath = path.join(slugPath, file.name);

      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const parsed = matter(fileContent);
        const frontmatter = parsed.data;
        const fixedMarkdown = fixImagePaths(parsed.content);

        const author = authorsData[config.author];
        if (!author) {
          throw new Error(`Author not found: ${config.author} in ${filePath}`);
        }

        const contentHash = computeContentHash(fileContent, configJson);
        const readingTime = estimateReadingTime(fixedMarkdown);

        // Write the raw markdown file
        writeOutputFile(`${type}/${slug}/${locale}.md`, fixedMarkdown);

        // Build metadata entry
        const meta = {
          slug,
          title: frontmatter.title,
          date: config.date,
          excerpt: frontmatter.excerpt,
          author,
          tags: frontmatter.tags || [],
          seo: frontmatter.seo || { description: frontmatter.excerpt, keywords: [] },
          readingTime,
          contentHash,
          locale,
          ...extraFields(config)
        };

        result[slug][locale] = meta;
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
        throw error;
      }
    }
  }

  return result;
}

/**
 * Build per-locale metadata index files
 */
function buildMetadataIndexes(type, content) {
  const byLocale = {};

  for (const [, locales] of Object.entries(content)) {
    for (const [locale, meta] of Object.entries(locales)) {
      if (!byLocale[locale]) {
        byLocale[locale] = [];
      }
      byLocale[locale].push(meta);
    }
  }

  for (const [locale, posts] of Object.entries(byLocale)) {
    writeOutputFile(`${type}/index/${locale}.json`, JSON.stringify({ posts }, null, 2));
  }
}

/**
 * Build the manifest file with all slugs, locales, and hashes
 */
function buildManifest(blog, articles, concepts) {
  const manifest = {
    blog: [],
    articles: [],
    concepts: []
  };

  for (const [slug, locales] of Object.entries(blog)) {
    for (const locale of Object.keys(locales)) {
      manifest.blog.push({ slug, locale });
    }
  }

  for (const [slug, locales] of Object.entries(articles)) {
    for (const locale of Object.keys(locales)) {
      manifest.articles.push({ slug, locale });
    }
  }

  for (const [slug, locales] of Object.entries(concepts)) {
    for (const locale of Object.keys(locales)) {
      manifest.concepts.push({ slug, locale });
    }
  }

  writeOutputFile("manifest.json", JSON.stringify(manifest, null, 2));
}

/**
 * Generate Lunr search indexes for articles (one per locale)
 */
function generateSearchIndexes(articles) {
  const articlesByLocale = {};

  for (const [, locales] of Object.entries(articles)) {
    for (const [locale, article] of Object.entries(locales)) {
      if (!articlesByLocale[locale]) {
        articlesByLocale[locale] = [];
      }
      if (article.listed) {
        articlesByLocale[locale].push(article);
      }
    }
  }

  for (const [locale, localeArticles] of Object.entries(articlesByLocale)) {
    const idx = lunr(function () {
      this.ref("slug");
      this.field("title", { boost: 10 });
      this.field("excerpt", { boost: 5 });
      this.field("description", { boost: 4 });
      this.field("keywords", { boost: 3 });

      for (const article of localeArticles) {
        this.add({
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          description: article.seo.description,
          keywords: article.seo.keywords.join(" ")
        });
      }
    });

    const metadata = localeArticles.map((a) => ({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt
    }));

    const output = { index: idx.toJSON(), articles: metadata };
    writeOutputFile(`search/articles-${locale}.json`, JSON.stringify(output));
    console.log(`   Search index: articles-${locale}.json (${localeArticles.length} articles)`);
  }
}

/**
 * Process concepts from curriculum/src/concepts/
 * Returns { [slug]: { [locale]: conceptMeta } }
 */
function processConcepts() {
  const result = {};

  if (!fs.existsSync(CONCEPTS_DIR)) {
    return result;
  }

  // Load exercise-concept mapping if available
  const exerciseMapPath = path.join(CONCEPTS_DIR, "exercise-map.json");
  let exerciseMap = {};
  if (fs.existsSync(exerciseMapPath)) {
    exerciseMap = JSON.parse(fs.readFileSync(exerciseMapPath, "utf-8"));
  }

  const slugDirs = fs.readdirSync(CONCEPTS_DIR, { withFileTypes: true }).filter((d) => d.isDirectory());

  // First pass: collect all concepts to compute childrenCount
  const allConfigs = {};
  for (const slugDir of slugDirs) {
    const slug = slugDir.name;
    const configPath = path.join(CONCEPTS_DIR, slug, "config.json");

    if (!fs.existsSync(configPath)) {
      throw new Error(`Missing config.json for concept ${slug}`);
    }

    allConfigs[slug] = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  }

  // Compute childrenCount for each concept
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

    result[slug] = {};

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

        // Write the raw markdown body (stripped of frontmatter)
        writeOutputFile(`concepts/${slug}/${locale}.md`, markdown);

        // Build metadata entry
        const meta = {
          slug,
          title: frontmatter.title,
          description: frontmatter.description,
          parentSlug: config.parent || null,
          order: config.order || 0,
          childrenCount: childrenCount[slug] || 0,
          exerciseSlugs: exerciseMap[slug] || []
        };

        result[slug][locale] = meta;
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
        throw error;
      }
    }
  }

  return result;
}

/**
 * Build per-locale concept index files
 */
function buildConceptIndexes(concepts) {
  const byLocale = {};

  for (const [, locales] of Object.entries(concepts)) {
    for (const [locale, meta] of Object.entries(locales)) {
      if (!byLocale[locale]) {
        byLocale[locale] = [];
      }
      byLocale[locale].push(meta);
    }
  }

  for (const [locale, conceptList] of Object.entries(byLocale)) {
    // Sort by order within parent groups
    conceptList.sort((a, b) => a.order - b.order);
    writeOutputFile(`concepts/index/${locale}.json`, JSON.stringify({ concepts: conceptList }, null, 2));
  }
}

/**
 * Main generation function
 */
function generateContentCache() {
  console.log("Generating content cache...\n");

  // Clean output directory
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Process blog posts
  const blog = processContentDir("blog", ["date", "author", "featured", "coverImage"], (config) => ({
    featured: config.featured,
    coverImage: fixCoverImagePath(config.coverImage) || ""
  }));

  // Process articles
  const articles = processContentDir("articles", ["date", "author", "listed"], (config) => ({
    listed: config.listed
  }));

  // Process concepts
  const concepts = processConcepts();

  // Write metadata indexes
  buildMetadataIndexes("blog", blog);
  buildMetadataIndexes("articles", articles);
  buildConceptIndexes(concepts);

  // Write manifest
  buildManifest(blog, articles, concepts);

  // Write search indexes
  generateSearchIndexes(articles);

  // Count totals
  let totalTranslations = 0;
  for (const locales of Object.values(blog)) {
    totalTranslations += Object.keys(locales).length;
  }
  for (const locales of Object.values(articles)) {
    totalTranslations += Object.keys(locales).length;
  }
  for (const locales of Object.values(concepts)) {
    totalTranslations += Object.keys(locales).length;
  }

  console.log("\nContent cache generated successfully:\n");
  console.log(`   Blog posts: ${Object.keys(blog).length} slugs`);
  console.log(`   Articles: ${Object.keys(articles).length} slugs`);
  console.log(`   Concepts: ${Object.keys(concepts).length} slugs`);
  console.log(`   Total translations: ${totalTranslations}`);
  console.log(`   Output: ${OUTPUT_DIR}\n`);
}

// Run generation
try {
  generateContentCache();
} catch (error) {
  console.error("Failed to generate content cache:", error);
  process.exit(1);
}
