import type { ReactNode } from "react";
import styles from "./PageHeader.module.css";

interface PageHeaderProps {
  icon: ReactNode;
  title: string | ReactNode;
  description: string;
  children?: ReactNode;
}

export function PageHeader({ icon, title, description, children }: PageHeaderProps) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          {icon}
          {title}
        </h1>
        <p className={styles.description}>{description}</p>
      </header>
      {children}
    </div>
  );
}
