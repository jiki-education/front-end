import type { ExerciseSlug } from "@jiki/curriculum";

// Shared video source type
export interface VideoSource {
  host: string;
  id: string;
}

// Lesson type alias
export type LessonType = "exercise" | "video" | "quiz";

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
  );
