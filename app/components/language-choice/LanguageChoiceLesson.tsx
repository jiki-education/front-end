"use client";

import { setLanguageChoice } from "@/lib/api/courses";
import { markLessonComplete } from "@/lib/api/lessons";
import type { ProgrammingLanguage } from "@/types/course";
import type { Lesson } from "@/types/lesson";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ChooseLanguageLesson = Lesson & {
  type: "choose_language";
  data: { language_options: ProgrammingLanguage[] };
};

interface LanguageChoiceLessonProps {
  lessonData: ChooseLanguageLesson;
}

export default function LanguageChoiceLesson({ lessonData }: LanguageChoiceLessonProps) {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedLanguage || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Two-step process: set language first, then mark lesson complete
      // If language call fails, lesson won't be marked complete
      await setLanguageChoice(selectedLanguage);
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
    <div>
      <h1>{lessonData.title}</h1>
      <p>Choose your programming language:</p>

      <div>
        {lessonData.data.language_options.map((lang) => (
          <label key={lang}>
            <input
              type="radio"
              name="language"
              value={lang}
              checked={selectedLanguage === lang}
              onChange={() => setSelectedLanguage(lang)}
              disabled={isSubmitting}
            />
            {lang}
          </label>
        ))}
      </div>

      <button onClick={handleSubmit} disabled={!selectedLanguage || isSubmitting}>
        {isSubmitting ? "Saving..." : "Continue"}
      </button>
    </div>
  );
}
