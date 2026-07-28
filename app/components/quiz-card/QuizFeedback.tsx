"use client";

import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import styles from "./QuizFeedback.module.css";

interface QuizFeedbackProps {
  type: "correct" | "incorrect" | null;
  explanation?: string;
}

export function QuizFeedback({ type, explanation }: QuizFeedbackProps) {
  const t = useTranslations("quizCard.feedback");

  if (!type) {
    return null;
  }

  if (type === "correct") {
    return <div className={styles.correct}>{t("correct")}</div>;
  }

  return (
    <div className={styles.incorrectBox} data-testid="quiz-feedback">
      <div className={styles.row}>
        <AlertCircle className={styles.icon} />
        <div className={styles.body}>
          <p className={styles.title}>{t("incorrect")}</p>
          {explanation && <p>{explanation}</p>}
        </div>
      </div>
    </div>
  );
}
