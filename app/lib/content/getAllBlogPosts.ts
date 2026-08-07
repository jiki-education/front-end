import { getContentMeta } from "./contentMeta";
import type { BlogPostMeta } from "./types";

/**
 * Get all blog posts metadata for a specific locale.
 * No English fallback: a locale with no posts returns an empty list (never
 * silently shows English). Returns posts sorted by date (newest first).
 */
export async function getAllBlogPosts(locale: string): Promise<BlogPostMeta[]> {
  const posts = (await getContentMeta(locale)).blog;
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}
