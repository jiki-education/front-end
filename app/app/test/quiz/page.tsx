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
import styles from "./page.module.css";

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
    <div className={styles.page}>
      <LessonQuitButton />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Quiz Test Page</h1>

          <div className={styles.typeRow}>
            <div className={styles.typeButtons}>
              <button
                onClick={() => setQuizType("multiple-choice")}
                className={styles.typeButton}
                data-active={quizType === "multiple-choice"}
              >
                Multiple Choice
              </button>
              <button
                onClick={() => setQuizType("coding")}
                className={styles.typeButton}
                data-active={quizType === "coding"}
              >
                Coding Quiz
              </button>
              <button
                onClick={() => setQuizType("fill-in")}
                className={styles.typeButton}
                data-active={quizType === "fill-in"}
              >
                Fill in the Blanks
              </button>
            </div>
            <SoundToggle />
          </div>

          <p className={styles.counter} data-testid="quiz-counter">
            {quizType === "multiple-choice" &&
              `Multiple Choice: Question ${mcIndex + 1} of ${mockQuizQuestions.length}`}
            {quizType === "coding" && `Coding: Question ${codingIndex + 1} of ${mockCodingQuizQuestions.length}`}
            {quizType === "fill-in" &&
              `Fill in the Blanks: Question ${fillInIndex + 1} of ${mockFillInQuizQuestions.length}`}
          </p>
        </div>

        <div className={styles.cardRow}>
          <div className={styles.cardWrap}>
            {quizType === "multiple-choice" && <QuizCard question={currentMCQuestion} onNext={handleNextMC} />}
            {quizType === "coding" && <CodingQuizCard question={currentCodingQuestion} onNext={handleNextCoding} />}
            {quizType === "fill-in" && <FillInQuizCard question={currentFillInQuestion} onNext={handleNextFillIn} />}
          </div>
        </div>
      </div>
    </div>
  );
}
