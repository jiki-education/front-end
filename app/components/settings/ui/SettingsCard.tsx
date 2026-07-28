import type { ReactNode } from "react";
import styles from "./SettingsCard.module.css";

interface SettingsCardProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export default function SettingsCard({ children, title, description, className = "" }: SettingsCardProps) {
  return (
    <section className={`${styles.card} ${className}`}>
      {title && (
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {description && <p className={styles.description}>{description}</p>}
        </header>
      )}

      <div className={styles.body}>{children}</div>
    </section>
  );
}
