"use client";

import styles from "../ChooseLanguage.module.css";

interface ProgressBarProps {
  step: "video" | "selector";
}

export function ProgressBar({ step }: ProgressBarProps) {
  const isOnSelector = step === "selector";

  return (
    <div className={styles.progressBar}>
      <div className={`${styles.progressStep} ${styles.complete}`} />
      <div className={`${styles.progressLine} ${isOnSelector ? styles.complete : ""}`} />
      <div className={`${styles.progressStep} ${isOnSelector ? styles.complete : ""}`} />
    </div>
  );
}
