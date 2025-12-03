/**
 * Content Loader
 *
 * Provides functions to load blog posts and articles from the generated content bundle.
 * Uses 3-level dynamic imports for optimal code splitting:
 * 1. Post registry → 2. Locale registry → 3. Individual translation
 *
 * This matches the curriculum pattern and works in Cloudflare Workers.
 */

/* eslint-disable @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-unused-vars */

import { blogPosts, articles } from "./generated";
import type { ProcessedPost } from "./generated/types";

/**
 * Get a single blog post by slug and locale
 * Falls back to English if the requested locale doesn't exist
 *
 * @throws Error if the post doesn't exist at all
 */
export async function getBlogPost(slug: string, locale: string): Promise<ProcessedPost> {
  // Level 1: Load post's locale registry
  const postLoader = blogPosts[slug as keyof typeof blogPosts];
  if (!postLoader) {
    throw new Error(`Blog post not found: ${slug}`);
  }

  const postModule = await postLoader();

  // Level 2: Load specific locale
  const localeLoader = postModule.locales[locale as keyof typeof postModule.locales];

  if (!localeLoader) {
    // Fallback to English
    const enLoader = postModule.locales.en;
    if (!enLoader) {
      throw new Error(`Blog post not found: ${slug}`);
    }
    const enModule = await enLoader();
    return enModule.post;
  }

  const localeModule = await localeLoader();
  return localeModule.post;
}

/**
 * Get all blog posts for a specific locale
 * Falls back to English for posts that don't have the requested locale
 * Returns posts sorted by date (newest first)
 */
export async function getAllBlogPosts(locale: string): Promise<ProcessedPost[]> {
  const postLoaders = Object.entries(blogPosts);

  const posts = await Promise.all(
    postLoaders.map(async ([slug, loader]) => {
      const postModule = await loader();

      // Check if requested locale exists
      const localeLoader = postModule.locales[locale as keyof typeof postModule.locales];

      if (!localeLoader) {
        // Fallback to English
        const enLoader = postModule.locales.en;
        if (!enLoader) {
          return null;
        }
        const enModule = await enLoader();
        return enModule.post;
      }

      const localeModule = await localeLoader();
      return localeModule.post;
    })
  );

  return posts
    .filter((post: ProcessedPost | null): post is ProcessedPost => post !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Get a single article by slug and locale
 * Falls back to English if the requested locale doesn't exist
 *
 * @throws Error if the article doesn't exist at all
 */
export async function getArticle(slug: string, locale: string): Promise<ProcessedPost> {
  // Level 1: Load article's locale registry
  const articleLoader = articles[slug as keyof typeof articles];
  if (!articleLoader) {
    throw new Error(`Article not found: ${slug}`);
  }

  const articleModule = await articleLoader();

  // Level 2: Load specific locale
  const localeLoader = articleModule.locales[locale as keyof typeof articleModule.locales];

  if (!localeLoader) {
    // Fallback to English
    const enLoader = articleModule.locales.en;
    if (!enLoader) {
      throw new Error(`Article not found: ${slug}`);
    }
    const enModule = await enLoader();
    return enModule.post;
  }

  const localeModule = await localeLoader();
  return localeModule.post;
}

/**
 * Get all articles for a specific locale
 * Falls back to English for articles that don't have the requested locale
 * Returns articles sorted alphabetically by title
 */
export async function getAllArticles(locale: string): Promise<ProcessedPost[]> {
  const articleLoaders = Object.entries(articles);

  const articlesList = await Promise.all(
    articleLoaders.map(async ([slug, loader]) => {
      const articleModule = await loader();

      // Check if requested locale exists
      const localeLoader = articleModule.locales[locale as keyof typeof articleModule.locales];

      if (!localeLoader) {
        // Fallback to English
        const enLoader = articleModule.locales.en;
        if (!enLoader) {
          return null;
        }
        const enModule = await enLoader();
        return enModule.post;
      }

      const localeModule = await localeLoader();
      return localeModule.post;
    })
  );

  return articlesList
    .filter((article: ProcessedPost | null): article is ProcessedPost => article !== null)
    .sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Get all post slugs with their available locales
 * Optionally filtered by supported locales
 * Used for Next.js generateStaticParams
 */
export async function getAllPostSlugsWithLocales(
  type: "blog" | "articles",
  supportedLocales?: readonly string[]
): Promise<Array<{ slug: string; locale: string }>> {
  const registry = type === "blog" ? blogPosts : articles;
  const loaders = Object.entries(registry);

  const results: Array<{ slug: string; locale: string }> = [];

  for (const [slug, loader] of loaders) {
    const postModule = await loader();

    for (const locale of postModule.availableLocales) {
      if (!supportedLocales || supportedLocales.includes(locale)) {
        results.push({ slug, locale });
      }
    }
  }

  return results;
}

/**
 * Get all available locales for a content type
 * Optionally filtered by supported locales
 */
export async function getAvailableLocales(
  type: "blog" | "articles",
  supportedLocales?: readonly string[]
): Promise<string[]> {
  const registry = type === "blog" ? blogPosts : articles;
  const loaders = Object.values(registry);

  const localesSet = new Set<string>();

  for (const loader of loaders) {
    const postModule = await loader();

    for (const locale of postModule.availableLocales) {
      if (!supportedLocales || supportedLocales.includes(locale)) {
        localesSet.add(locale);
      }
    }
  }

  return Array.from(localesSet);
}
