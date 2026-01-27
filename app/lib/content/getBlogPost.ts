import { blogPosts } from "./generated";
import type { ProcessedBlogPost } from "./generated/types";

/**
 * Get a single blog post by slug and locale
 * Falls back to English if the requested locale doesn't exist
 *
 * @throws Error if the post doesn't exist at all
 */
export async function getBlogPost(slug: string, locale: string): Promise<ProcessedBlogPost> {
  const postLoader = blogPosts[slug as keyof typeof blogPosts];
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime safety for invalid slugs
  if (!postLoader) {
    throw new Error(`Blog post not found: ${slug}`);
  }

  const postModule = await postLoader();

  // Use requested locale if available, otherwise fall back to English
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime safety for unsupported locales
  const localeLoader = postModule.locales[locale as keyof typeof postModule.locales] || postModule.locales.en;

  const localeModule = await localeLoader();
  return localeModule.post;
}
