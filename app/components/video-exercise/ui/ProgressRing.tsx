import styles from "../VideoExercise.module.css";

interface ProgressRingProps {
  progress: number;
  isComplete: boolean;
  showCheckmark: boolean;
  isAlreadyCompleted: boolean;
}

export function ProgressRing({ progress, isComplete, showCheckmark, isAlreadyCompleted }: ProgressRingProps) {
  return (
    <div className={styles.pillRing}>
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle className={styles.pillRingBg} cx="36" cy="36" r="28" />
        <circle
          className={`${styles.pillRingFill} ${isComplete ? styles.pillRingComplete : ""}`}
          cx="36"
          cy="36"
          r="28"
          style={{ strokeDashoffset: isAlreadyCompleted ? 0 : 176 * (1 - progress / 100) }}
        />
      </svg>
      <span className={`${styles.pillPercentage} ${showCheckmark ? styles.hidden : ""}`}>
        {isComplete ? "100%" : `${Math.round(progress)}%`}
      </span>
      <div className={`${styles.pillCheck} ${showCheckmark ? styles.visible : ""}`}>
        <svg viewBox="0 0 24 24">
          <path d="M6 12l4 4 8-8" />
        </svg>
      </div>
    </div>
  );
}
