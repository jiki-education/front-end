"use client";

import { useTranslations } from "next-intl";
import styles from "./CodeInput.module.css";

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isCorrect?: boolean;
  isIncorrect?: boolean;
}

export function CodeInput({ value, onChange, placeholder, disabled = false, isCorrect, isIncorrect }: CodeInputProps) {
  const t = useTranslations("quizCard");
  const resolvedPlaceholder = placeholder ?? t("codeInputPlaceholder");
  const state = isCorrect ? "correct" : isIncorrect ? "incorrect" : "default";

  return (
    <div className={styles.wrapper}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={resolvedPlaceholder}
        disabled={disabled}
        className={styles.textarea}
        data-state={state}
        spellCheck={false}
      />
    </div>
  );
}
