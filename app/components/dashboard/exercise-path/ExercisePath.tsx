"use client";

import LessonLoadingModal from "@/components/common/LessonLoadingModal/LessonLoadingModal";
import { ExercisePathSkeleton } from "./ui/ExercisePathSkeleton";
import { useLessonNavigation } from "./hooks/useLessonNavigation";
import { useMilestoneHandler } from "./hooks/useMilestoneHandler";
import { useLevels } from "./hooks/useLevels";
import { useLessonCompletionAnimation } from "./hooks/useLessonCompletionAnimation";
import { useDelayedLoading } from "@/lib/hooks/useDelayedLoading";
import { LevelSection } from "./ui/LevelSection";
import styles from "./ExercisePath.module.css";
import { StartCard } from "./ui/StartCard";
import { CompletionCert } from "./ui/CompletionCert";
import { ScrollToActiveLessonButton } from "./ui/ScrollToActiveLessonButton";
import { useEffect, useMemo, useRef } from "react";

export default function ExercisePath() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { levelSections, setLevels, levelsLoading } = useLevels();
  const shouldShowSkeleton = useDelayedLoading(levelsLoading);
  const { handleLessonNavigation, clickedLessonSlug, setClickedLessonSlug, isPending } = useLessonNavigation();
  const { handleMilestoneClick, levelCompletionInProgress } = useMilestoneHandler(setLevels);
  const { animationState, triggerCompletionAnimation, recentlyUnlockedLessons } = useLessonCompletionAnimation();

  const activeLessonSlug = useMemo(() => {
    for (const section of levelSections) {
      for (const lesson of section.lessons) {
        if (!lesson.completed && !lesson.locked) {
          return lesson.lesson.slug;
        }
      }
    }
    return null;
  }, [levelSections]);

  const { completedCount, totalCount } = useMemo(() => {
    let completed = 0;
    let total = 0;
    for (const section of levelSections) {
      total += section.lessons.length;
      completed += section.completedLessonsCount;
    }
    return { completedCount: completed, totalCount: total };
  }, [levelSections]);

  // Listen for lesson completion events from URL params or other sources
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const completedLesson = urlParams.get("completed");
    const unlockedLesson = urlParams.get("unlocked");

    if (completedLesson || unlockedLesson) {
      // Trigger animation with both completed and unlocked lessons
      // If only unlocked is present (from milestone completion), completed will be null
      void triggerCompletionAnimation(completedLesson, unlockedLesson).then(() => {
        // Clean up the URL params only after animation completes
        // This prevents losing animation state on page refresh during the animation
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("completed");
        newUrl.searchParams.delete("unlocked");
        window.history.replaceState({}, "", newUrl);
      });
    }
  }, [triggerCompletionAnimation]);

  const handleLessonClick = (lessonSlug: string, route: string) => {
    setClickedLessonSlug(lessonSlug);
    handleLessonNavigation(route);
  };

  if (shouldShowSkeleton) {
    return <ExercisePathSkeleton />;
  }

  return (
    <div ref={containerRef} className={styles.learningPath}>
      {isPending && <LessonLoadingModal />}
      <StartCard firstLessonCompleted={levelSections[0]?.lessons[0]?.completed ?? false} />
      {levelSections.map((section, index) => (
        <LevelSection
          key={section.levelSlug}
          section={section}
          nextSectionFirstLesson={levelSections[index + 1]?.lessons[0] ?? null}
          _clickedLessonSlug={clickedLessonSlug}
          _levelCompletionInProgress={levelCompletionInProgress}
          onLessonClick={handleLessonClick}
          _onLessonNavigation={handleLessonNavigation}
          onMilestoneClick={handleMilestoneClick}
          animationState={animationState}
          recentlyUnlockedLessons={recentlyUnlockedLessons}
          activeLessonSlug={activeLessonSlug}
        />
      ))}
      <CompletionCert completedCount={completedCount} totalCount={totalCount} />
      <ScrollToActiveLessonButton containerRef={containerRef} />
    </div>
  );
}
