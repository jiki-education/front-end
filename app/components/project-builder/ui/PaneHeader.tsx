// Shared header strip for the workspace panes, so Files, Editor, Preview and
// Jiki all read as one system. `mono` renders the title as a filename.

import type { ReactNode } from "react";
import styles from "./PaneHeader.module.css";

export function PaneHeader({
  title,
  mono = false,
  children
}: {
  title: ReactNode;
  mono?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={styles.header}>
      <div className={mono ? styles.titleMono : styles.title}>{title}</div>
      {children && <div className={styles.actions}>{children}</div>}
    </div>
  );
}
