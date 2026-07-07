import type { GuideMeta } from "./types";

/**
 * Get related guides based on tag overlap
 * Returns guides sorted by number of common tags (descending).
 * Premium guides are excluded so related links never point at locked content.
 */
export function getRelatedGuides(currentSlug: string, allGuides: GuideMeta[], limit: number = 3): GuideMeta[] {
  const currentGuide = allGuides.find((g) => g.slug === currentSlug);
  if (!currentGuide) {
    return [];
  }

  const currentTags = new Set(currentGuide.tags);

  return allGuides
    .filter((guide) => guide.slug !== currentSlug && !guide.premium)
    .map((guide) => {
      const commonTags = guide.tags.filter((tag) => currentTags.has(tag)).length;
      return { guide, score: commonTags };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ guide }) => guide);
}
