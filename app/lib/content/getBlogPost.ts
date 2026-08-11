import { fetchStaticContent } from "./fetchStaticContent";
import { getAllBlogPosts } from "./getAllBlogPosts";
import { contentBodyPath } from "@/lib/assets-paths";
import type { ProcessedBlogPost } from "./types";

/**
 * Get a single blog post by slug and locale (metadata + rendered content)
 *
 * No English fallback, exactly as for `getArticle` and `getGuide`: the post must
 * exist for the requested locale. A locale that has not translated a post does
 * not have that post, and asking for it throws rather than quietly serving
 * English under a translated URL.
 *
 * @throws Error if the post doesn't exist for this locale
 */
export async function getBlogPost(slug: string, locale: string): Promise<ProcessedBlogPost> {
  const allPosts = await getAllBlogPosts(locale);
  const meta = allPosts.find((p) => p.slug === slug);

  if (!meta) {
    throw new Error(`Blog post not found: ${slug}`);
  }

  const content = await fetchStaticContent(contentBodyPath("blog", slug, meta.locale, meta.contentHash));
  return { ...meta, content };
}
