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
    <div className="max-w-screen-xl mx-auto py-16 px-8 sm:py-20 sm:px-12 lg:py-32 lg:px-48">
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
