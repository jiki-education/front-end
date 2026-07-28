"use client";

import { useTranslations } from "next-intl";
import styles from "./quiz-card.module.css";

interface SubmitButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: "submit" | "next";
  text?: string;
}

export function SubmitButton({ onClick, disabled = false, variant = "submit", text }: SubmitButtonProps) {
  const t = useTranslations("quizCard");
  const buttonText = text || (variant === "next" ? t("nextQuestion") : t("submit"));

  return (
    <button onClick={onClick} disabled={disabled} className={styles.submitButton} data-variant={variant}>
      {buttonText}
    </button>
  );
}
