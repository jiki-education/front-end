import type { ExerciseSlug } from "@jiki/curriculum";
import type { ProgrammingLanguage } from "./course";

// Video source type (used across lessons, walkthroughs, concepts). Every source
// carries duration + upload date (a documented API contract on the Rails
// HasVideoData concern) so the front-end can emit schema.org VideoObject JSON-LD.
export interface VideoSource {
  provider: "youtube" | "mux";
  id: string;
  durationSeconds: number;
  uploadDate: string;
  language?: ProgrammingLanguage;
}

// Lesson type alias
export type LessonType = "exercise" | "video" | "quiz" | "choose_language";

// Base Lesson (lightweight - from levels API, dashboard, listings)
export interface Lesson {
  slug: string;
  title: string;
  description: string;
  type: LessonType;
  walkthrough_video_data: VideoSource[] | null;
}

// LessonWithData extends Lesson with type-specific data block
export type LessonWithData = Lesson &
  (
    | { type: "video"; data: { sources: VideoSource[] } }
    | { type: "exercise"; data: { slug: ExerciseSlug } }
    | { type: "quiz"; data?: Record<string, unknown> }
    | { type: "choose_language"; data: { sources: VideoSource[]; language_options: ProgrammingLanguage[] } }
  );
