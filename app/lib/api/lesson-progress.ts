import { fetchLevelsWithProgress } from "./levels";

export type LessonStatus = "not_started" | "started" | "completed";

/**
 * Fetch lesson statuses for a set of slugs.
 * Returns a record mapping slug to status.
 * Lessons not found in any level default to "not_started".
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

  // Default missing slugs to not_started
  for (const slug of slugs) {
    if (!(slug in statuses)) {
      statuses[slug] = "not_started";
    }
  }

  return statuses;
}
