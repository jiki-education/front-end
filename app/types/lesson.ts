import type { ExerciseSlug } from "@jiki/curriculum";
import type { ProgrammingLanguage } from "./course";

// Shared video source type
export interface VideoSource {
  host: string;
  id: string;
  language?: ProgrammingLanguage;
}

// Lesson type alias
export type LessonType = "exercise" | "video" | "quiz" | "choose_language";

// Base Lesson (lightweight - from levels API, dashboard, listings)
export interface Lesson {
  slug: string;
  title: string;
  description?: string;
  type: LessonType;
}

// LessonWithData extends Lesson with type-specific data block
export type LessonWithData = Lesson &
  (
    | { type: "video"; data: { sources: VideoSource[] } }
    | { type: "exercise"; data: { slug: ExerciseSlug } }
    | { type: "quiz"; data?: Record<string, unknown> }
    | { type: "choose_language"; data: { language_options: ProgrammingLanguage[] } }
  );
