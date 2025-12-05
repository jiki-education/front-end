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
            await completeLevelMilestone(section.levelSlug);
            const updatedLevels = await fetchLevelsWithProgress();
            setLevels(updatedLevels);
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
