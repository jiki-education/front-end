"use client";

import type { LessonDisplayData } from "@/components/dashboard/exercise-path/types";

import { useState } from "react";
import styles from "@/components/dashboard/exercise-path/ExercisePath.module.css";
import pageStyles from "./page.module.css";
import { WalkthroughCard } from "@/components/dashboard/exercise-path/ui/WalkthroughCard";
import VideoLibIcon from "@/icons/video-lib.svg";
import QuizCardIcon from "@/icons/quiz-card.svg";

export default function UnlockAnimationTest() {
  const [animationState, setAnimationState] = useState<"idle" | "completing" | "unlocking">("idle");
  const [recentlyUnlocked, setRecentlyUnlocked] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  const startAnimation = () => {
    // Reset everything first
    setAnimationState("idle");
    setRecentlyUnlocked(false);
    setLessonCompleted(false);

    // Start with completion animation
    setTimeout(() => {
      setAnimationState("completing");
    }, 100);

    // After 800ms, switch to unlocking and mark lesson as completed
    setTimeout(() => {
      setAnimationState("unlocking");
      setRecentlyUnlocked(true);
      setLessonCompleted(true);
    }, 900);

    // After 33 seconds + 900ms, reset animation state but keep unlocked and completed state
    setTimeout(() => {
      setAnimationState("idle");
    }, 33900);
  };

  const resetAll = () => {
    setAnimationState("idle");
    setRecentlyUnlocked(false);
    setLessonCompleted(false);
  };

  // Mock lesson data
  const completingLesson: LessonDisplayData = {
    lesson: {
      slug: "maze-solve-basic",
      type: "video" as const,
      title: "Introduction to Variables",
      description: "Learn about variables and data types",
      walkthrough_video_data: [
        { provider: "mux" as const, id: "mock-video-id-1", durationSeconds: 120, uploadDate: "2026-01-01" }
      ]
    },
    completed: lessonCompleted,
    locked: false,
    route: "/lessons/lesson-1",
    walkthroughVideoWatchedPercentage: 0
  };

  const unlockingLesson: LessonDisplayData = {
    lesson: {
      slug: "using-functions",
      type: "quiz" as const,
      title: "Variables Quiz",
      description: "Test your knowledge of variables",
      walkthrough_video_data: [
        { provider: "mux" as const, id: "mock-video-id-2", durationSeconds: 120, uploadDate: "2026-01-01" }
      ]
    },
    completed: false,
    locked: animationState === "completing" || (!recentlyUnlocked && animationState === "idle"),
    route: "/lessons/lesson-2",
    walkthroughVideoWatchedPercentage: 0
  };

  // Build className for completing lesson
  const getCompletingClassName = () => {
    const classes = [styles.lessonPart];

    if (animationState === "completing") {
      classes.push(styles.animatingComplete);
    } else if (lessonCompleted) {
      classes.push(styles.complete);
    } else {
      classes.push(styles.inProgress);
    }

    return classes.join(" ");
  };

  // Build className for unlocking lesson
  const getUnlockingClassName = () => {
    const classes = [styles.lessonPart];

    if (animationState === "completing") {
      // Still locked during completion phase
      classes.push(styles.locked);
    } else if (animationState === "unlocking") {
      // Animate unlock
      classes.push(styles.locked);
      classes.push(styles.animatingUnlock);
    } else if (recentlyUnlocked) {
      // After animation, show as unlocked
      classes.push(styles.unlocked);
    } else {
      // Default locked state
      classes.push(styles.locked);
    }

    return classes.join(" ");
  };

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.container}>
        <h1 className={pageStyles.title}>Unlock Animation Test</h1>

        {/* Control buttons */}
        <div className={pageStyles.controls}>
          <button onClick={startAnimation} className={pageStyles.startButton} disabled={animationState !== "idle"}>
            Start Animation
          </button>
          <button onClick={resetAll} className={pageStyles.resetButton}>
            Reset
          </button>
          <span className={pageStyles.stateLabel}>
            State: {animationState} | Completed: {lessonCompleted ? "Yes" : "No"} | Unlocked:{" "}
            {recentlyUnlocked ? "Yes" : "No"}
          </span>
        </div>

        {/* Lesson nodes with proper spacing */}
        <div className={styles.learningPath}>
          <div className={pageStyles.pathWrapper}>
            {/* Completing lesson */}
            <div className={getCompletingClassName()}>
              <div className={styles.statusBadge}>{lessonCompleted ? "Complete" : "In Progress"}</div>
              <div className={styles.partIcon}>
                <VideoLibIcon width={64} height={64} />
              </div>
              <div className={styles.partContent}>
                <div className={`${styles.partNumber} ${styles.video}`}>Video</div>
                <div className={styles.partTitle}>{completingLesson.lesson.title}</div>
                <div className={styles.partDescription}>{completingLesson.lesson.description}</div>
              </div>
              <WalkthroughCard lesson={completingLesson} isCompleting={animationState === "completing"} />
            </div>

            {/* Unlocking lesson with proper margin */}
            <div className={getUnlockingClassName()} style={{ marginTop: "20px" }}>
              <div className={styles.statusBadge}>{recentlyUnlocked ? "In Progress" : "Locked"}</div>
              <div className={styles.partIcon}>
                <QuizCardIcon width={64} height={64} />
              </div>
              <div className={styles.partContent}>
                <div className={`${styles.partNumber} ${styles.quiz}`}>Quiz</div>
                <div className={styles.partTitle}>{unlockingLesson.lesson.title}</div>
                <div className={styles.partDescription}>{unlockingLesson.lesson.description}</div>
              </div>
              <WalkthroughCard lesson={unlockingLesson} />
            </div>
          </div>
        </div>

        {/* Animation timeline */}
        <div className={pageStyles.timeline}>
          <h2 className={pageStyles.timelineTitle}>Animation Timeline:</h2>
          <ul className={pageStyles.timelineList}>
            <li>0ms: Start</li>
            <li>100ms: Completion animation begins (lesson 1 turns green)</li>
            <li>900ms: Unlock animation begins (lesson 2 lock icon changes)</li>
            <li>900ms - 30.9s: Unlocked icon visible</li>
            <li>30.9s - 33.9s: Unlocked icon fades out</li>
            <li>33.9s: Animation complete</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
