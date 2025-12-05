import { useEffect, useMemo, useState } from "react";
import { fetchLevelsWithProgress } from "@/lib/api/levels";
import type { LevelWithProgress } from "@/types/levels";
import type { LevelSectionData } from "../types";

export function useLevels() {
  const [levels, setLevels] = useState<LevelWithProgress[]>([]);
  const [levelsLoading, setLevelsLoading] = useState(true);
  const [levelsError, setLevelsError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLevels() {
      try {
        setLevelsLoading(true);
        const data = await fetchLevelsWithProgress();
        setLevels(data);
      } catch (error) {
        console.error("Failed to fetch levels:", error);
        setLevelsError(error instanceof Error ? error.message : "Failed to load levels");
      } finally {
        setLevelsLoading(false);
      }
    }

    void loadLevels();
  }, []);

  // Convert our simplified data to the format LevelSection expects
  const levelSections = useMemo(() => {
    return levels.map((level, levelIndex): LevelSectionData => {
      const lessons = level.lessons.map((lesson, lessonIndex) => {
        // Simple locking logic: first lesson is always unlocked, others unlock if previous is completed
        let locked = false;
        if (levelIndex === 0 && lessonIndex === 0) {
          locked = false; // First lesson ever
        } else if (lessonIndex === 0) {
          // First lesson of level - check if previous level is completed
          locked = levelIndex > 0 && levels[levelIndex - 1].status !== "completed";
        } else {
          // Subsequent lessons - check if previous lesson is completed
          locked = level.lessons[lessonIndex - 1].status !== "completed";
        }

        return {
          id: `${level.slug}-${lesson.slug}`,
          slug: lesson.slug,
          title: lesson.slug
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" "),
          type: lesson.type,
          completed: lesson.status === "completed",
          locked,
          description: lesson.type === "video" ? "Video lesson" : "Interactive exercise",
          route: `/lesson/${lesson.slug}`,
          position: { x: 0, y: 0 } // Not needed for tooltip but required by interface
        };
      });

      const completedLessonsCount = lessons.filter((l) => l.completed).length;

      return {
        levelSlug: level.slug,
        levelTitle: level.slug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" "),
        levelIndex: levelIndex + 1, // 1-based indexing for display
        lessons,
        isLocked: lessons.length > 0 ? lessons[0].locked : false,
        status: level.status === "ready_for_completion" ? "started" : level.status,
        completedLessonsCount,
        xpEarned: completedLessonsCount * 10
      };
    });
  }, [levels]);

  return {
    levels,
    setLevels,
    levelSections,
    levelsLoading,
    levelsError
  };
}
