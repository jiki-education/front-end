import styles from "../ExercisePath.module.css";

interface StartCardProps {
  completed?: boolean;
}

export function StartCard({ completed: _completed = false }: StartCardProps) {
  return (
    <div className={styles.startCard}>
      <span>🎌</span>
      <h2>The start of your coding journey</h2>
    </div>
  );
}
