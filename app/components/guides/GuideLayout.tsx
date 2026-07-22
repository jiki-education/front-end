import React from "react";
import styles from "./GuideLayout.module.css";

interface GuideLayoutProps {
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
}

export default function GuideLayout({ children, rightPanel }: GuideLayoutProps) {
  return (
    <div className={styles.grid}>
      <main className={styles.main}>{children}</main>
      <aside className={styles.aside}>{rightPanel || <div />}</aside>
    </div>
  );
}
