"use client";

import ChooseLanguage from "@/components/choose-language/ChooseLanguage";
import type { Lesson, VideoSource } from "@/types/lesson";
import type { ProgrammingLanguage } from "@/types/course";

type ChooseLanguageLesson = Lesson & {
  type: "choose_language";
  data: {
    sources: VideoSource[];
    language_options: ProgrammingLanguage[];
  };
};

// Mock data for the dev page
const mockLessonData: ChooseLanguageLesson = {
  slug: "choose-language",
  type: "choose_language",
  title: "Choose Your Language",
  description: "Select your programming language",
  data: {
    sources: [
      {
        host: "mux",
        id: "PNbgUkVhy38y7OELdYseo1GAD01XG8FGLJ1nj9BvuKCU"
      }
    ],
    language_options: ["javascript", "python"]
  }
};

export default function ChooseLanguagePage() {
  return <ChooseLanguage lessonData={mockLessonData} />;
}
