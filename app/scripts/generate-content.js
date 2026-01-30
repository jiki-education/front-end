#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Content Generation Script
 *
 * Processes markdown files from the content package and generates TypeScript
 * files with 3-level dynamic imports for optimal bundle splitting:
 *
 * Level 1: Post registry (index.ts)
 * Level 2: Locale registry per post (blog/slug.ts)
 * Level 3: Individual translations (blog/slug.locale.ts)
 *
 * Also generates Lunr search indexes for articles (one per locale).
 *
 * This eliminates runtime filesystem dependencies for Cloudflare Workers.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import { marked } from "marked";
import lunr from "lunr";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, "../../content/src/posts");
const AUTHORS_FILE = path.join(__dirname, "../../content/src/authors.json");
const OUTPUT_DIR = path.join(__dirname, "../lib/content/generated");
const SEARCH_OUTPUT_DIR = path.join(__dirname, "../public/static/search");

// Load authors
let authorsData;
try {
  authorsData = JSON.parse(fs.readFileSync(AUTHORS_FILE, "utf-8"));
} catch (error) {
  console.error(`Failed to read authors file: ${AUTHORS_FILE}`);
  throw error;
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
 * Parse markdown file and return common fields
 */
function parseMarkdownFile(filePath, slug, locale, config) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const parsed = matter(fileContent);
  const frontmatter = parsed.data;
  const fixedContent = fixImagePaths(parsed.content);
  const html = marked.parse(fixedContent);

  const author = authorsData[config.author];
  if (!author) {
    throw new Error(`Author not found: ${config.author} in ${filePath}`);
  }

  return {
    slug,
    title: frontmatter.title,
    date: config.date,
    excerpt: frontmatter.excerpt,
    author,
    tags: frontmatter.tags || [],
    seo: frontmatter.seo || {
      description: frontmatter.excerpt,
      keywords: []
    },
    content: html,
    locale
  };
}

/**
 * Process blog posts directory
 */
function processBlogPosts() {
  const blogDir = path.join(CONTENT_DIR, "blog");
  const content = {};

  if (!fs.existsSync(blogDir)) {
    return content;
  }

  const requiredFields = ["date", "author", "featured", "coverImage"];
  const slugDirs = fs.readdirSync(blogDir, { withFileTypes: true }).filter((d) => d.isDirectory());

  for (const slugDir of slugDirs) {
    const slug = slugDir.name;
    const slugPath = path.join(blogDir, slug);
    const configPath = path.join(slugPath, "config.json");

    if (!fs.existsSync(configPath)) {
      throw new Error(`Missing config.json for blog/${slug}`);
    }

    let config;
    try {
      config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    } catch (error) {
      throw new Error(`Invalid JSON in ${configPath}: ${error.message}`);
    }

    for (const field of requiredFields) {
      if (config[field] === undefined) {
        throw new Error(`Missing required field "${field}" in ${configPath}`);
      }
    }

    const mdFiles = fs
      .readdirSync(slugPath, { withFileTypes: true })
      .filter((f) => f.isFile() && f.name.endsWith(".md"));
    content[slug] = {};

    for (const file of mdFiles) {
      const locale = path.basename(file.name, ".md");
      const filePath = path.join(slugPath, file.name);

      try {
        const basePost = parseMarkdownFile(filePath, slug, locale, config);
        content[slug][locale] = {
          ...basePost,
          featured: config.featured,
          coverImage: fixCoverImagePath(config.coverImage) || ""
        };
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
        throw error;
      }
    }
  }

  return content;
}

/**
 * Process articles directory
 */
function processArticles() {
  const articlesDir = path.join(CONTENT_DIR, "articles");
  const content = {};

  if (!fs.existsSync(articlesDir)) {
    return content;
  }

  const requiredFields = ["date", "author", "listed"];
  const slugDirs = fs.readdirSync(articlesDir, { withFileTypes: true }).filter((d) => d.isDirectory());

  for (const slugDir of slugDirs) {
    const slug = slugDir.name;
    const slugPath = path.join(articlesDir, slug);
    const configPath = path.join(slugPath, "config.json");

    if (!fs.existsSync(configPath)) {
      throw new Error(`Missing config.json for articles/${slug}`);
    }

    let config;
    try {
      config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    } catch (error) {
      throw new Error(`Invalid JSON in ${configPath}: ${error.message}`);
    }

    for (const field of requiredFields) {
      if (config[field] === undefined) {
        throw new Error(`Missing required field "${field}" in ${configPath}`);
      }
    }

    const mdFiles = fs
      .readdirSync(slugPath, { withFileTypes: true })
      .filter((f) => f.isFile() && f.name.endsWith(".md"));
    content[slug] = {};

    for (const file of mdFiles) {
      const locale = path.basename(file.name, ".md");
      const filePath = path.join(slugPath, file.name);

      try {
        const basePost = parseMarkdownFile(filePath, slug, locale, config);
        content[slug][locale] = {
          ...basePost,
          listed: config.listed
        };
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
        throw error;
      }
    }
  }

  return content;
}

/**
 * Generate individual translation file (Level 3)
 */
function generateBlogPostFile(post) {
  return `import type { ProcessedBlogPost } from "../types";

export const post: ProcessedBlogPost = ${JSON.stringify(post, null, 2)};
`;
}

