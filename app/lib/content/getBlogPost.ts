import { fetchStaticContent } from "./fetchStaticContent";
import { getAllBlogPosts } from "./getAllBlogPosts";
import { contentBodyPath } from "@/lib/assets-paths";
import type { ProcessedBlogPost } from "./types";

/**
 * Get a single blog post by slug and locale (metadata + rendered content)
 * Falls back to English if the requested locale doesn't exist
 *
 * @throws Error if the post doesn't exist at all
 */
export async function getBlogPost(slug: string, locale: string): Promise<ProcessedBlogPost> {
  const allPosts = getAllBlogPosts(locale);
  const meta = allPosts.find((p) => p.slug === slug);

  if (!meta) {
    throw new Error(`Blog post not found: ${slug}`);
  }

  const content = await fetchStaticContent(contentBodyPath("blog", slug, meta.locale, meta.contentHash));
  return { ...meta, content };
}
