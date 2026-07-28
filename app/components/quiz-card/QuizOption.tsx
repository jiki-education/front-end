"use client";

import { Check, X } from "lucide-react";
import styles from "./QuizOption.module.css";

export type QuizOptionState =
  | "default"
  | "hovered"
  | "clicked"
  | "selected"
  | "correct"
  | "incorrect"
  | "correct-reveal";

interface QuizOptionProps {
  text: string;
  index: number;
  state: QuizOptionState;
  isCorrect: boolean;
  onSelect: () => void;
  disabled: boolean;
}

export function QuizOption({ text, index, state, onSelect, disabled }: QuizOptionProps) {
  const letter = String.fromCharCode(65 + index);
  const showIcon = state === "correct" || state === "incorrect" || state === "correct-reveal";

  return (
    <button onClick={onSelect} disabled={disabled} className={styles.option} data-state={state}>
      <div className={styles.optionLabel}>
        <span className={styles.letter}>{letter}.</span>
        <span className={styles.text}>{text}</span>
      </div>
      {showIcon && (
        <div className={styles.icon}>
          {state === "correct" && <Check className={styles.iconCorrect} />}
          {state === "incorrect" && <X className={styles.iconIncorrect} />}
          {state === "correct-reveal" && <Check className={styles.iconCorrect} />}
        </div>
      )}
    </button>
  );
}
