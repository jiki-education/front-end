"use client";

import LanguageChoiceLesson from "@/components/language-choice/LanguageChoiceLesson";
import type { Lesson } from "@/types/lesson";
import type { ProgrammingLanguage } from "@/types/course";

type ChooseLanguageLesson = Lesson & {
  type: "choose_language";
  data: { language_options: ProgrammingLanguage[] };
};

const mockLessonData: ChooseLanguageLesson = {
  slug: "choose-your-language",
  title: "Choose Your Programming Language",
  type: "choose_language",
  data: {
    language_options: ["javascript", "python"]
  }
};

export default function LanguageChoiceDevPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Language Choice Lesson - Dev Test</h1>
      <div className="border rounded-lg p-4">
        <LanguageChoiceLesson lessonData={mockLessonData} />
      </div>
    </div>
  );
}
