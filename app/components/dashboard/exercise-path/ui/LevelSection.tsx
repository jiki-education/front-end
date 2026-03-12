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
  onMilestoneClick,
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

  return (
    <>
      {section.lessons.map((lesson, index) => {
        const isLast = index === section.lessons.length - 1;
        const next = section.lessons[index + 1];
        let connectorStyle: "green" | "gradient" | "gradientToLocked" | "toMilestone" | undefined;
        if (isLast) {
          connectorStyle = "toMilestone";
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
            description="You've completed this level!"
            iconSrc="/static/images/milestone-1.png"
            nextLessonState={nextLessonState}
          />
        </div>
      ) : (
        <div onClick={() => onMilestoneClick(section)}>
          <MilestoneCard
            status="locked"
            label={`Milestone ${section.levelIndex}`}
            iconSrc="/static/images/milestone-1.png"
            nextLessonState={nextLessonState}
          />
        </div>
      )}
    </>
  );
}
