import CodingIcon from "@static/icons/coding.svg";
import QuizIcon from "@static/icons/quiz.svg";
import VideoIcon from "@static/icons/video.svg";
import VideoLibIcon from "@/icons/video-lib.svg";
import QuizCardIcon from "@/icons/quiz-card.svg";
import { useEffect, useRef } from "react";
import type { LessonDisplayData } from "../types";
import type { AnimationState } from "../hooks/useProgressAnimation";
import styles from "../ExercisePath.module.css";
import { ExerciseIcon } from "../../../icons/ExerciseIcon";

interface LessonNodeProps {
  lesson: LessonDisplayData;
  onClick?: (e: React.MouseEvent) => void;
  animationState?: AnimationState;
  isRecentlyUnlocked?: boolean;
  isActiveLesson?: boolean;
}

export function LessonNode({ lesson, onClick, animationState, isRecentlyUnlocked, isActiveLesson }: LessonNodeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActiveLesson && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isActiveLesson]);

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

  // Determine if this lesson is currently animating
  const isAnimatingComplete = animationState?.completingLessonSlug === lesson.lesson.slug;

  // Check if this lesson is the one that should be shown as just unlocked
  const isJustUnlocked = animationState?.pendingUnlockSlug === lesson.lesson.slug;

  // Build className based on state and animations
  const getClassName = () => {
    const classes = [styles.lessonPart];

    if (isAnimatingComplete) {
      // Lesson that's completing (turning green)
      classes.push(styles.animatingComplete);
    } else if (isJustUnlocked && animationState.animationPhase === "completing") {
      // Show as locked initially, waiting to animate
      classes.push(styles.locked);
    } else if (isJustUnlocked && animationState.animationPhase === "unlocking") {
      // Animate from locked to unlocked
      classes.push(styles.locked);
      classes.push(styles.animatingUnlock);
    } else if (isRecentlyUnlocked) {
      // This lesson was unlocked during this session - keep showing as unlocked
      classes.push(styles.unlocked);
    } else if (lesson.completed) {
      classes.push(styles.complete);
    } else if (lesson.locked) {
      classes.push(styles.locked);
    } else {
      // Normal in-progress state
      classes.push(styles.inProgress);
    }

    return classes.join(" ");
  };

  return (
    <div ref={ref} className={getClassName()} onClick={handleClick}>
      <div className={styles.statusBadge}>
        {lesson.completed ? "Complete" : lesson.locked ? "Locked" : "In Progress"}
      </div>
      <div className={styles.partIcon}>
        {lesson.lesson.type === "video" ? (
          <VideoLibIcon width={64} height={64} />
        ) : lesson.lesson.type === "quiz" ? (
          <QuizCardIcon width={64} height={64} />
        ) : lesson.lesson.type === "choose_language" ? (
          <ChooseLanguageIcon />
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
          ) : lesson.lesson.type === "choose_language" ? (
            <>
              <ChooseLanguageSmallIcon className={styles.partNumberIcon} />
              Choice
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
}

function ChooseLanguageIcon() {
  return (
    <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
    </svg>
  );
}

function ChooseLanguageSmallIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
    </svg>
  );
}
