"use client";

import { useState } from "react";
import { LessonQuitButton } from "@/components/lesson/LessonQuitButton";
import type { Lesson, VideoSource } from "@/types/lesson";
import type { ProgrammingLanguage } from "@/types/course";
import { VideoStep } from "./ui/VideoStep";
import { LanguageSelectorStep } from "./ui/LanguageSelectorStep";
import { ButtonRow } from "./ui/ButtonRow";
import { ProgressBar } from "./ui/ProgressBar";
import styles from "./ChooseLanguage.module.css";

type ChooseLanguageLesson = Lesson & {
  type: "choose_language";
  data: {
    sources: VideoSource[];
    language_options: ProgrammingLanguage[];
  };
};

type Step = "video" | "selector";
type LanguageOption = ProgrammingLanguage | "random";

interface ChooseLanguageProps {
  lessonData: ChooseLanguageLesson;
}

export default function ChooseLanguage({ lessonData }: ChooseLanguageProps) {
  const [step, setStep] = useState<Step>("video");
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasVisitedSelector, setHasVisitedSelector] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption | null>(null);

  const handleReady = () => {
    setIsInitializing(false);
  };

  const handleProceedToSelector = () => {
    setStep("selector");
    setHasVisitedSelector(true);
  };

  const handleBackToVideo = () => {
    setStep("video");
  };

  const handleLanguageSelect = (language: LanguageOption) => {
    setSelectedLanguage(language);
  };

  const handleConfirmChoice = () => {
    if (selectedLanguage) {
      // TODO: Call API to set language
      console.debug("Confirmed language:", selectedLanguage);
    }
  };

  return (
    <div
      className={`${styles.container} ${styles.gridBackground} ${isInitializing ? styles.initializing : styles.visible}`}
    >
      <LessonQuitButton className={styles.closeButton} variant="default" />

      <ProgressBar step={step} />

      {step === "video" && (
        <VideoStep
          lessonData={lessonData}
          onReady={handleReady}
          onProceedToSelector={handleProceedToSelector}
          hasVisitedSelector={hasVisitedSelector}
        />
      )}

      {step === "selector" && (
        <LanguageSelectorStep
          languageOptions={lessonData.data.language_options}
          selectedLanguage={selectedLanguage}
          onLanguageSelect={handleLanguageSelect}
        />
      )}

      <ButtonRow
        step={step}
        hasVisitedSelector={hasVisitedSelector}
        selectedLanguage={selectedLanguage}
        onBackToVideo={handleBackToVideo}
        onSelectLanguage={handleProceedToSelector}
        onConfirmChoice={handleConfirmChoice}
      />
    </div>
  );
}
