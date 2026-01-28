import type { ComponentType, SVGProps } from "react";
import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  body: string;
  show?: boolean;
}

export default function EmptyState({ icon: Icon, title, body, show = true }: EmptyStateProps) {
  if (!show) {
    return null;
  }

  return (
    <div className={styles.emptyState}>
      <div className={styles.wrapper}>
        <div className={styles.iconCircle}>
          <Icon />
        </div>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
    </div>
  );
}
