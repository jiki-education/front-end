import { useEffect, useMemo, useState } from "react";
import { fetchLevelsWithProgress } from "@/lib/api/levels";
import type { LevelWithProgress } from "@/types/levels";
import type { LessonDisplayData, LevelSectionData } from "../types";

export function buildLevelSections(levels: LevelWithProgress[]): LevelSectionData[] {
  return levels.map((level, levelIndex): LevelSectionData => {
    const lessons: LessonDisplayData[] = level.lessons.map((lesson, lessonIndex) => {
      let locked: boolean;
      switch (lesson.status) {
        case "completed":
        case "started":
          locked = false;
          break;
        case "not_started":
          if (levelIndex === 0 && lessonIndex === 0) {
            locked = false;
          } else if (lessonIndex === 0) {
            locked = levelIndex > 0 && levels[levelIndex - 1].status !== "completed";
          } else {
            locked = level.lessons[lessonIndex - 1].status !== "completed";
          }
          break;
      }

      return {
        lesson: {
          slug: lesson.slug,
          type: lesson.type,
          title: lesson.slug
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" "),
          description: lesson.description,
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
}

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

  const levelSections = useMemo(() => {
    return buildLevelSections(levels);
  }, [levels]);

  return {
    levels,
    setLevels,
    levelSections,
    levelsLoading
  };
}
