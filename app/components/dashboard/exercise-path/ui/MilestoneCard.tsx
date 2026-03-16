import MilestoneFlagIcon from "@/icons/milestone-flag.svg";
import styles from "./MilestoneCard.module.css";

interface MilestoneCardProps {
  status: "achieved" | "locked" | "unlocked";
  label: string;
  nextLessonState?: "completed" | "active" | "locked" | null;
  lessonProgress?: { completed: number; total: number };
}

export function MilestoneCard({ status, label, nextLessonState, lessonProgress }: MilestoneCardProps) {
  const nextClass =
    nextLessonState === "completed"
      ? styles.nextCompleted
      : nextLessonState === "active"
        ? styles.nextActive
        : nextLessonState === "locked"
          ? styles.nextLocked
          : "";

  if (status === "unlocked") {
    const progressPct =
      lessonProgress && lessonProgress.total > 0
        ? Math.round((lessonProgress.completed / lessonProgress.total) * 100)
        : 0;

    return (
      <div className={`${styles.milestoneCard} ${styles.unlocked} ${nextClass}`}>
        <div className={styles.milestoneCardContent}>
          <MilestoneFlagIcon className={styles.milestoneUnlockedIcon} />
          <span className={styles.milestoneLabel}>{label}</span>
          <div className={styles.milestoneProgressBar}>
            <div className={styles.milestoneProgressFill} style={{ width: `${progressPct}%` }} />
          </div>
        </div>
        {nextLessonState !== null && <span className={styles.lessonConnector} />}
      </div>
    );
  }

  return (
    <div className={`${styles.milestoneCard} ${styles[status]} ${nextClass}`}>
      <div className={styles.milestoneCardContent}>
        <MilestoneFlagIcon className={styles.milestoneCardIcon} />
        <span className={styles.milestoneLabel}>{label}</span>
      </div>
      {nextLessonState !== null && <span className={styles.lessonConnector} />}
    </div>
  );
}
