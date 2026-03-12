import styles from "./MilestoneCard.module.css";

interface MilestoneCardProps {
  status: "achieved" | "locked";
  label: string;
  title?: string;
  description?: string;
  iconSrc: string;
  nextLessonState?: "completed" | "active" | "locked" | null;
}

export function MilestoneCard({ status, label, title, description, nextLessonState }: MilestoneCardProps) {
  const nextClass =
    nextLessonState === "completed" ? styles.nextCompleted : nextLessonState === "active" ? styles.nextActive : "";
  return (
    <div className={`${styles.milestoneCard} ${styles[status]} ${nextClass}`}>
      <div className={styles.milestoneCardContent}>
        <span className={styles.milestoneLabel}>{label}</span>
        {title && <h3>{title}</h3>}
        {description && <p>{description}</p>}
      </div>
      {nextLessonState !== null && <span className={styles.lessonConnector} />}
    </div>
  );
}
