import type { ProcessedArticle } from "./generated/types";

/**
 * Get related articles based on tag overlap
 * Returns articles sorted by number of common tags (descending)
 */
export function getRelatedArticles(
  currentSlug: string,
  allArticles: ProcessedArticle[],
  limit: number = 3
): ProcessedArticle[] {
  const currentArticle = allArticles.find((a) => a.slug === currentSlug);
  if (!currentArticle) {
    return [];
  }

  const currentTags = new Set(currentArticle.tags);

  return allArticles
    .filter((article) => article.slug !== currentSlug && article.listed)
    .map((article) => {
      const commonTags = article.tags.filter((tag) => currentTags.has(tag)).length;
      return { article, score: commonTags };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ article }) => article);
}
