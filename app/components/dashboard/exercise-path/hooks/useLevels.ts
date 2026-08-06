import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { fetchLevelsWithProgress } from "@/lib/api/levels";
import { fetchCurriculumCopy, resolveCopy, type CurriculumCopyCatalog } from "@/lib/api/curriculum-copy";
import { LAST_PUBLISHED_LEVEL_SLUG } from "@/lib/constants/course";
import { fetchLevelMessages, resolveLevelTitle, type LevelMessageCatalog } from "@/lib/api/level-meta";
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

// Both catalogs are loaded alongside the levels themselves, so every section and
// node has its real text on first paint. They default to empty/slug so non-React
// callers and tests don't have to thread them through; an entry missing from a
// catalog renders its slug.
export function buildLevelSections(
  levels: LevelWithProgress[],
  copy: CurriculumCopyCatalog = {},
  levelTitle: (slug: string) => string = (slug) => slug
): LevelSectionData[] {
  return levels.map((level, levelIndex): LevelSectionData => {
    // Lock state is driven by the API: a lesson is locked when the user hasn't
    // unlocked it yet (absent from their progress, surfaced as a "locked" status).
    const lessons: LessonDisplayData[] = level.lessons.map((lesson) => {
      const lessonCopy = resolveCopy(copy, lesson.slug);
      return {
        lesson: {
          slug: lesson.slug,
          type: lesson.type,
          title: lessonCopy.title,
          description: lessonCopy.description
        },
        completed: lesson.status === "completed",
        locked: lesson.status === "locked",
        route: `/lesson/${lesson.slug}`,
        walkthroughVideo: lessonCopy.walkthroughVideo,
        walkthroughVideoWatchedPercentage: lesson.walkthrough_video_watched_percentage
      };
    });

    const completedLessonsCount = lessons.filter((l) => l.completed).length;

    return {
      levelSlug: level.slug,
      levelTitle: levelTitle(level.slug),
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
  const locale = useLocale();
  const [levels, setLevels] = useState<LevelWithProgress[]>([]);
  const [copy, setCopy] = useState<CurriculumCopyCatalog>({});
  const [levelMessages, setLevelMessages] = useState<LevelMessageCatalog>({});
  const [levelsLoading, setLevelsLoading] = useState(true);

  useEffect(() => {
    async function loadLevels() {
      try {
        setLevelsLoading(true);
        // Both catalogs are part of the dashboard's load, not a later top-up:
        // holding the skeleton until all three land means every section heading
        // and lesson node paints with its real text instead of flashing a slug.
        const [data, catalog, levelCatalog] = await Promise.all([
          fetchLevelsWithProgress(),
          fetchCurriculumCopy(locale),
          fetchLevelMessages(locale)
        ]);
        setLevels(data);
        setCopy(catalog);
        setLevelMessages(levelCatalog);
      } finally {
        setLevelsLoading(false);
      }
    }

    void loadLevels();
  }, [locale]);

  const reachedEndOfPublishedLevels = useMemo(() => {
    return hasReachedEndOfPublishedLevels(levels);
  }, [levels]);

  const levelSections = useMemo(() => {
    const visibleLevels = reachedEndOfPublishedLevels ? filterToPublishedLevels(levels) : levels;
    return buildLevelSections(visibleLevels, copy, (slug) => resolveLevelTitle(levelMessages, slug));
  }, [levels, copy, levelMessages, reachedEndOfPublishedLevels]);

  return {
    levels,
    setLevels,
    levelSections,
    levelsLoading,
    reachedEndOfPublishedLevels
  };
}
