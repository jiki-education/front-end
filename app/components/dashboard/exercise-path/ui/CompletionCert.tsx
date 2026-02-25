import TrophyIcon from "@/icons/trophy.svg";
import styles from "./CompletionCert.module.css";

interface CompletionCertProps {
  completedCount: number;
  totalCount: number;
}

export function CompletionCert({ completedCount, totalCount }: CompletionCertProps) {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className={`${styles.card} ${percentage === 100 ? styles.complete : ""}`}>
      <div className={styles.badge}>
        <TrophyIcon />
      </div>
      <div className={styles.outer}>
        <div className={styles.inner}>
          <div className={styles.title}>Completion Certificate</div>
          <div className={styles.subtitle}>
            Complete all the exercises to get your completion certificate and showcase your new skills!
          </div>
          <div className={styles.bar}>
            <div className={styles.barFill} style={{ width: `${percentage}%` }} />
          </div>
          <div className={styles.barText}>{percentage}% complete</div>
        </div>
      </div>
    </div>
  );
}
