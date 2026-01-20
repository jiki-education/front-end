"use client";

import NavigationLoadingOverlay from "@/components/common/NavigationLoadingOverlay";
import { LoadingState } from "./ui/LoadingState";
import { useLessonNavigation } from "./hooks/useLessonNavigation";
import { useMilestoneHandler } from "./hooks/useMilestoneHandler";
import { useLevels } from "./hooks/useLevels";
import { LevelSection } from "./ui/LevelSection";
import styles from "./ExercisePath.module.css";
import { StartCard } from "./ui/StartCard";

export default function ExercisePath() {
  const { levelSections, setLevels, levelsLoading } = useLevels();
  const { handleLessonNavigation, clickedLessonSlug, setClickedLessonSlug, isPending } = useLessonNavigation();
  const { handleMilestoneClick, levelCompletionInProgress } = useMilestoneHandler(setLevels);

  const handleLessonClick = (lessonSlug: string, route: string) => {
    setClickedLessonSlug(lessonSlug);
    handleLessonNavigation(route);
  };

  if (levelsLoading) {
    return <LoadingState />;
  }

  return (
    <div className={styles.learningPath}>
      <NavigationLoadingOverlay isVisible={isPending} />
      <StartCard />
      {levelSections.map((section) => (
        <LevelSection
          key={section.levelSlug}
          section={section}
          _clickedLessonSlug={clickedLessonSlug}
          _levelCompletionInProgress={levelCompletionInProgress}
          onLessonClick={handleLessonClick}
          _onLessonNavigation={handleLessonNavigation}
          onMilestoneClick={handleMilestoneClick}
        />
      ))}
    </div>
  );
}
