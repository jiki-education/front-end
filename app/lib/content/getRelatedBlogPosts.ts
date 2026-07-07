import type { BlogPostMeta } from "./types";

/**
 * Get related blog posts, always returning up to `limit` posts.
 *
 * Posts that share tags with the current post come first (ranked by number of
 * common tags, then recency). If there aren't enough tag matches to reach
 * `limit`, the list is topped up with the most recent remaining posts, so the
 * "related posts" rail is never left short (a post with no tag overlap still
 * shows a full set). Returns fewer than `limit` only when the blog itself has
 * fewer other posts than that.
 */
export function getRelatedBlogPosts(currentSlug: string, allPosts: BlogPostMeta[], limit: number = 5): BlogPostMeta[] {
  const currentPost = allPosts.find((p) => p.slug === currentSlug);
  const currentTags = new Set(currentPost?.tags ?? []);
  const others = allPosts.filter((post) => post.slug !== currentSlug);

  const byRecency = (a: BlogPostMeta, b: BlogPostMeta) => new Date(b.date).getTime() - new Date(a.date).getTime();

  // Tag-matched posts first: most shared tags, then most recent as a tiebreak.
  const related = others
    .map((post) => ({ post, score: post.tags.filter((tag) => currentTags.has(tag)).length }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || byRecency(a.post, b.post))
    .map(({ post }) => post);

  // Top up with the most recent remaining posts until we reach `limit`.
  if (related.length < limit) {
    const chosen = new Set(related.map((p) => p.slug));
    const fillers = others.filter((post) => !chosen.has(post.slug)).sort(byRecency);
    related.push(...fillers);
  }

  return related.slice(0, limit);
}
