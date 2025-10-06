"use client";

import { useState } from "react";
import { playSound } from "@/lib/sound";
import { QuizContent } from "./QuizContent";
import { CodeInput } from "./CodeInput";
import { InfoBox } from "./InfoBox";
import { SubmitButton } from "./SubmitButton";

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
        title: "Excellent!",
        message: question.successMessage || "Your code is correct!"
      };
    }

    return {
      type: "error" as const,
      title: "Not quite right",
      message: question.errorMessage || question.hint || "Check your syntax and try again."
    };
  };

  const infoBoxProps = getInfoBoxProps();

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6">
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
