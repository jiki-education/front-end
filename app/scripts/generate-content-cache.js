#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Content Cache Generation Script
 *
 * Processes markdown files from the content package and produces:
 *
 *   public/static/content/blog/{locale}-{hash}.json
 *     - Metadata index: all blog posts with slug, title, date, etc.
 *
 *   public/static/content/blog/{slug}/{locale}-{hash}.html
 *     - Content files: pre-rendered HTML from markdown
 *
 *   public/static/content/articles/{locale}-{hash}.json
 *     - Metadata index: all articles
 *
 *   public/static/content/articles/{slug}/{locale}-{hash}.html
 *     - Content files: pre-rendered HTML from markdown
 *
 *   public/static/content/search/articles-{locale}-{hash}.json
 *     - Lunr search indexes for articles
 *
 *   lib/generated/content-hashes.ts
 *     - Hash manifest mapping type+locale -> metadata index hash
 *
 *   lib/generated/content-meta-server.json
 *     - Full metadata for server-side rendering (SEO, list pages)
 *
 * Used by:
 * - Server-side content functions (lib/content/)
 * - Client-side search (lib/api/content-search.ts)
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import { marked } from "marked";
import lunr from "lunr";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, "../../content/src/posts");
const AUTHORS_FILE = path.join(__dirname, "../../content/src/authors.json");
const STATIC_DIR = path.join(__dirname, "../public/static/content");
const GENERATED_DIR = path.join(__dirname, "../lib/generated");

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
 * Process a content directory (blog or articles) and return processed data
 *
 * Returns: { [slug]: { [locale]: { meta, html } } }
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

        // Pre-render markdown to HTML
        const html = marked.parse(fixedMarkdown);

        // Hash based on all inputs that affect the output
        const hashInput = crypto.createHash("sha256");
        hashInput.update(fileContent);
        hashInput.update(configJson);
        hashInput.update(authorsJson);
        const contentHash = hashInput.digest("hex").slice(0, 12);

        const readingTime = estimateReadingTime(fixedMarkdown);

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

        result[slug][locale] = { meta, html };
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
        throw error;
      }
    }
  }

  return result;
}

/**
 * Build static files for a content type (blog or articles).
 * Returns { indexHashes, byLocale } where byLocale maps locale -> [meta entries]
 */
function buildStaticFiles(type, content) {
  const byLocale = {};

  for (const [slug, locales] of Object.entries(content)) {
    for (const [locale, { meta, html }] of Object.entries(locales)) {
      if (!byLocale[locale]) {
        byLocale[locale] = [];
      }

      // Write pre-rendered HTML content file
      const htmlHash = computeHash(html);
      const contentPath = path.join(STATIC_DIR, type, slug, `${locale}-${htmlHash}.html`);
      writeFile(contentPath, html);

      // Use the HTML hash as contentHash in the index (for URL construction)
      byLocale[locale].push({ ...meta, contentHash: htmlHash });
    }
  }

  // Write metadata indexes and collect hashes
  const indexHashes = {};

  for (const [locale, entries] of Object.entries(byLocale)) {
    const indexContent = JSON.stringify(entries);
    const indexHash = computeHash(indexContent);
    indexHashes[locale] = indexHash;

    const indexPath = path.join(STATIC_DIR, type, `${locale}-${indexHash}.json`);
    writeFile(indexPath, indexContent);
  }

  return { indexHashes, byLocale };
}

/**
 * Generate Lunr search indexes for articles (one per locale)
 * Returns search index hashes per locale
 */
function generateSearchIndexes(articlesByLocale) {
  const searchHashes = {};

  for (const [locale, articles] of Object.entries(articlesByLocale)) {
    const listedArticles = articles.filter((a) => a.listed);

    const idx = lunr(function () {
      this.ref("slug");
      this.field("title", { boost: 10 });
      this.field("excerpt", { boost: 5 });
      this.field("description", { boost: 4 });
      this.field("keywords", { boost: 3 });

      for (const article of listedArticles) {
        this.add({
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          description: article.seo.description,
          keywords: article.seo.keywords.join(" ")
        });
      }
    });

    const metadata = listedArticles.map((a) => ({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt
    }));

    const output = JSON.stringify({ index: idx.toJSON(), articles: metadata });
    const searchHash = computeHash(output);
    searchHashes[locale] = searchHash;

    const searchPath = path.join(STATIC_DIR, "search", `articles-${locale}-${searchHash}.json`);
    writeFile(searchPath, output);
    console.log(`   Search index: articles-${locale}-${searchHash}.json (${listedArticles.length} articles)`);
  }

  return searchHashes;
}

