import { useCallback, useState } from "react";
import { useProgressAnimation } from "./useProgressAnimation";

/**
 * Hook to handle lesson completion animations on the dashboard
 * Integrates with the progress animation system to animate lesson completion and unlocking
 */
export function useLessonCompletionAnimation() {
  const { animationState, animateLessonProgress } = useProgressAnimation();

  // Track which lessons have been unlocked during this session
  const [recentlyUnlockedLessons, setRecentlyUnlockedLessons] = useState<Set<string>>(new Set());

  /**
   * Trigger animation when a lesson is completed
   * Now accepts both completed and unlocked lessons from API response
   */
  const triggerCompletionAnimation = useCallback(
    async (completedLessonSlug: string | null, unlockedLessonSlug: string | null) => {
      // Add the unlocked lesson to recently unlocked set for persistent styling
      if (unlockedLessonSlug) {
        setRecentlyUnlockedLessons((prev) => new Set(prev).add(unlockedLessonSlug));
      }

      // If we have both, play the full animation sequence
      if (completedLessonSlug && unlockedLessonSlug) {
        await animateLessonProgress(completedLessonSlug, unlockedLessonSlug);
      }
      // If only unlocked (from milestone), just play unlock animation
      else if (unlockedLessonSlug) {
        await animateLessonProgress(null, unlockedLessonSlug);
      }
      // If only completed (last lesson in last level), just play completion
      else if (completedLessonSlug) {
        await animateLessonProgress(completedLessonSlug, null);
      }
    },
    [animateLessonProgress]
  );

  return {
    animationState,
    triggerCompletionAnimation,
    isAnimating: animationState.animationPhase !== "idle",
    recentlyUnlockedLessons
  };
}
