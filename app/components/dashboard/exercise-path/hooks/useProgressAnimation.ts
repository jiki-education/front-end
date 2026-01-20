import { useState, useCallback, useRef, useEffect } from "react";

export type AnimationPhase = "completing" | "unlocking" | "idle";

export interface AnimationState {
  completingLessonSlug: string | null;
  unlockingLessonSlug: string | null;
  animationPhase: AnimationPhase;
  // Store the lesson that will be unlocked from the start
  pendingUnlockSlug: string | null;
}

export function useProgressAnimation() {
  const [animationState, setAnimationState] = useState<AnimationState>({
    completingLessonSlug: null,
    unlockingLessonSlug: null,
    animationPhase: "idle",
    pendingUnlockSlug: null
  });

  // Track active timers for cleanup
  const timeoutIdsRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Clear all active timers
      // eslint-disable-next-line react-hooks/exhaustive-deps -- Ref value is stable and we need to clear timers on unmount
      const timers = timeoutIdsRef.current;
      timers.forEach((id) => clearTimeout(id));
      timers.clear();
    };
  }, []);

  const delay = useCallback((ms: number): Promise<void> => {
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        timeoutIdsRef.current.delete(timeoutId);
        resolve();
      }, ms);
      timeoutIdsRef.current.add(timeoutId);
    });
  }, []);

  const animateLessonProgress = useCallback(
    async (completedLessonSlug: string | null, nextLessonSlug: string | null) => {
      // Clear any existing timers before starting new animation
      timeoutIdsRef.current.forEach((id) => clearTimeout(id));
      timeoutIdsRef.current.clear();

      // If we have a completed lesson, show completion animation first
      if (completedLessonSlug && isMountedRef.current) {
        // Phase 1: Animate lesson completion (green transition)
        setAnimationState({
          completingLessonSlug: completedLessonSlug,
          unlockingLessonSlug: null,
          animationPhase: "completing",
          pendingUnlockSlug: nextLessonSlug // Store which lesson will unlock
        });

        // Wait for completion animation
        await delay(800);
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- isMountedRef changes when component unmounts
        if (!isMountedRef.current) {
          return;
        }
      }

      // Phase 2: Animate next lesson unlock (if exists)
      if (nextLessonSlug && isMountedRef.current) {
        setAnimationState({
          completingLessonSlug: null,
          unlockingLessonSlug: nextLessonSlug,
          animationPhase: "unlocking",
          pendingUnlockSlug: nextLessonSlug
        });

        // Wait for unlock animation (33 seconds to match CSS animation)
        await delay(33000);
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- isMountedRef changes when component unmounts
        if (!isMountedRef.current) {
          return;
        }
      }

      // Reset animation state
      if (isMountedRef.current) {
        setAnimationState({
          completingLessonSlug: null,
          unlockingLessonSlug: null,
          animationPhase: "idle",
          pendingUnlockSlug: null
        });
      }
    },
    [delay]
  );

  return {
    animationState,
    animateLessonProgress,
    isAnimating: animationState.animationPhase !== "idle"
  };
}