function generateArticleFile(post) {
  return `import type { ProcessedArticle } from "../types";

export const post: ProcessedArticle = ${JSON.stringify(post, null, 2)};
`;
}

/**
 * Generate locale registry file for a post (Level 2)
 */
function generateLocaleRegistryFile(slug, locales) {
  const imports = locales.map((locale) => `  ${locale}: () => import("./${slug}.${locale}")`).join(",\n");

  return `export const locales = {
${imports}
} as const;

export const availableLocales = ${JSON.stringify(locales)} as const;
`;
}

/**
 * Generate main registry file (Level 1)
 */
function generateMainRegistry(blogSlugs, articleSlugs) {
  const blogImports = blogSlugs.map((slug) => `  "${slug}": () => import("./blog/${slug}")`).join(",\n");

  const articleImports = articleSlugs.map((slug) => `  "${slug}": () => import("./articles/${slug}")`).join(",\n");

  return `// Auto-generated file - do not edit manually
// Generated by scripts/generate-content.js at build time

export const blogPosts = {
${blogImports}
} as const;

export const articles = {
${articleImports}
} as const;

export type BlogSlug = keyof typeof blogPosts;
export type ArticleSlug = keyof typeof articles;
`;
}

/**
 * Generate types file
 */
function generateTypesFile() {
  return `// Auto-generated file - do not edit manually
// Generated by scripts/generate-content.js at build time

export interface ProcessedBlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
  };
  tags: string[];
  seo: {
    description: string;
    keywords: string[];
  };
  featured: boolean;
  coverImage: string;
  content: string;
  locale: string;
}

export interface ProcessedArticle {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
  };
  tags: string[];
  seo: {
    description: string;
    keywords: string[];
  };
  listed: boolean;
  content: string;
  locale: string;
}
`;
}

/**
 * Generate Lunr search indexes for articles (one per locale)
 */
function generateSearchIndexes(articles) {
  // Group articles by locale
  const articlesByLocale = {};

  for (const [, locales] of Object.entries(articles)) {
    for (const [locale, article] of Object.entries(locales)) {
      if (!articlesByLocale[locale]) {
        articlesByLocale[locale] = [];
      }
      // Only index listed articles
      if (article.listed) {
        articlesByLocale[locale].push(article);
      }
    }
  }

  // Create output directory
  if (!fs.existsSync(SEARCH_OUTPUT_DIR)) {
    fs.mkdirSync(SEARCH_OUTPUT_DIR, { recursive: true });
  }

  // Generate index for each locale
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

    // Also store article metadata for displaying results
    const metadata = localeArticles.map((a) => ({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt
    }));

    const output = {
      index: idx.toJSON(),
      articles: metadata
    };

    const outputPath = path.join(SEARCH_OUTPUT_DIR, `articles-${locale}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(output));
    console.log(`   🔍 Search index: articles-${locale}.json (${localeArticles.length} articles)`);
  }
}

/**
 * Main generation function
 */
function generateContent() {
  console.log("🚀 Generating content bundle...\n");

  // Process all content
  const blog = processBlogPosts();
  const articles = processArticles();

  // Create output directories
  const blogDir = path.join(OUTPUT_DIR, "blog");
  const articlesDir = path.join(OUTPUT_DIR, "articles");

  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(blogDir, { recursive: true });
  fs.mkdirSync(articlesDir, { recursive: true });

  // Generate blog files
  let totalTranslations = 0;
  for (const [slug, locales] of Object.entries(blog)) {
    for (const [locale, post] of Object.entries(locales)) {
      const filename = path.join(blogDir, `${slug}.${locale}.ts`);
      fs.writeFileSync(filename, generateBlogPostFile(post));
      totalTranslations++;
    }

    const localeRegistryFile = path.join(blogDir, `${slug}.ts`);
    fs.writeFileSync(localeRegistryFile, generateLocaleRegistryFile(slug, Object.keys(locales)));
  }

  // Generate article files
  for (const [slug, locales] of Object.entries(articles)) {
    for (const [locale, post] of Object.entries(locales)) {
      const filename = path.join(articlesDir, `${slug}.${locale}.ts`);
      fs.writeFileSync(filename, generateArticleFile(post));
      totalTranslations++;
    }

    const localeRegistryFile = path.join(articlesDir, `${slug}.ts`);
    fs.writeFileSync(localeRegistryFile, generateLocaleRegistryFile(slug, Object.keys(locales)));
  }

  // Generate main registry (Level 1)
  const mainRegistryFile = path.join(OUTPUT_DIR, "index.ts");
  fs.writeFileSync(mainRegistryFile, generateMainRegistry(Object.keys(blog), Object.keys(articles)));

  // Generate types file
  const typesFile = path.join(OUTPUT_DIR, "types.ts");
  fs.writeFileSync(typesFile, generateTypesFile());

  // Generate search indexes for articles
  generateSearchIndexes(articles);

  console.log("\n✅ Content bundle generated successfully:\n");
  console.log(`   📝 Blog posts: ${Object.keys(blog).length} slugs`);
  console.log(`   📝 Articles: ${Object.keys(articles).length} slugs`);
  console.log(`   🌐 Total translations: ${totalTranslations}`);
  console.log(`   📁 Output: ${OUTPUT_DIR}\n`);
}

// Run generation
try {
  generateContent();
} catch (error) {
  console.error("❌ Failed to generate content bundle:", error);
  process.exit(1);
}
