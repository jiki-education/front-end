import React from "react";
import styles from "./ConceptLayout.module.css";

interface ConceptLayoutProps {
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
}

export default function ConceptLayout({ children, rightPanel }: ConceptLayoutProps) {
  return (
    <div className={styles.grid}>
      <main className={styles.main}>{children}</main>
      <aside className={styles.aside}>{rightPanel || <div />}</aside>
    </div>
  );
}
