import { exerciseLessonSlugs, levels } from "@jiki/curriculum";
import { LAST_PUBLISHED_LEVEL_SLUG } from "@/lib/constants/course";
import { exerciseLevels } from "@/lib/generated/exercise-levels";

/**
 * The exercises whose public pages are live, in course order.
 *
 * "Live" is the same cutoff the dashboard applies: every level up to and
 * including LAST_PUBLISHED_LEVEL_SLUG, nothing after it. The dashboard computes
 * it from the API's level/lesson tree (see filterToPublishedLevels), which a
 * build-time consumer like the sitemap cannot reach, so this derives the same
 * answer from local data: the ordered level registry gives the cutoff, and the
 * generated exercise -> level manifest says which side of it each exercise
 * falls on.
 *
 * Two exclusions are deliberate:
 *
 * - Only `exerciseLessonSlugs` are considered. Challenges also render at
 *   /exercises/<slug>, but they are premium-gated and standalone, so they stay
 *   out of the sitemap for the same reason premium guides do.
 * - An exercise whose level is unknown is dropped, not kept. The failure this
 *   guards is one-directional: dropping a live exercise costs an unlisted page,
 *   whereas keeping an unmapped one risks publishing unreleased curriculum.
 */
export function publishedExerciseSlugs(lastPublishedLevelSlug: string | null = LAST_PUBLISHED_LEVEL_SLUG): string[] {
  const published = publishedLevelIds(lastPublishedLevelSlug);
  return exerciseLessonSlugs.filter((slug) => {
    const levelId = exerciseLevels[slug];
    return levelId !== undefined && published.has(levelId);
  });
}

/**
 * The level ids up to and including the cutoff. A null cutoff means everything
 * is published; a cutoff naming a level the registry does not have is a bug in
 * the constant rather than a licence to publish the lot, so it publishes nothing
 * and the sitemap simply omits exercises until it is corrected.
 */
function publishedLevelIds(lastPublishedLevelSlug: string | null): Set<string> {
  const ids: string[] = levels.map((level) => level.id);
  if (lastPublishedLevelSlug === null) {
    return new Set(ids);
  }

  const cutoffIndex = ids.indexOf(lastPublishedLevelSlug);
  return new Set(cutoffIndex === -1 ? [] : ids.slice(0, cutoffIndex + 1));
}
