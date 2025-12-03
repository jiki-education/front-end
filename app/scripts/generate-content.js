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
 * This eliminates runtime filesystem dependencies for Cloudflare Workers.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import { marked } from "marked";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, "../../content/src/posts");
const AUTHORS_FILE = path.join(__dirname, "../../content/src/authors.json");
const OUTPUT_DIR = path.join(__dirname, "../lib/content/generated");

// Load authors
let authorsData;
try {
  authorsData = JSON.parse(fs.readFileSync(AUTHORS_FILE, "utf-8"));
} catch (error) {
  console.error(`Failed to read authors file: ${AUTHORS_FILE}`);
  throw error;
}

/**
 * Fix image paths in markdown content and frontmatter
 * Rewrites /images/ to /static/images/ for correct public/ serving
 */
function fixImagePaths(content, frontmatter) {
  // Fix markdown image syntax: ![alt](/images/...) -> ![alt](/static/images/...)
  const fixedContent = content.replace(/!\[([^\]]*)\]\(\/images\//g, "![$1](/static/images/");

  // Fix frontmatter coverImage
  if (frontmatter.coverImage && frontmatter.coverImage.startsWith("/images/")) {
    frontmatter.coverImage = frontmatter.coverImage.replace("/images/", "/static/images/");
  }

  return { content: fixedContent, frontmatter };
}

/**
 * Process a single markdown file into a ProcessedPost object
 */
function processMarkdownFile(filePath, slug, locale, config) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const parsed = matter(fileContent);
  const frontmatter = parsed.data;

  // Fix image paths
  const { content: fixedContent, frontmatter: fixedFrontmatter } = fixImagePaths(parsed.content, frontmatter);

  // Render markdown to HTML
  const html = marked.parse(fixedContent);

  // Expand author from config
  const author = authorsData[config.author];
  if (!author) {
    throw new Error(`Author not found: ${config.author} in ${filePath}`);
  }

  return {
    slug,
    title: fixedFrontmatter.title,
    date: config.date,
    excerpt: fixedFrontmatter.excerpt,
    author,
    tags: fixedFrontmatter.tags || [],
    seo: fixedFrontmatter.seo || {
      description: fixedFrontmatter.excerpt,
      keywords: []
    },
    featured: config.featured || false,
    coverImage: config.coverImage || "",
    content: html,
    locale
  };
}

/**
 * Process all markdown files in a content type directory (blog or articles)
 * Returns: { slug: { locale: ProcessedPost } }
 */
function processContentDirectory(type) {
  const typeDir = path.join(CONTENT_DIR, type);
  const content = {};

  if (!fs.existsSync(typeDir)) {
    // console.warn(`Content directory not found: ${typeDir}`);
    return content;
  }

  const slugDirs = fs.readdirSync(typeDir, { withFileTypes: true }).filter((dirent) => dirent.isDirectory());

  for (const slugDir of slugDirs) {
    const slug = slugDir.name;
    const slugPath = path.join(typeDir, slug);

    // Read config.json for structural metadata
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

    // Validate required config fields
    const requiredFields = ["date", "author", "featured", "coverImage"];
    for (const field of requiredFields) {
      if (config[field] === undefined) {
        throw new Error(`Missing required field "${field}" in ${configPath}`);
      }
    }

    const files = fs.readdirSync(slugPath, { withFileTypes: true }).filter((f) => f.isFile() && f.name.endsWith(".md"));

    content[slug] = {};

    for (const file of files) {
      const locale = path.basename(file.name, ".md");
      const filePath = path.join(slugPath, file.name);

      try {
        content[slug][locale] = processMarkdownFile(filePath, slug, locale, config);
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
function generateTranslationFile(post) {
  return `import type { ProcessedPost } from "../types";

export const post: ProcessedPost = ${JSON.stringify(post, null, 2)};
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

export interface ProcessedPost {
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
`;
}

/**
 * Main generation function
 */
function generateContent() {
  console.log("🚀 Generating content bundle...\n");

  // Process all content
  const blog = processContentDirectory("blog");
  const articles = processContentDirectory("articles");

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
    // Generate individual translation files (Level 3)
    for (const [locale, post] of Object.entries(locales)) {
      const filename = path.join(blogDir, `${slug}.${locale}.ts`);
      fs.writeFileSync(filename, generateTranslationFile(post));
      totalTranslations++;
    }

    // Generate locale registry (Level 2)
    const localeRegistryFile = path.join(blogDir, `${slug}.ts`);
    fs.writeFileSync(localeRegistryFile, generateLocaleRegistryFile(slug, Object.keys(locales)));
  }

  // Generate article files
  for (const [slug, locales] of Object.entries(articles)) {
    // Generate individual translation files (Level 3)
    for (const [locale, post] of Object.entries(locales)) {
      const filename = path.join(articlesDir, `${slug}.${locale}.ts`);
      fs.writeFileSync(filename, generateTranslationFile(post));
      totalTranslations++;
    }

    // Generate locale registry (Level 2)
    const localeRegistryFile = path.join(articlesDir, `${slug}.ts`);
    fs.writeFileSync(localeRegistryFile, generateLocaleRegistryFile(slug, Object.keys(locales)));
  }

  // Generate main registry (Level 1)
  const mainRegistryFile = path.join(OUTPUT_DIR, "index.ts");
  fs.writeFileSync(mainRegistryFile, generateMainRegistry(Object.keys(blog), Object.keys(articles)));

  // Generate types file
  const typesFile = path.join(OUTPUT_DIR, "types.ts");
  fs.writeFileSync(typesFile, generateTypesFile());

  console.log("✅ Content bundle generated successfully:\n");
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
