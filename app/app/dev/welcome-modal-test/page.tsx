"use client";

import { showWelcomeModal } from "@/lib/modal/app";
import { clearFlagLocal } from "@/lib/api/flags";
import styles from "./page.module.css";

const WELCOME_FLAG_KEY = "welcome_modal";

export default function WelcomeModalTestPage() {
  const handleShow = () => {
    showWelcomeModal();
  };

  const handleReset = () => {
    clearFlagLocal(WELCOME_FLAG_KEY);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Welcome Modal</h1>
      <p className={styles.subtitle}>Test the first-time welcome modal shown to new superusers.</p>

      <div className={styles.cards}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Show Modal</h2>
          <p className={styles.cardDescription}>Opens the welcome modal directly.</p>
          <button onClick={handleShow} className={styles.buttonPrimary}>
            Show Welcome Modal
          </button>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Reset localStorage flag</h2>
          <p className={styles.cardDescription}>
            Clears the <code className={styles.inlineCode}>{WELCOME_FLAG_KEY}</code> key so the modal will trigger again
            on next page load.
          </p>
          <button onClick={handleReset} className={styles.buttonSecondary}>
            Reset flag
          </button>
        </div>
      </div>
    </div>
  );
}
