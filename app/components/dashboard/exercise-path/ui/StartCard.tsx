import styles from "./StartCard.module.css";
import StartFlagIcon from "@/icons/start-flag.svg";

interface StartCardProps {
  firstLessonCompleted?: boolean;
}

export function StartCard({ firstLessonCompleted = false }: StartCardProps) {
  const className = `${styles.startCard} ${firstLessonCompleted ? styles.startCardConnectorGreen : styles.startCardConnectorPurple}`;
  return (
    <div className={className}>
      <StartFlagIcon height={18} width={18} />
      <h2>The Start of your Journey</h2>
    </div>
  );
}
