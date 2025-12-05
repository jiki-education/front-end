import styles from "../ExercisePath.module.css";

interface MilestoneCardProps {
  status: "completed" | "readyForCompletion" | "locked";
  label: string;
  title?: string;
  description?: string;
  iconSrc: string;
  progressPercentage?: number;
}

export function MilestoneCard({ status, label, title, description, progressPercentage }: MilestoneCardProps) {
  return (
    <div className={`${styles.milestoneCard} ${styles[status]}`}>
      <div className={styles.milestoneCardContent}>
        <span className={styles.milestoneLabel}>{label}</span>
        {title && <h3>{title}</h3>}
        {description && <p>{description}</p>}
        {status === "readyForCompletion" && progressPercentage !== undefined && (
          <div className={styles.milestoneProgressBar}>
            <div className={styles.milestoneProgressFill} style={{ width: `${progressPercentage}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}
