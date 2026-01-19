import { useState } from "react";
import { showModal } from "@/lib/modal";
import { completeLevelMilestone, fetchLevelsWithProgress } from "@/lib/api/levels";
import type { LevelWithProgress } from "@/types/levels";
import type { LevelSectionData } from "../types";

export function useMilestoneHandler(setLevels: (levels: LevelWithProgress[]) => void) {
  const [levelCompletionInProgress, setLevelCompletionInProgress] = useState<string | null>(null);

  const handleMilestoneClick = (section: LevelSectionData) => {
    // Check if milestone is ready (all lessons completed but level not completed)
    const isReady = section.completedLessonsCount === section.lessons.length && section.status !== "completed";
    if (!isReady || levelCompletionInProgress) {
      return;
    }

    setLevelCompletionInProgress(section.levelSlug);

    try {
      showModal("level-milestone-modal", {
        levelTitle: section.levelTitle,
        completedLessonsCount: section.completedLessonsCount,
        totalLessonsCount: section.lessons.length,
        xpEarned: section.xpEarned,
        onContinue: async () => {
          try {
            const response = await completeLevelMilestone(section.levelSlug);

            // Check for unlocked lesson in the API response
            const unlockedEvent = response?.meta?.events?.find((e: any) => e.type === "lesson_unlocked");
            const unlockedLessonSlug = unlockedEvent?.data?.lesson_slug;

            const updatedLevels = await fetchLevelsWithProgress();
            setLevels(updatedLevels);

            // If a lesson was unlocked (first lesson of next level), trigger animation
            if (unlockedLessonSlug) {
              // Navigate to reload with the unlocked lesson for animation
              window.location.href = `/dashboard?unlocked=${unlockedLessonSlug}`;
            }
          } catch (error) {
            console.error("Failed to complete level milestone:", error);
          } finally {
            setLevelCompletionInProgress(null);
          }
        },
        onGoToDashboard: () => {
          setLevelCompletionInProgress(null);
        }
      });
    } catch (error) {
      console.error("Failed to show milestone modal:", error);
      setLevelCompletionInProgress(null);
    }
  };

  return {
    handleMilestoneClick,
    levelCompletionInProgress
  };
}
