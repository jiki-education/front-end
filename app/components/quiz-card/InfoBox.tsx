"use client";

import { CheckCircle, XCircle, Info } from "lucide-react";
import styles from "./InfoBox.module.css";

interface InfoBoxProps {
  type: "success" | "error" | "info" | null;
  title?: string;
  message?: string;
}

export function InfoBox({ type, title, message }: InfoBoxProps) {
  if (!type || (!title && !message)) {
    return null;
  }

  return (
    <div className={styles.box} data-type={type} data-testid="quiz-feedback">
      <div className={styles.row}>
        <div className={styles.iconWrap}>
          {type === "success" && <CheckCircle className={styles.icon} />}
          {type === "error" && <XCircle className={styles.icon} />}
          {type === "info" && <Info className={styles.icon} />}
        </div>
        <div className={styles.body}>
          {title && <p className={styles.title}>{title}</p>}
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
}
