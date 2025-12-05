import styles from "../ExercisePath.module.css";
import Image from "next/image";

interface StartCardProps {
  completed?: boolean;
}

export function StartCard({ completed = false }: StartCardProps) {
  return (
    <div className={`${styles.startCard} ${completed ? styles.complete : ""}`}>
      <div className={styles.startCardIcon}>
        <Image src="/static/images/start.png" alt="Start" width={48} height={48} />
      </div>
      <div className={styles.startCardContent}>
        <h2>Start Here</h2>
      </div>
      <p className={styles.startCardSubtitle}>Begin your journey!</p>
    </div>
  );
}
