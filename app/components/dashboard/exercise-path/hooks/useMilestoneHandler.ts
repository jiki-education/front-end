import { useState } from "react";
import { showModal } from "@/lib/modal";
import { completeLevelMilestone, fetchLevelsWithProgress } from "@/lib/api/levels";
import type { LevelWithProgress } from "@/types/levels";
import type { LevelSection } from "../lib/levelSectionMapper";

export function useMilestoneHandler(setLevels: (levels: LevelWithProgress[]) => void) {
  const [levelCompletionInProgress, setLevelCompletionInProgress] = useState<string | null>(null);

  const handleMilestoneClick = (section: LevelSection) => {
    if (section.milestoneStatus !== "ready_for_completion" || levelCompletionInProgress) {
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
