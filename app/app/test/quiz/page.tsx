"use client";

import { useState } from "react";
import { QuizCard } from "@/components/quiz-card/QuizCard";
import { CodingQuizCard } from "@/components/quiz-card/CodingQuizCard";
import { FillInQuizCard } from "@/components/quiz-card/FillInQuizCard";
import { mockQuizQuestions } from "@/components/quiz-card/mockData";
import { mockCodingQuizQuestions } from "@/components/quiz-card/mockCodingData";
import { mockFillInQuizQuestions } from "@/components/quiz-card/mockFillInData";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { LessonQuitButton } from "@/components/lesson/LessonQuitButton";

export default function QuizTestPage() {
  const [quizType, setQuizType] = useState<"multiple-choice" | "coding" | "fill-in">("multiple-choice");
  const [mcIndex, setMcIndex] = useState(0);
  const [codingIndex, setCodingIndex] = useState(0);
  const [fillInIndex, setFillInIndex] = useState(0);

  const handleNextMC = () => {
    setMcIndex((prev) => (prev < mockQuizQuestions.length - 1 ? prev + 1 : 0));
  };

  const handleNextCoding = () => {
    setCodingIndex((prev) => (prev < mockCodingQuizQuestions.length - 1 ? prev + 1 : 0));
  };

  const handleNextFillIn = () => {
    setFillInIndex((prev) => (prev < mockFillInQuizQuestions.length - 1 ? prev + 1 : 0));
  };

  const currentMCQuestion = mockQuizQuestions[mcIndex];
  const currentCodingQuestion = mockCodingQuizQuestions[codingIndex];
  const currentFillInQuestion = mockFillInQuizQuestions[fillInIndex];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 relative">
      <LessonQuitButton />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Quiz Test Page</h1>

          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="flex gap-4">
              <button
                onClick={() => setQuizType("multiple-choice")}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  quizType === "multiple-choice"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Multiple Choice
              </button>
              <button
                onClick={() => setQuizType("coding")}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  quizType === "coding"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Coding Quiz
              </button>
              <button
                onClick={() => setQuizType("fill-in")}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  quizType === "fill-in"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Fill in the Blanks
              </button>
            </div>
            <SoundToggle />
          </div>

          <p className="text-gray-600">
            {quizType === "multiple-choice" &&
              `Multiple Choice: Question ${mcIndex + 1} of ${mockQuizQuestions.length}`}
            {quizType === "coding" && `Coding: Question ${codingIndex + 1} of ${mockCodingQuizQuestions.length}`}
            {quizType === "fill-in" &&
              `Fill in the Blanks: Question ${fillInIndex + 1} of ${mockFillInQuizQuestions.length}`}
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            {quizType === "multiple-choice" && <QuizCard question={currentMCQuestion} onNext={handleNextMC} />}
            {quizType === "coding" && <CodingQuizCard question={currentCodingQuestion} onNext={handleNextCoding} />}
            {quizType === "fill-in" && <FillInQuizCard question={currentFillInQuestion} onNext={handleNextFillIn} />}
          </div>
        </div>
      </div>
    </div>
  );
}
