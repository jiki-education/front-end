import { getContentLoader } from "./loaders";
import type { ProcessedBlogPost } from "./types";

/**
 * Get a single blog post by slug and locale (metadata + rendered content)
 * Falls back to English if the requested locale doesn't exist
 *
 * @throws Error if the post doesn't exist at all
 */
export async function getBlogPost(slug: string, locale: string): Promise<ProcessedBlogPost> {
  const loader = await getContentLoader();
  const allMeta = await loader.getAllBlogPostMeta(locale);
  const meta = allMeta.find((p) => p.slug === slug);

  if (!meta) {
    throw new Error(`Blog post not found: ${slug}`);
  }

  const content = await loader.getBlogPostContent(slug, locale);
  return { ...meta, content };
}
