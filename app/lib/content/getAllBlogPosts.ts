import { getContentLoader } from "./loaders";
import type { BlogPostMeta } from "./types";

/**
 * Get all blog posts metadata for a specific locale
 * Falls back to English for posts that don't have the requested locale
 * Returns posts sorted by date (newest first)
 */
export async function getAllBlogPosts(locale: string): Promise<BlogPostMeta[]> {
  const loader = await getContentLoader();
  const posts = await loader.getAllBlogPostMeta(locale);
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}
