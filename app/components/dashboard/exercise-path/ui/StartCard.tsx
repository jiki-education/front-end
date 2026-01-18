import styles from "../ExercisePath.module.css";
import StartFlagIcon from "@/icons/start-flag.svg";

interface StartCardProps {
  completed?: boolean;
}

export function StartCard({ completed: _completed = false }: StartCardProps) {
  return (
    <div className={styles.startCard}>
      <StartFlagIcon height={18} width={18} />
      <h2>The Start of your Journey</h2>
    </div>
  );
}
