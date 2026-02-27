import contentMeta from "@/lib/generated/content-meta-server.json";
import type { ArticleMeta } from "./types";

/**
 * Get all articles metadata for a specific locale
 * Falls back to English for locales that don't exist
 * Returns articles sorted alphabetically by title
 */
export function getAllArticles(locale: string): ArticleMeta[] {
  const meta = contentMeta as { articles: { [locale: string]: ArticleMeta[] | undefined } };
  const articles = meta.articles[locale] ?? meta.articles["en"] ?? [];
  return [...articles].sort((a, b) => a.title.localeCompare(b.title));
}
