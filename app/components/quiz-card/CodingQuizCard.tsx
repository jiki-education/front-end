"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { playSound } from "@/lib/sound";
import { QuizContent } from "./QuizContent";
import { CodeInput } from "./CodeInput";
import { InfoBox } from "./InfoBox";
import { SubmitButton } from "./SubmitButton";
import styles from "./quiz-card.module.css";

export interface CodingQuizQuestion {
  id: string;
  content: string;
  correctAnswer: string;
  hint?: string;
  successMessage?: string;
  errorMessage?: string;
}

interface CodingQuizCardProps {
  question: CodingQuizQuestion;
  onNext?: () => void;
}

export function CodingQuizCard({ question, onNext }: CodingQuizCardProps) {
  const t = useTranslations("quizCard.coding");
  const [userCode, setUserCode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    const normalizeCode = (code: string) => {
      return code.trim().replace(/\s+/g, " ").toLowerCase();
    };

    const correct = normalizeCode(userCode) === normalizeCode(question.correctAnswer);
    setIsCorrect(correct);
    setSubmitted(true);

    // Play appropriate sound
    playSound(correct ? "success" : "error");
  };

  const handleNext = () => {
    setUserCode("");
    setSubmitted(false);
    setIsCorrect(false);
    onNext?.();
  };

  const getInfoBoxProps = () => {
    if (!submitted) {
      return null;
    }

    if (isCorrect) {
      return {
        type: "success" as const,
        title: t("successTitle"),
        message: question.successMessage || t("successMessage")
      };
    }

    return {
      type: "error" as const,
      title: t("errorTitle"),
      message: question.errorMessage || question.hint || t("errorMessage")
    };
  };

  const infoBoxProps = getInfoBoxProps();

  return (
    <div className={styles.card} data-testid="quiz-card">
      <div className={styles.content}>
        <QuizContent markdown={question.content} />
      </div>

      <CodeInput
        value={userCode}
        onChange={setUserCode}
        disabled={submitted}
        isCorrect={submitted && isCorrect}
        isIncorrect={submitted && !isCorrect}
      />

      {infoBoxProps && <InfoBox type={infoBoxProps.type} title={infoBoxProps.title} message={infoBoxProps.message} />}

      <SubmitButton
        onClick={submitted ? handleNext : handleSubmit}
        disabled={!submitted && userCode.trim() === ""}
        variant={submitted ? "next" : "submit"}
      />
    </div>
  );
}