/**
 * Write the TypeScript hash manifest
 */
function writeHashManifest(blogHashes, articleHashes, searchHashes) {
  function formatEntries(hashes) {
    return Object.entries(hashes)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([locale, hash]) => `    ${JSON.stringify(locale)}: ${JSON.stringify(hash)}`)
      .join(",\n");
  }

  const content = `// Auto-generated by scripts/generate-content-cache.js — DO NOT EDIT
export const contentIndexHashes: {
  blog: Record<string, string>;
  articles: Record<string, string>;
  search: Record<string, string>;
} = {
  blog: {
${formatEntries(blogHashes)},
  },
  articles: {
${formatEntries(articleHashes)},
  },
  search: {
${formatEntries(searchHashes)},
  },
};
`;

  writeFile(path.join(GENERATED_DIR, "content-hashes.ts"), content);
}

/**
 * Write the server-side metadata JSON
 * Contains full metadata for all blog posts and articles (no HTML content)
 */
function writeServerMeta(blogByLocale, articlesByLocale) {
  const serverMeta = {
    blog: {},
    articles: {},
    locales: {
      blog: Object.keys(blogByLocale).sort(),
      articles: Object.keys(articlesByLocale).sort()
    },
    slugsWithLocales: {
      blog: [],
      articles: []
    }
  };

  for (const [locale, posts] of Object.entries(blogByLocale)) {
    serverMeta.blog[locale] = posts;
    for (const post of posts) {
      serverMeta.slugsWithLocales.blog.push({ slug: post.slug, locale });
    }
  }

  for (const [locale, articles] of Object.entries(articlesByLocale)) {
    serverMeta.articles[locale] = articles;
    for (const article of articles) {
      serverMeta.slugsWithLocales.articles.push({ slug: article.slug, locale });
    }
  }

  writeFile(path.join(GENERATED_DIR, "content-meta-server.json"), JSON.stringify(serverMeta));
}

/**
 * Main generation function
 */
function generateContentCache() {
  console.log("Generating content cache...\n");

  // Clean output directory
  if (fs.existsSync(STATIC_DIR)) {
    fs.rmSync(STATIC_DIR, { recursive: true });
  }
  fs.mkdirSync(STATIC_DIR, { recursive: true });
  fs.mkdirSync(GENERATED_DIR, { recursive: true });

  // Process blog posts
  const blog = processContentDir("blog", ["date", "author", "featured", "coverImage"], (config) => ({
    featured: config.featured,
    coverImage: fixCoverImagePath(config.coverImage) || ""
  }));

  // Process articles
  const articles = processContentDir("articles", ["date", "author", "listed"], (config) => ({
    listed: config.listed
  }));

  // Build static files
  const { indexHashes: blogHashes, byLocale: blogByLocale } = buildStaticFiles("blog", blog);
  const { indexHashes: articleHashes, byLocale: articlesByLocale } = buildStaticFiles("articles", articles);

  // Generate search indexes
  const searchHashes = generateSearchIndexes(articlesByLocale);

  // Write hash manifest
  writeHashManifest(blogHashes, articleHashes, searchHashes);

  // Write server-side metadata
  writeServerMeta(blogByLocale, articlesByLocale);

  // Count totals
  let contentFileCount = 0;
  for (const locales of Object.values(blog)) {
    contentFileCount += Object.keys(locales).length;
  }
  for (const locales of Object.values(articles)) {
    contentFileCount += Object.keys(locales).length;
  }

  console.log("\nContent cache generated successfully:\n");
  console.log(`   Blog posts: ${Object.keys(blog).length} slugs`);
  console.log(`   Articles: ${Object.keys(articles).length} slugs`);
  console.log(`   Content files: ${contentFileCount}`);
  console.log(
    `   Locales: ${[...new Set([...Object.keys(blogByLocale), ...Object.keys(articlesByLocale)])].sort().join(", ")}`
  );
  console.log(`   Output: ${STATIC_DIR}\n`);
}

// Run generation
try {
  generateContentCache();
} catch (error) {
  console.error("Failed to generate content cache:", error);
  process.exit(1);
}
