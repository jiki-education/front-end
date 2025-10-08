import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import { marked } from "marked";
import fg from "fast-glob";
import type { ProcessedPost, Frontmatter, AuthorRegistry } from "./types.js";
import authorsData from "./authors.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, "posts");
const authors = authorsData as AuthorRegistry;

interface PostFile {
  slug: string;
  locale: string;
  filePath: string;
  type: "blog" | "articles";
}

function getPostFiles(type: "blog" | "articles"): PostFile[] {
  const typeDir = path.join(POSTS_DIR, type);

  if (!fs.existsSync(typeDir)) {
    return [];
  }

  const pattern = path.join(typeDir, "**/*.md").replace(/\\/g, "/");
  const files = fg.sync(pattern);

  return files.map((filePath) => {
    const relativePath = path.relative(typeDir, filePath);
    const parts = relativePath.split(path.sep);

    if (parts.length !== 2) {
      throw new Error(`Invalid post path: ${filePath}`);
    }

    const slug = parts[0];
    const localeFile = parts[1];
    const locale = path.basename(localeFile, ".md");

    return {
      slug,
      locale,
      filePath,
      type
    };
  });
}

function loadPost(file: PostFile): ProcessedPost {
  const fileContent = fs.readFileSync(file.filePath, "utf-8");
  const parsed = matter(fileContent);

  const frontmatter = parsed.data as Frontmatter;

  // Render markdown to HTML
  const html = marked.parse(parsed.content) as string;

  // Expand author
  const author = authors[frontmatter.author];

  return {
    slug: file.slug,
    title: frontmatter.title,
    date: frontmatter.date,
    excerpt: frontmatter.excerpt,
    author,
    tags: frontmatter.tags,
    seo: frontmatter.seo,
    featured: frontmatter.featured,
    coverImage: frontmatter.coverImage,
    content: html,
    locale: file.locale
  };
}

export function getAllBlogPosts(locale: string): ProcessedPost[] {
  const files = getPostFiles("blog");
  const localeFiles = files.filter((f) => f.locale === locale);

  return localeFiles.map(loadPost).sort((a, b) => b.date.localeCompare(a.date));
}

export function getBlogPost(slug: string, locale: string): ProcessedPost {
  const files = getPostFiles("blog");
  const file = files.find((f) => f.slug === slug && f.locale === locale);

  if (!file) {
    // Try falling back to English
    const enFile = files.find((f) => f.slug === slug && f.locale === "en");
    if (!enFile) {
      throw new Error(`Blog post not found: ${slug}`);
    }
    return loadPost(enFile);
  }

  return loadPost(file);
}

export function getAllArticles(locale: string): ProcessedPost[] {
  const files = getPostFiles("articles");
  const localeFiles = files.filter((f) => f.locale === locale);

  return localeFiles.map(loadPost).sort((a, b) => a.title.localeCompare(b.title));
}

export function getArticle(slug: string, locale: string): ProcessedPost {
  const files = getPostFiles("articles");
  const file = files.find((f) => f.slug === slug && f.locale === locale);

  if (!file) {
    // Try falling back to English
    const enFile = files.find((f) => f.slug === slug && f.locale === "en");
    if (!enFile) {
      throw new Error(`Article not found: ${slug}`);
    }
    return loadPost(enFile);
  }

  return loadPost(file);
}
