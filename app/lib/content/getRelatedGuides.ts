import type { GuideMeta } from "./types";

/**
 * Get related guides based on tag overlap, topped up to `limit` with a
 * random selection of the remaining guides.
 * Tag-related guides come first (sorted by number of common tags, descending),
 * followed by randomly ordered fillers.
 * Premium guides are excluded so related links never point at locked content.
 */
export function getRelatedGuides(currentSlug: string, allGuides: GuideMeta[], limit: number = 5): GuideMeta[] {
  const currentGuide = allGuides.find((g) => g.slug === currentSlug);
  if (!currentGuide) {
    return [];
  }

  const currentTags = new Set(currentGuide.tags);
  const candidates = allGuides.filter((guide) => guide.slug !== currentSlug && !guide.premium);

  const related = candidates
    .map((guide) => {
      const commonTags = guide.tags.filter((tag) => currentTags.has(tag)).length;
      return { guide, score: commonTags };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ guide }) => guide);

  if (related.length >= limit) {
    return related;
  }

  const relatedSlugs = new Set(related.map((g) => g.slug));
  const fillers = shuffle(candidates.filter((guide) => !relatedSlugs.has(guide.slug)));

  return [...related, ...fillers.slice(0, limit - related.length)];
}

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
