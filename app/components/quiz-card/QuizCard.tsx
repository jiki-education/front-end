"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { playSound } from "@/lib/sound";
import { QuizContent } from "./QuizContent";
import { QuizOption, type QuizOptionState } from "./QuizOption";
import { QuizFeedback } from "./QuizFeedback";
import styles from "./quiz-card.module.css";

export interface QuizQuestion {
  id: string;
  content: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

interface QuizCardProps {
  question: QuizQuestion;
  onNext?: () => void;
}

export function QuizCard({ question, onNext }: QuizCardProps) {
  const t = useTranslations("quizCard");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [feedbackType, setFeedbackType] = useState<"correct" | "incorrect" | null>(null);

  const handleOptionSelect = (index: number) => {
    if (submitted) {
      return;
    }
    setSelectedIndex(index);
  };

  const handleSubmit = () => {
    if (selectedIndex === null) {
      return;
    }

    setSubmitted(true);
    const isCorrect = selectedIndex === question.correctIndex;
    setFeedbackType(isCorrect ? "correct" : "incorrect");

    // Play appropriate sound
    if (isCorrect) {
      playSound("success");
    } else {
      playSound("error");
    }
  };

  const handleNext = () => {
    setSelectedIndex(null);
    setSubmitted(false);
    setFeedbackType(null);
    onNext?.();
  };

  const getOptionState = (index: number): QuizOptionState => {
    if (!submitted) {
      if (selectedIndex === index) {
        return "selected";
      }
      return "default";
    }

    if (index === question.correctIndex) {
      if (selectedIndex === index) {
        return "correct";
      }
      return "correct-reveal";
    }

    if (selectedIndex === index) {
      return "incorrect";
    }
    return "default";
  };

  return (
    <div className={styles.card} data-testid="quiz-card">
      <div className={styles.content}>
        <QuizContent markdown={question.content} />
      </div>

      <div className={styles.options}>
        {question.options.map((option, index) => (
          <QuizOption
            key={index}
            text={option}
            index={index}
            state={getOptionState(index)}
            isCorrect={index === question.correctIndex}
            onSelect={() => handleOptionSelect(index)}
            disabled={submitted}
          />
        ))}
      </div>

      {!submitted && <QuizFeedback type={feedbackType} explanation={question.explanation} />}

      {submitted && <QuizFeedback type={feedbackType} explanation={question.explanation} />}

      <button
        onClick={submitted ? handleNext : handleSubmit}
        disabled={!submitted && selectedIndex === null}
        className={styles.submitButton}
        data-variant={submitted ? "next" : "submit"}
      >
        {submitted ? t("nextQuestion") : t("submit")}
      </button>
    </div>
  );
}
