"use client";

import { playSound } from "@/lib/sound";
import { useState } from "react";
import { CodeWithBlanks, type CodeBlank } from "./CodeWithBlanks";
import { InfoBox } from "./InfoBox";
import { QuizContent } from "./QuizContent";
import { SubmitButton } from "./SubmitButton";

export interface FillInQuizQuestion {
  id: string;
  content: string;
  codeLines: string[];
  blanks: Record<string, CodeBlank>;
  successMessage?: string;
  errorMessage?: string;
  showLineNumbers?: boolean;
}

interface FillInQuizCardProps {
  question: FillInQuizQuestion;
  onNext?: () => void;
}

export function FillInQuizCard({ question, onNext }: FillInQuizCardProps) {
  const [values, setValues] = useState<Record<string, string | undefined>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [allCorrect, setAllCorrect] = useState(false);

  const handleBlankChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    const newResults: Record<string, boolean> = {};
    let correct = true;

    for (const [id, blank] of Object.entries(question.blanks)) {
      const userAnswer = (values[id] || "").trim().toLowerCase();
      const correctAnswer = blank.correctAnswer.trim().toLowerCase();
      const isCorrect = userAnswer === correctAnswer;
      newResults[id] = isCorrect;
      if (!isCorrect) {
        correct = false;
      }
    }

    setResults(newResults);
    setAllCorrect(correct);
    setSubmitted(true);

    // Play appropriate sound based on whether all answers are correct
    playSound(correct ? "success" : "error");
  };

  const handleNext = () => {
    setValues({});
    setSubmitted(false);
    setResults({});
    setAllCorrect(false);
    onNext?.();
  };

  const allBlanksHaveValues = Object.keys(question.blanks).every((id) => {
    return values[id]?.trim();
  });

  const getInfoBoxProps = () => {
    if (!submitted) {
      return null;
    }

    if (allCorrect) {
      return {
        type: "success" as const,
        title: "Perfect!",
        message: question.successMessage || "All blanks filled correctly!"
      };
    }

    const incorrectCount = Object.values(results).filter((r) => !r).length;
    return {
      type: "error" as const,
      title: `${incorrectCount} blank${incorrectCount > 1 ? "s" : ""} incorrect`,
      message: question.errorMessage || "Review your answers and try again."
    };
  };

  const infoBoxProps = getInfoBoxProps();

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6">
        <QuizContent markdown={question.content} />
      </div>

      <CodeWithBlanks
        codeLines={question.codeLines}
        blanks={question.blanks}
        values={values}
        onChange={handleBlankChange}
        showLineNumbers={question.showLineNumbers !== false}
        disabled={submitted}
        results={submitted ? results : undefined}
      />

      {infoBoxProps && <InfoBox type={infoBoxProps.type} title={infoBoxProps.title} message={infoBoxProps.message} />}

      <SubmitButton
        onClick={submitted ? handleNext : handleSubmit}
        disabled={!submitted && !allBlanksHaveValues}
        variant={submitted ? "next" : "submit"}
      />
    </div>
  );
}
