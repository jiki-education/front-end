import CodingIcon from "@static/icons/coding.svg";
import QuizIcon from "@static/icons/quiz.svg";
import VideoIcon from "@static/icons/video.svg";
import Image from "next/image";
import type { LessonData } from "../types";
import styles from "../ExercisePath.module.css";

interface LessonNodeProps {
  lesson: LessonData;
  onClick?: () => void;
}

export function LessonNode({ lesson, onClick }: LessonNodeProps) {
  return (
    <div
      className={`${styles.lessonPart} ${lesson.completed ? styles.complete : lesson.locked ? styles.locked : styles.inProgress}`}
      onClick={() => {
        if (lesson.locked) {
          return;
        }
        onClick?.();
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
              Exercise
            </>
          )}
        </div>
        <div className={styles.partTitle}>{lesson.title}</div>
        <div className={styles.partDescription}>{lesson.description}</div>
      </div>
    </div>
  );
}
