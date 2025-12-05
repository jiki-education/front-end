import styles from "../ExercisePath.module.css";

interface StartCardProps {
  completed?: boolean;
}

export function StartCard({ completed = false }: StartCardProps) {
  return (
    <div className={`${styles.startCard} ${completed ? styles.complete : ""}`}>
      <div className={styles.startCardIcon}>
        <img src="/static/images/start.png" alt="Start" />
      </div>
      <div className={styles.startCardContent}>
        <h2>Start Here</h2>
      </div>
      <p className={styles.startCardSubtitle}>Begin your journey!</p>
    </div>
  );
}