/**
 * Content Loader
 *
 * Provides utility functions for content that span both blog posts and articles.
 * Individual loaders (getArticle, getBlogPost, etc.) are in separate files.
 */

import { getContentLoader } from "./loaders";

/**
 * Get all post slugs with their available locales
 * Optionally filtered by supported locales
 */
export async function getAllPostSlugsWithLocales(
  type: "blog" | "articles",
  supportedLocales?: readonly string[]
): Promise<Array<{ slug: string; locale: string }>> {
  const loader = await getContentLoader();
  const all = await loader.getAllSlugsWithLocales(type);

  if (supportedLocales) {
    return all.filter((entry) => supportedLocales.includes(entry.locale));
  }
  return all;
}

/**
 * Get all available locales for a content type
 * Optionally filtered by supported locales
 */
export async function getAvailableLocales(
  type: "blog" | "articles",
  supportedLocales?: readonly string[]
): Promise<string[]> {
  const loader = await getContentLoader();
  const locales = await loader.getAvailableLocales(type);

  if (supportedLocales) {
    return locales.filter((l) => supportedLocales.includes(l));
  }
  return locales;
}
