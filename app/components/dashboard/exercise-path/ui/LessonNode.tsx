import CodingIcon from "@static/icons/coding.svg";
import QuizIcon from "@static/icons/quiz.svg";
import VideoIcon from "@static/icons/video.svg";
import VideoLibIcon from "@/icons/video-lib.svg";
import QuizCardIcon from "@/icons/quiz-card.svg";
import { forwardRef } from "react";
import type { LessonDisplayData } from "../types";
import styles from "../ExercisePath.module.css";
import { ExerciseIcon } from "../../../icons/ExerciseIcon";

interface LessonNodeProps {
  lesson: LessonDisplayData;
  onClick?: (e: React.MouseEvent) => void;
}

export const LessonNode = forwardRef<HTMLDivElement, LessonNodeProps>(function LessonNode({ lesson, onClick }, ref) {
  const handleClick = (e: React.MouseEvent) => {
    if (lesson.locked) {
      e.stopPropagation();
      return;
    }
    if (onClick) {
      e.stopPropagation();
      onClick(e);
    }
  };

  return (
    <div
      ref={ref}
      className={`${styles.lessonPart} ${lesson.completed ? styles.complete : lesson.locked ? styles.locked : styles.inProgress}`}
      onClick={handleClick}
    >
      <div className={styles.statusBadge}>
        {lesson.completed ? "Complete" : lesson.locked ? "Locked" : "In Progress"}
      </div>
      <div className={styles.partIcon}>
        {lesson.lesson.type === "video" ? (
          <VideoLibIcon width={64} height={64} />
        ) : lesson.lesson.type === "quiz" ? (
          <QuizCardIcon width={64} height={64} />
        ) : (
          <ExerciseIcon slug={lesson.lesson.slug} width={64} height={64} />
        )}
      </div>
      <div className={styles.partContent}>
        <div className={`${styles.partNumber} ${styles[lesson.lesson.type]}`}>
          {lesson.lesson.type === "video" ? (
            <>
              <VideoIcon className={styles.partNumberIcon} />
              Video
            </>
          ) : lesson.lesson.type === "quiz" ? (
            <>
              <QuizIcon className={styles.partNumberIcon} />
              Quiz
            </>
          ) : (
            <>
              <CodingIcon className={styles.partNumberIcon} />
              Exercise
            </>
          )}
        </div>
        <div className={styles.partTitle}>{lesson.lesson.title}</div>
        <div className={styles.partDescription}>{lesson.lesson.description}</div>
      </div>
    </div>
  );
});
