import React from "react";
import styles from "./ConceptLayout.module.css";

interface ConceptLayoutProps {
  children: React.ReactNode;
  breadcrumb?: React.ReactNode;
  rightPanel?: React.ReactNode;
  footer?: React.ReactNode;
}

export default function ConceptLayout({ children, breadcrumb, rightPanel, footer }: ConceptLayoutProps) {
  return (
    <div className={styles.grid}>
      <main className={styles.main}>
        {breadcrumb}
        {children}
      </main>
      <aside className={styles.aside}>{rightPanel || <div />}</aside>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
