import type { BlogPostMeta } from "./types";

/**
 * Get related blog posts based on tag overlap
 * Returns posts sorted by number of common tags (descending)
 */
export function getRelatedBlogPosts(currentSlug: string, allPosts: BlogPostMeta[], limit: number = 3): BlogPostMeta[] {
  const currentPost = allPosts.find((p) => p.slug === currentSlug);
  if (!currentPost) {
    return [];
  }

  const currentTags = new Set(currentPost.tags);

  return allPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      const commonTags = post.tags.filter((tag) => currentTags.has(tag)).length;
      return { post, score: commonTags };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
}
