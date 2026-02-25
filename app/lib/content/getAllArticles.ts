import { getContentLoader } from "./loaders";
import type { ArticleMeta } from "./types";

/**
 * Get all articles metadata for a specific locale
 * Falls back to English for articles that don't have the requested locale
 * Returns articles sorted alphabetically by title
 */
export async function getAllArticles(locale: string): Promise<ArticleMeta[]> {
  const loader = await getContentLoader();
  const articles = await loader.getAllArticleMeta(locale);
  return articles.sort((a, b) => a.title.localeCompare(b.title));
}
