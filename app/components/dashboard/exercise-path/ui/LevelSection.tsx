import { LessonTooltip } from "../LessonTooltip";
import { MilestoneCard } from "./MilestoneCard";
import type { LevelSectionData } from "../types";
import styles from "../ExercisePath.module.css";
import CodingIcon from "@static/icons/coding.svg";
import VideoIcon from "@static/icons/video.svg";
import QuizIcon from "@static/icons/quiz.svg";
import Image from "next/image";

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
          <div
            className={`${styles.lessonPart} ${lesson.completed ? styles.complete : lesson.locked ? styles.locked : styles.inProgress}`}
            onClick={() => {
              if (lesson.locked) {
                return;
              }
              onLessonClick(lesson.id);
            }}
          >
            <div className={styles.statusBadge}>
              {lesson.completed ? "Complete" : lesson.locked ? "Locked" : "In Progress"}
            </div>
            <div className={styles.partIcon}>
              <Image src="/static/images/concept-icons/icon-variables.png" alt="Video" width={24} height={24} />
            </div>
            <div className={styles.partContent}>
              <div className={`${styles.partNumber} ${styles[lesson.type]}`}>
                {lesson.type === "video" ? (
                  <>
                    <VideoIcon className={styles.partNumberIcon} />
                    Video
                  </>
                ) : lesson.type === "quiz" ? (
                  <>
                    <QuizIcon className={styles.partNumberIcon} />
                    Quiz
                  </>
                ) : (
                  <>
                    <CodingIcon className={styles.partNumberIcon} />
                    Coding
                  </>
                )}
              </div>
              <div className={styles.partTitle}>{lesson.title}</div>
              <div className={styles.partDescription}>{lesson.description}</div>
            </div>
          </div>
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
