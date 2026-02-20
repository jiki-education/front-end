import { useEffect, useMemo, useState } from "react";
import { fetchLevelsWithProgress } from "@/lib/api/levels";
import type { LessonType, LevelWithProgress } from "@/types/levels";
import type { LessonDisplayData, LevelSectionData } from "../types";

export function useLevels() {
  const [levels, setLevels] = useState<LevelWithProgress[]>([]);
  const [levelsLoading, setLevelsLoading] = useState(true);

  useEffect(() => {
    async function loadLevels() {
      try {
        setLevelsLoading(true);
        const data = await fetchLevelsWithProgress();
        setLevels(data);
      } finally {
        setLevelsLoading(false);
      }
    }

    void loadLevels();
  }, []);

  // Convert our simplified data to the format LevelSection expects
  const levelSections = useMemo(() => {
    return levels.map((level, levelIndex): LevelSectionData => {
      const lessons: LessonDisplayData[] = level.lessons.map((lesson, lessonIndex) => {
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
          lesson: {
            slug: lesson.slug,
            type: lesson.type,
            title: lesson.slug
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" "),
            description: getLessonDescription(lesson.type),
            walkthrough_video_data: lesson.walkthrough_video_data
          },
          completed: lesson.status === "completed",
          locked,
          route: `/lesson/${lesson.slug}`
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
    levelsLoading
  };
}

function getLessonDescription(type: LessonType): string {
  switch (type) {
    case "video":
      return "Video lesson";
    case "choose_language":
      return "Choose your programming language";
    case "quiz":
      return "Quiz";
    case "exercise":
      return "Interactive exercise";
  }
}
