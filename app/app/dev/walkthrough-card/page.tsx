"use client";

import { WalkthroughCard } from "@/components/dashboard/exercise-path/ui/WalkthroughCard";
import type { LessonDisplayData } from "@/components/dashboard/exercise-path/types";
import styles from "./page.module.css";

function createLesson(overrides: Partial<LessonDisplayData> = {}): LessonDisplayData {
  return {
    lesson: {
      title: "Solve the Maze",
      description: "Guide Jiki through a maze.",
      slug: "maze-solve-basic",
      type: "exercise"
    },
    walkthroughVideo: {
      provider: "mux",
      id: "PNbgUkVhy38y7OELdYseo1GAD01XG8FGLJ1nj9BvuKCU",
      durationSeconds: 120,
      uploadDate: "2026-01-01"
    },
    completed: false,
    locked: false,
    route: "/lesson/test",
    walkthroughVideoWatchedPercentage: 0,
    ...overrides
  };
}

const lockedLesson = createLesson({ locked: true, completed: false });
const unwatchedLesson = createLesson({ completed: true, walkthroughVideoWatchedPercentage: 0 });
const watchingLesson = createLesson({ completed: true, walkthroughVideoWatchedPercentage: 50 });
const watchedLesson = createLesson({ completed: true, walkthroughVideoWatchedPercentage: 100 });

export default function WalkthroughCardPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>WalkthroughCard States</h1>

        <div className={styles.states}>
          {[
            { label: "Locked (exercise not completed)", lesson: lockedLesson },
            { label: "Unwatched - 0% (blue)", lesson: unwatchedLesson },
            { label: "Watching - 50% (purple)", lesson: watchingLesson },
            { label: "Watched - 100% (green)", lesson: watchedLesson }
          ].map(({ label, lesson }) => (
            <div key={label}>
              <h2 className={styles.stateTitle}>{label}</h2>
              <div className={styles.cardShell} style={{ minHeight: 120 }}>
                <span className={styles.cardLabel}>Lesson card content</span>
                <WalkthroughCard lesson={lesson} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
