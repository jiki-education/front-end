import contentMeta from "@/lib/generated/content-meta-server.json";
import type { BlogPostMeta } from "./types";

/**
 * Get all blog posts metadata for a specific locale
 * Falls back to English for locales that don't exist
 * Returns posts sorted by date (newest first)
 */
export function getAllBlogPosts(locale: string): BlogPostMeta[] {
  const meta = contentMeta as { blog: { [locale: string]: BlogPostMeta[] | undefined } };
  const posts = meta.blog[locale] ?? meta.blog["en"] ?? [];
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}
