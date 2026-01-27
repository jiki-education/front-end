import { useEffect, useRef } from "react";
import type { LevelSectionData } from "../types";

/**
 * Auto-scrolls to the first in-progress (active) lesson on initial load.
 * An "active" lesson is one that is not completed and not locked.
 */
export function useAutoScrollToActiveLesson(levelSections: LevelSectionData[], isLoading: boolean) {
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    // Only scroll once after data is loaded
    if (isLoading || hasScrolledRef.current || levelSections.length === 0) {
      return;
    }

    // Find the first in-progress lesson (not completed, not locked)
    let activeLessonSlug: string | null = null;

    for (const section of levelSections) {
      for (const lesson of section.lessons) {
        if (!lesson.completed && !lesson.locked) {
          activeLessonSlug = lesson.lesson.slug;
          break;
        }
      }
      if (activeLessonSlug) { break };
    }

    if (!activeLessonSlug) {
      hasScrolledRef.current = true;
      return;
    }

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      // Find the lesson element by looking for the inProgress class
      const activeElement = document.querySelector('[class*="inProgress"]');

      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }

      hasScrolledRef.current = true;
    });
  }, [levelSections, isLoading]);
}
