"use client";

import { useState } from "react";
import styles from "@/components/dashboard/exercise-path/ExercisePath.module.css";
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
  const completingLesson = {
    lesson: {
      slug: "lesson-1",
      type: "video" as const,
      title: "Introduction to Variables",
      description: "Learn about variables and data types"
    },
    completed: false,
    locked: false
  };

  const unlockingLesson = {
    lesson: {
      slug: "lesson-2",
      type: "quiz" as const,
      title: "Variables Quiz",
      description: "Test your knowledge of variables"
    },
    completed: false,
    locked: true
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Unlock Animation Test</h1>

        {/* Control buttons */}
        <div className="mb-8 space-x-4">
          <button
            onClick={startAnimation}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            disabled={animationState !== "idle"}
          >
            Start Animation
          </button>
          <button onClick={resetAll} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            Reset
          </button>
          <span className="ml-4 text-sm text-gray-600">
            State: {animationState} | Completed: {lessonCompleted ? "Yes" : "No"} | Unlocked:{" "}
            {recentlyUnlocked ? "Yes" : "No"}
          </span>
        </div>

        {/* Lesson nodes with proper spacing */}
        <div className={styles.learningPath}>
          <div className="relative">
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
            </div>
          </div>
        </div>

        {/* Animation timeline */}
        <div className="mt-8 p-4 bg-white rounded border">
          <h2 className="font-semibold mb-2">Animation Timeline:</h2>
          <ul className="text-sm space-y-1 text-gray-600">
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
