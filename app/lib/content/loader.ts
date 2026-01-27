/**
 * Content Loader
 *
 * Provides utility functions for content that span both blog posts and articles.
 * Individual loaders (getArticle, getBlogPost, etc.) are in separate files.
 */

import { articles, blogPosts } from "./generated";

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
