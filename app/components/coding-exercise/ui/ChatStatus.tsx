"use client";

import { useTranslations } from "next-intl";
import styles from "./ChatStatus.module.css";

interface ChatStatusProps {
  error: string | null;
  onRetry?: () => void;
  canRetry?: boolean;
}

export default function ChatStatus({ error, onRetry, canRetry = false }: ChatStatusProps) {
  const t = useTranslations("codingExercise.chatStatus");
  const tCommon = useTranslations("common");
  if (!error) {
    return null;
  }

  return (
    <div className={styles.errorBar}>
      <div className={styles.errorRow}>
        <div className={styles.errorMessage}>
          <span className={styles.errorIcon}>⚠️</span>
          <span className={styles.errorLabel}>{t("errorLabel")}</span>
          <span className={styles.errorText}>{error}</span>
        </div>
        <div className={styles.errorActions}>
          {canRetry && onRetry && (
            <button onClick={onRetry} className={styles.retryButton}>
              {tCommon("tryAgain")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
