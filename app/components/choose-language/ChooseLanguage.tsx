"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LessonQuitButton } from "@/components/lesson/LessonQuitButton";
import { setLanguageChoice } from "@/lib/api/courses";
import { markLessonComplete } from "@/lib/api/lessons";
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
  const router = useRouter();
  const [step, setStep] = useState<Step>("video");
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasVisitedSelector, setHasVisitedSelector] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleConfirmChoice = async () => {
    if (!selectedLanguage || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Resolve "random" to an actual language
      const languageToSet: ProgrammingLanguage =
        selectedLanguage === "random"
          ? lessonData.data.language_options[Math.floor(Math.random() * lessonData.data.language_options.length)]
          : selectedLanguage;

      await setLanguageChoice(languageToSet);
      const response = await markLessonComplete(lessonData.slug);

      const unlockedEvent = response?.meta?.events?.find((e: { type: string }) => e.type === "lesson_unlocked");
      const unlockedLessonSlug = unlockedEvent?.data?.lesson_slug;

      if (unlockedLessonSlug) {
        router.push(`/dashboard?completed=${lessonData.slug}&unlocked=${unlockedLessonSlug}`);
      } else {
        router.push(`/dashboard?completed=${lessonData.slug}`);
      }
    } catch (error) {
      console.error("Failed to save language choice:", error);
    } finally {
      setIsSubmitting(false);
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
        isSubmitting={isSubmitting}
        onBackToVideo={handleBackToVideo}
        onSelectLanguage={handleProceedToSelector}
        onConfirmChoice={handleConfirmChoice}
      />
    </div>
  );
}
