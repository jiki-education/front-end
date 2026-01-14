import { LessonTooltip } from "../LessonTooltip";
import type { LevelSectionData } from "../types";
import { LessonNode } from "./LessonNode";
import { MilestoneCard } from "./MilestoneCard";

interface LevelSectionProps {
  section: LevelSectionData;
  _clickedLessonId: string | null;
  _levelCompletionInProgress: string | null;
  onLessonClick: (lessonId: string) => void;
  onLessonNavigation: (route: string) => void;
  onMilestoneClick: (section: LevelSectionData) => void;
}

export function LevelSection({
  section,
  _clickedLessonId,
  _levelCompletionInProgress,
  onLessonClick,
  onLessonNavigation,
  onMilestoneClick
}: LevelSectionProps) {
  if (section.lessons.length === 0) {
    return null;
  }

  return (
    <>
      {section.lessons.map((lesson) => (
        <LessonTooltip key={lesson.id} exercise={lesson} placement="bottom" onNavigate={onLessonNavigation}>
          <LessonNode lesson={lesson} onClick={() => onLessonClick(lesson.id)} />
        </LessonTooltip>
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
