import { getContentMeta } from "./contentMeta";
import type { ArticleMeta } from "./types";

/**
 * Get all articles metadata for a specific locale.
 * No English fallback: a locale with no articles returns an empty list (never
 * silently shows English). Returns articles sorted alphabetically by title.
 */
export async function getAllArticles(locale: string): Promise<ArticleMeta[]> {
  const articles = (await getContentMeta(locale)).articles;
  return [...articles].sort((a, b) => a.title.localeCompare(b.title));
}
