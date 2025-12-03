"use client";

import { fetchLevelsWithProgress } from "@/lib/api/levels";
import type { LevelWithProgress } from "@/types/levels";
import { useEffect, useMemo, useState } from "react";
import NavigationLoadingOverlay from "@/components/common/NavigationLoadingOverlay";
import { PathConnection } from "./PathConnection";
import { LevelSection } from "./ui/LevelSection";
import { LoadingState } from "./ui/LoadingState";
import { ErrorState } from "./ui/ErrorState";
import { mapLevelsToSections } from "./lib/levelSectionMapper";
import { useLessonNavigation } from "./hooks/useLessonNavigation";
import { useMilestoneHandler } from "./hooks/useMilestoneHandler";
import { useNextLesson } from "./hooks/useNextLesson";
import { ContinueLearningBanner } from "./ui/ContinueLearningBanner";

export default function ExercisePath() {
  const [levels, setLevels] = useState<LevelWithProgress[]>([]);
  const [levelsLoading, setLevelsLoading] = useState(true);
  const [levelsError, setLevelsError] = useState<string | null>(null);

  const { handleLessonNavigation, clickedLessonId, setClickedLessonId, isPending } = useLessonNavigation();
  const { handleMilestoneClick, levelCompletionInProgress } = useMilestoneHandler(setLevels);

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

  const sections = useMemo(() => mapLevelsToSections(levels), [levels]);
  const nextLesson = useNextLesson(sections);

  const pathHeight = sections.reduce((total, section) => total + 80 + section.lessons.length * 120, 200);
  const allExercises = sections.flatMap((section) => section.lessons);

  if (levelsLoading) {
    return <LoadingState />;
  }
  if (levelsError) {
    return <ErrorState error={levelsError} />;
  }

  const handleStartLesson = (lessonId: string, route: string) => {
    handleLessonNavigation(route);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 overflow-y-auto overflow-x-hidden">
      <NavigationLoadingOverlay isVisible={isPending} />
      <ContinueLearningBanner nextLesson={nextLesson} onStartLesson={handleStartLesson} />

      <div className="relative w-full max-w-2xl mx-auto px-8 py-12">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 200 ${pathHeight}`}>
          {allExercises.slice(0, -1).map((exercise, index) => (
            <PathConnection
              key={`path-${exercise.id}`}
              from={exercise.position}
              to={allExercises[index + 1].position}
              completed={exercise.completed}
            />
          ))}
        </svg>

        <div className="relative" style={{ height: `${pathHeight}px` }}>
          {sections.map((section) => (
            <LevelSection
              key={section.levelSlug}
              section={section}
              clickedLessonId={clickedLessonId}
              levelCompletionInProgress={levelCompletionInProgress}
              onLessonClick={setClickedLessonId}
              onLessonNavigation={handleLessonNavigation}
              onMilestoneClick={handleMilestoneClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
