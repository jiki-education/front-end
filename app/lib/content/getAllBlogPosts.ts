import contentMeta from "@/lib/generated/content-meta-server.json";
import type { BlogPostMeta } from "./types";

/**
 * Get all blog posts metadata for a specific locale
 * No English fallback: a locale with no posts returns an empty list (never
 * silently shows English). Returns posts sorted by date (newest first).
 */
export function getAllBlogPosts(locale: string): BlogPostMeta[] {
  const meta = contentMeta as { blog: { [locale: string]: BlogPostMeta[] | undefined } };
  const posts = meta.blog[locale] ?? [];
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}
