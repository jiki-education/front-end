"use client";

import { useState } from "react";
import { playSound } from "@/lib/sound";
import { QuizContent } from "./QuizContent";
import { QuizOption, type QuizOptionState } from "./QuizOption";
import { QuizFeedback } from "./QuizFeedback";

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
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6">
        <QuizContent markdown={question.content} />
      </div>

      <div className="space-y-3 mb-6">
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
        className="w-full mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {submitted ? "Next Question" : "Submit"}
      </button>
    </div>
  );
}
