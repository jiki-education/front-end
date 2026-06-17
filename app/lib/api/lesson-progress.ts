import { fetchLevelsWithProgress } from "./levels";

export type LessonStatus = "not_started" | "started" | "completed" | "locked";

/**
 * Fetch lesson statuses for a set of slugs.
 * Returns a record mapping slug to status.
 * Lessons the user hasn't unlocked (absent from their progress) are "locked".
 */
export async function fetchLessonStatusesBySlugs(slugs: string[]): Promise<Record<string, LessonStatus>> {
  const levels = await fetchLevelsWithProgress();
  const slugSet = new Set(slugs);
  const statuses: Record<string, LessonStatus> = {};

  for (const level of levels) {
    for (const lesson of level.lessons) {
      if (slugSet.has(lesson.slug)) {
        statuses[lesson.slug] = lesson.status;
      }
    }
  }

  // Any slug not present in a level the user has progressed into is locked.
  for (const slug of slugs) {
    if (!(slug in statuses)) {
      statuses[slug] = "locked";
    }
  }

  return statuses;
}
