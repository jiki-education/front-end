import type { LevelSectionData } from "../types";
import type { AnimationState } from "../hooks/useProgressAnimation";
import { LessonNode } from "./LessonNode";
import { MilestoneCard } from "./MilestoneCard";

interface LevelSectionProps {
  section: LevelSectionData;
  _clickedLessonSlug: string | null;
  _levelCompletionInProgress: string | null;
  onLessonClick: (lessonSlug: string, route: string) => void;
  _onLessonNavigation: (route: string) => void;
  onMilestoneClick: (section: LevelSectionData) => void;
  animationState?: AnimationState;
  recentlyUnlockedLessons?: Set<string>;
}

export function LevelSection({
  section,
  _clickedLessonSlug,
  _levelCompletionInProgress,
  onLessonClick,
  _onLessonNavigation,
  onMilestoneClick,
  animationState,
  recentlyUnlockedLessons
}: LevelSectionProps) {
  if (section.lessons.length === 0) {
    return null;
  }

  return (
    <>
      {section.lessons.map((lesson) => (
        <LessonNode
          key={lesson.lesson.slug}
          lesson={lesson}
          onClick={(_e) => onLessonClick(lesson.lesson.slug, lesson.route)}
          animationState={animationState}
          isRecentlyUnlocked={recentlyUnlockedLessons?.has(lesson.lesson.slug) || false}
        />
      ))}

      {/* Always show milestone - it's the divider between levels */}
      {section.status === "completed" && (
        <div>
          <MilestoneCard
            status="completed"
            label={`Milestone ${section.levelIndex}`}
            description="You've completed this level!"
            iconSrc="/static/images/milestone-1.png"
            progressPercentage={100}
          />
        </div>
      )}

      {section.completedLessonsCount === section.lessons.length && section.status !== "completed" && (
        <div onClick={() => onMilestoneClick(section)}>
          <MilestoneCard
            status="readyForCompletion"
            label="Next Milestone"
            description={undefined}
            iconSrc="/static/images/milestone-1.png"
            progressPercentage={100}
          />
        </div>
      )}

      {section.completedLessonsCount < section.lessons.length && section.status !== "completed" && (
        <div>
          <MilestoneCard
            status="locked"
            label={`Milestone ${section.levelIndex}`}
            description={undefined}
            iconSrc="/static/images/milestone-1.png"
            progressPercentage={undefined}
          />
        </div>
      )}
    </>
  );
}
