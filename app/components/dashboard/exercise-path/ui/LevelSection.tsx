import type { LessonDisplayData, LevelSectionData } from "../types";
import type { AnimationState } from "../hooks/useProgressAnimation";
import { LessonNode } from "./LessonNode";
import { MilestoneCard } from "./MilestoneCard";

interface LevelSectionProps {
  section: LevelSectionData;
  nextSectionFirstLesson: LessonDisplayData | null;
  _clickedLessonSlug: string | null;
  _levelCompletionInProgress: string | null;
  onLessonClick: (lessonSlug: string, route: string) => void;
  _onLessonNavigation: (route: string) => void;
  onMilestoneClick: (section: LevelSectionData) => void;
  animationState?: AnimationState;
  recentlyUnlockedLessons?: Set<string>;
  activeLessonSlug?: string | null;
}

export function LevelSection({
  section,
  nextSectionFirstLesson,
  _clickedLessonSlug,
  _levelCompletionInProgress,
  onLessonClick,
  _onLessonNavigation,
  onMilestoneClick: _onMilestoneClick,
  animationState,
  recentlyUnlockedLessons,
  activeLessonSlug
}: LevelSectionProps) {
  if (section.lessons.length === 0) {
    return null;
  }

  const nextLessonState =
    nextSectionFirstLesson === null
      ? null
      : nextSectionFirstLesson.completed
        ? "completed"
        : nextSectionFirstLesson.locked
          ? "locked"
          : "active";

  const lessonProgress = {
    completed: section.completedLessonsCount,
    total: section.lessons.length
  };

  return (
    <>
      {section.lessons.map((lesson, index) => {
        const isLast = index === section.lessons.length - 1;
        const next = section.lessons[index + 1];
        const lastLesson = section.lessons[section.lessons.length - 1];
        let connectorStyle:
          | "green"
          | "gradient"
          | "gradientToLocked"
          | "toMilestone"
          | "toMilestoneAchieved"
          | "toMilestoneUnlockedFromGreen"
          | "toMilestoneUnlockedFromPurple"
          | "toMilestoneUnlockedFromGray"
          | undefined;
        if (isLast) {
          if (section.status === "completed") {
            connectorStyle = "toMilestoneAchieved";
          } else if (!section.isLocked) {
            if (lastLesson.completed) connectorStyle = "toMilestoneUnlockedFromGreen";
            else if (!lastLesson.locked) connectorStyle = "toMilestoneUnlockedFromPurple";
            else connectorStyle = "toMilestoneUnlockedFromGray";
          } else {
            connectorStyle = "toMilestone";
          }
        } else if (lesson.completed) {
          connectorStyle = next.completed ? "green" : "gradient";
        } else if (!lesson.locked && next.locked) {
          connectorStyle = "gradientToLocked";
        }
        return (
          <LessonNode
            key={lesson.lesson.slug}
            lesson={lesson}
            onClick={(_e) => onLessonClick(lesson.lesson.slug, lesson.route)}
            animationState={animationState}
            isRecentlyUnlocked={recentlyUnlockedLessons?.has(lesson.lesson.slug) || false}
            isActiveLesson={lesson.lesson.slug === activeLessonSlug}
            connectorStyle={connectorStyle}
          />
        );
      })}

      {/* Always show milestone - it's the divider between levels */}
      {section.status === "completed" ? (
        <div>
          <MilestoneCard
            status="achieved"
            label={`Milestone ${section.levelIndex}`}
            nextLessonState={nextLessonState}
          />
        </div>
      ) : section.isLocked ? (
        <div>
          <MilestoneCard status="locked" label={`Milestone ${section.levelIndex}`} nextLessonState={nextLessonState} />
        </div>
      ) : (
        <div>
          <MilestoneCard
            status="unlocked"
            label={`Milestone ${section.levelIndex}`}
            nextLessonState={nextLessonState}
            lessonProgress={lessonProgress}
          />
        </div>
      )}
    </>
  );
}
