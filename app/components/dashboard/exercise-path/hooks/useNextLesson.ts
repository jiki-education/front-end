import { useMemo } from "react";
import type { LevelSection } from "../lib/levelSectionMapper";
import type { ExerciseType } from "../../lib/mockData";

interface NextLesson {
  id: string;
  title: string;
  route: string;
  type: ExerciseType;
  estimatedTime: number;
}

export function useNextLesson(sections: LevelSection[]): NextLesson | null {
  return useMemo(() => {
    // Find the current level (first level that's not completed and has available lessons)
    for (const section of sections) {
      // Skip locked levels
      if (section.isLocked) {
        continue;
      }

      // Get all available (non-completed, non-locked) lessons in this level
      const availableLessons = section.lessons.filter((lesson) => !lesson.completed && !lesson.locked);

      // Only show banner if:
      // 1. There are available lessons
      // 2. No lessons in this level have been started (all are either completed or not started)
      if (availableLessons.length > 0) {
        const nextLesson = availableLessons[0];

        return {
          id: nextLesson.id,
          title: nextLesson.title,
          route: nextLesson.route,
          type: nextLesson.type,
          estimatedTime: nextLesson.estimatedTime
        };
      }
    }

    return null;
  }, [sections]);
}
