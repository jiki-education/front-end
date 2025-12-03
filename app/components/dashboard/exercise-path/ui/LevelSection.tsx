import { ExerciseNode } from "../ExerciseNode";
import { LessonTooltip } from "../LessonTooltip";
import { MilestoneButton } from "./MilestoneButton";
import type { LevelSection as LevelSectionType } from "../lib/levelSectionMapper";

interface LevelSectionProps {
  section: LevelSectionType;
  clickedLessonId: string | null;
  levelCompletionInProgress: string | null;
  onLessonClick: (lessonId: string) => void;
  onLessonNavigation: (route: string) => void;
  onMilestoneClick: (section: LevelSectionType) => void;
}

export function LevelSection({
  section,
  clickedLessonId,
  levelCompletionInProgress,
  onLessonClick,
  onLessonNavigation,
  onMilestoneClick
}: LevelSectionProps) {
  if (section.lessons.length === 0) {
    return null;
  }

  return (
    <div key={section.levelSlug}>
      {/* Level Header */}
      <div
        className={`absolute left-1/2 transform -translate-x-1/2 ${section.isLocked ? "opacity-60" : ""}`}
        style={{ top: `${section.lessons[0].position.y - 60}px` }}
      >
        <h2 className="text-xl font-bold text-gray-800 text-center mb-2">{section.levelTitle}</h2>
        <div className="text-sm text-gray-600 text-center">
          {section.lessons.filter((l) => l.completed).length}/{section.lessons.length} completed
        </div>
      </div>

      {/* Lesson Nodes */}
      {section.lessons.map((lesson) => (
        <div
          key={lesson.id}
          className="absolute"
          style={{
            left: `calc(50% + ${lesson.position.x}px)`,
            top: `${lesson.position.y}px`,
            transform: "translateX(-50%)"
          }}
        >
          <LessonTooltip exercise={lesson} placement="bottom" onNavigate={onLessonNavigation}>
            <div
              className={`transition-all duration-200 ${clickedLessonId === lesson.id ? "scale-95 opacity-75" : ""}`}
            >
              <ExerciseNode
                exercise={lesson}
                onClick={() => {
                  if (lesson.locked) {
                    return;
                  }
                  onLessonClick(lesson.id);
                }}
              />
            </div>
          </LessonTooltip>
        </div>
      ))}

      {/* Milestone Button */}
      {(section.milestoneStatus === "ready_for_completion" || section.milestoneStatus === "completed") && (
        <div
          className="absolute left-1/2 transform -translate-x-1/2"
          style={{
            top: `${section.lessons[section.lessons.length - 1].position.y + 80}px`
          }}
        >
          <MilestoneButton
            levelTitle={section.levelTitle}
            onClick={() => onMilestoneClick(section)}
            disabled={levelCompletionInProgress === section.levelSlug}
            completed={section.milestoneStatus === "completed"}
          />
        </div>
      )}
    </div>
  );
}
