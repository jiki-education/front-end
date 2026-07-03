"use client";

import { isExercismAuthEnabled, beginExercismAuth } from "@/lib/auth/exercism";
import ExercismIcon from "@/icons/exercism.svg";
import styles from "./AuthForm.module.css";

interface ExercismAuthButtonProps {
  children: React.ReactNode;
  onError?: () => void;
}

export function ExercismAuthButton({ children, onError }: ExercismAuthButtonProps) {
  // Don't render if Exercism OAuth client ID is not configured
  if (!isExercismAuthEnabled()) {
    return null;
  }

  const handleClick = () => {
    try {
      beginExercismAuth();
    } catch (err) {
      console.error("Failed to start Exercism auth:", err);
      onError?.();
    }
  };

  return (
    <button type="button" onClick={handleClick} className="ui-btn ui-btn-large ui-btn-tertiary">
      <ExercismIcon className={styles.oauthIcon} />
      {children}
    </button>
  );
}
