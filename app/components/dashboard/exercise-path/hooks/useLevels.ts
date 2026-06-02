import { useEffect, useMemo, useState } from "react";
import { fetchLevelsWithProgress } from "@/lib/api/levels";
import { LAST_PUBLISHED_LEVEL_SLUG } from "@/lib/constants/course";
import type { LevelWithProgress } from "@/types/levels";
import type { LessonDisplayData, LevelSectionData } from "../types";

// Whether the user has completed every lesson in the last published level.
// When true, levels beyond it are hidden and the Coming Soon card is shown
// in place of the completion certificate.
export function hasReachedEndOfPublishedLevels(
  levels: LevelWithProgress[],
  lastPublishedLevelSlug: string | null = LAST_PUBLISHED_LEVEL_SLUG
): boolean {
  if (lastPublishedLevelSlug === null) {
    return false;
  }

  const cutoffLevel = levels.find((level) => level.slug === lastPublishedLevelSlug);
  if (!cutoffLevel || cutoffLevel.lessons.length === 0) {
    return false;
  }

  return cutoffLevel.lessons.every((lesson) => lesson.status === "completed");
}

// Hides levels after the last published level so unfinished lessons aren't shown.
// Returns all levels when no cutoff is set (or the cutoff slug isn't found).
export function filterToPublishedLevels(
  levels: LevelWithProgress[],
  lastPublishedLevelSlug: string | null = LAST_PUBLISHED_LEVEL_SLUG
): LevelWithProgress[] {
  if (lastPublishedLevelSlug === null) {
    return levels;
  }

  const cutoffIndex = levels.findIndex((level) => level.slug === lastPublishedLevelSlug);
  if (cutoffIndex === -1) {
    return levels;
  }

  return levels.slice(0, cutoffIndex + 1);
}

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
          title: lesson.title,
          description: lesson.description,
          walkthrough_video_data: lesson.walkthrough_video_data
        },
        completed: lesson.status === "completed",
        locked,
        route: `/lesson/${lesson.slug}`,
        walkthroughVideoWatchedPercentage: lesson.walkthrough_video_watched_percentage
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

  const reachedEndOfPublishedLevels = useMemo(() => {
    return hasReachedEndOfPublishedLevels(levels);
  }, [levels]);

  const levelSections = useMemo(() => {
    const visibleLevels = reachedEndOfPublishedLevels ? filterToPublishedLevels(levels) : levels;
    return buildLevelSections(visibleLevels);
  }, [levels, reachedEndOfPublishedLevels]);

  return {
    levels,
    setLevels,
    levelSections,
    levelsLoading,
    reachedEndOfPublishedLevels
  };
}
