import type { ReactNode } from "react";
import styles from "./ChallengesEmptyState.module.css";

type Variant = "purple" | "blue" | "green" | "gray";

interface ChallengesEmptyStateProps {
  variant: Variant;
  icon: ReactNode;
  title: string;
  description: string;
}

export function ChallengesEmptyState({ variant, icon, title, description }: ChallengesEmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.wrapper} data-variant={variant}>
        <div className={styles.iconCircle} data-variant={variant}>
          {icon}
        </div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}
