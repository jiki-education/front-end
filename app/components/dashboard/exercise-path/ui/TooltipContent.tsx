import Link from "next/link";
import type { MouseEvent } from "react";
import type { LessonDisplayData } from "../types";
import { getTypeLabel } from "../lib/exerciseUtils";
import styles from "./LessonTooltip.module.css";

interface TooltipContentProps {
  exercise: LessonDisplayData;
  onClose: () => void;
  onNavigate?: (route: string) => void;
  headingId?: string;
  descriptionId?: string;
}

export function TooltipContent({ exercise, onClose, onNavigate, headingId, descriptionId }: TooltipContentProps) {
  const handleLessonStart = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClose(); // Close tooltip immediately
    if (onNavigate) {
      onNavigate(exercise.route); // Let parent handle navigation with loading state
    }
  };

  // Determine the context-aware content
  const getContextualContent = () => {
    if (exercise.locked) {
      return {
        description: "This lesson is locked yet. Complete the previous lesson to unlock it.",
        buttonText: "Locked",
        disabled: true,
        tooltipClass: styles.locked
      };
    }

    if (exercise.completed) {
      return {
        description: "You can review this lesson now.",
        buttonText: "Review",
        disabled: false,
        tooltipClass: styles.completed
      };
    }

    return {
      description: `Ready to start this ${getTypeLabel(exercise.lesson.type).toLowerCase()} lesson.`,
      buttonText: "Start",
      disabled: false,
      tooltipClass: styles.available
    };
  };

  const contextualContent = getContextualContent();

  return (
    <div className={`${styles.tooltip} ${contextualContent.tooltipClass}`}>
      <h3 id={headingId} className={styles.title}>
        {exercise.lesson.title}
      </h3>
      <p id={descriptionId} className={styles.message}>
        {contextualContent.description}
      </p>

      <div className={styles.buttons}>
        <button onClick={onClose} className={styles.btnSecondary}>
          Close
        </button>

        {contextualContent.disabled ? (
          <button disabled className={styles.btnLocked}>
            {contextualContent.buttonText}
          </button>
        ) : (
          <Link href={exercise.route} onClick={handleLessonStart} className={styles.btnPrimary}>
            {contextualContent.buttonText}
          </Link>
        )}
      </div>
    </div>
  );
}
