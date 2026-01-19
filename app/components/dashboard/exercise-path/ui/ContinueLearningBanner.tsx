"use client";

import { useEffect, useState } from "react";
import type { LessonType } from "@/types/lesson";
import styles from "./ContinueLearningBanner.module.css";

interface ContinueLearningBannerProps {
  nextLesson: {
    id: string;
    title: string;
    route: string;
    type: LessonType;
  } | null;
  onStartLesson: (lessonId: string, route: string) => void;
}

export function ContinueLearningBanner({ nextLesson, onStartLesson }: ContinueLearningBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  // Timer-based banner display - setState in timer callback is standard pattern
  useEffect(() => {
    if (!nextLesson) {
      setShouldShow(false);
      setIsVisible(false);
      return;
    }

    // Show banner after 3 seconds
    const showTimer = setTimeout(() => {
      setShouldShow(true);
    }, 3000);

    return () => clearTimeout(showTimer);
  }, [nextLesson]);

  // Animation trigger after render - small delay ensures DOM is ready
  useEffect(() => {
    if (shouldShow) {
      // Small delay to ensure the element is rendered before animating
      const animateTimer = setTimeout(() => {
        setIsVisible(true);
      }, 50);

      return () => clearTimeout(animateTimer);
    }
  }, [shouldShow]);

  const handleStartClick = () => {
    if (nextLesson) {
      onStartLesson(nextLesson.id, nextLesson.route);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Hide completely after animation
    setTimeout(() => setShouldShow(false), 300);
  };

  if (!shouldShow || !nextLesson) {
    return null;
  }

  return (
    <div className={`${styles.banner} ${isVisible ? styles.visible : styles.hidden}`}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.mainContent}>
            <div className={styles.textContent}>
              <div className={styles.title}>Continue Learning</div>
              <div className={styles.nextLesson}>Next: {nextLesson.title}</div>
              <div className={styles.metadata}>
                {nextLesson.type === "video" ? "Video" : nextLesson.type === "quiz" ? "Quiz" : "Exercise"}
              </div>
            </div>
            <button onClick={handleStartClick} className={styles.startButton}>
              Start
            </button>
          </div>

          <div className={styles.actions}>
            <button onClick={handleDismiss} className={styles.dismissButton} aria-label="Dismiss">
              <svg className={styles.dismissIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
