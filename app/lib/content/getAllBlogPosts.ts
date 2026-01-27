import { blogPosts } from "./generated";
import type { ProcessedBlogPost } from "./generated/types";

/**
 * Get all blog posts for a specific locale
 * Falls back to English for posts that don't have the requested locale
 * Returns posts sorted by date (newest first)
 */
export async function getAllBlogPosts(locale: string): Promise<ProcessedBlogPost[]> {
  const postLoaders = Object.values(blogPosts);

  const posts = await Promise.all(
    postLoaders.map(async (loader) => {
      const postModule = await loader();

      // Use requested locale if available, otherwise fall back to English
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime safety for unsupported locales
      const localeLoader = postModule.locales[locale as keyof typeof postModule.locales] || postModule.locales.en;

      const localeModule = await localeLoader();
      return localeModule.post;
    })
  );

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}
