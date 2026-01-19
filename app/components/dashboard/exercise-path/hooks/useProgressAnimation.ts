import { useState, useCallback } from "react";

export type AnimationPhase = "completing" | "unlocking" | "idle";

export interface AnimationState {
  completingLessonSlug: string | null;
  unlockingLessonSlug: string | null;
  animationPhase: AnimationPhase;
  // Store the lesson that will be unlocked from the start
  pendingUnlockSlug: string | null;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useProgressAnimation() {
  const [animationState, setAnimationState] = useState<AnimationState>({
    completingLessonSlug: null,
    unlockingLessonSlug: null,
    animationPhase: "idle",
    pendingUnlockSlug: null
  });

  const animateLessonProgress = useCallback(
    async (completedLessonSlug: string | null, nextLessonSlug: string | null) => {
      // If we have a completed lesson, show completion animation first
      if (completedLessonSlug) {
        // Phase 1: Animate lesson completion (green transition)
        setAnimationState({
          completingLessonSlug: completedLessonSlug,
          unlockingLessonSlug: null,
          animationPhase: "completing",
          pendingUnlockSlug: nextLessonSlug // Store which lesson will unlock
        });

        // Wait for completion animation
        await delay(800);
      }

      // Phase 2: Animate next lesson unlock (if exists)
      if (nextLessonSlug) {
        setAnimationState({
          completingLessonSlug: null,
          unlockingLessonSlug: nextLessonSlug,
          animationPhase: "unlocking",
          pendingUnlockSlug: nextLessonSlug
        });

        // Wait for unlock animation (33 seconds to match CSS animation)
        await delay(33000);
      }

      // Reset animation state
      setAnimationState({
        completingLessonSlug: null,
        unlockingLessonSlug: null,
        animationPhase: "idle",
        pendingUnlockSlug: null
      });
    },
    []
  );

  return {
    animationState,
    animateLessonProgress,
    isAnimating: animationState.animationPhase !== "idle"
  };
}
