"use client";

import type { StreamStatus } from "../lib/chat-types";
import styles from "./ChatStatus.module.css";

interface ChatStatusProps {
  status: StreamStatus;
  error: string | null;
  onRetry?: () => void;
  onClearError?: () => void;
  canRetry?: boolean;
}

export default function ChatStatus({ error, onRetry, canRetry = false }: ChatStatusProps) {
  if (error) {
    return (
      <div className={styles.errorBar}>
        <div className={styles.errorRow}>
          <div className={styles.errorMessage}>
            <span className={styles.errorIcon}>⚠️</span>
            <span className={styles.errorLabel}>Error:</span>
            <span className={styles.errorText}>{error}</span>
          </div>
          <div className={styles.errorActions}>
            {canRetry && onRetry && (
              <button onClick={onRetry} className={styles.retryButton}>
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // For idle/thinking/typing status, we don't show anything to keep the UI clean
  return null;
}
