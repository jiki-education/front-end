"use client";

import ChooseLanguage from "@/components/choose-language/ChooseLanguage";
import type { Lesson, VideoSource } from "@/types/lesson";
import type { ProgrammingLanguage } from "@/types/course";

type ChooseLanguageLesson = Lesson & {
  type: "choose_language";
  data: {
    language_options: ProgrammingLanguage[];
  };
};

// Mock data for the dev page
const mockLessonData: ChooseLanguageLesson = {
  slug: "welcome-to-coding-fundamentals",
  type: "choose_language",
  data: {
    language_options: ["javascript", "python"]
  }
};

const mockVideo: VideoSource = {
  provider: "mux",
  id: "PNbgUkVhy38y7OELdYseo1GAD01XG8FGLJ1nj9BvuKCU",
  durationSeconds: 120,
  uploadDate: "2026-01-01"
};

export default function ChooseLanguagePage() {
  return <ChooseLanguage lessonData={mockLessonData} video={mockVideo} onReady={() => {}} />;
}
