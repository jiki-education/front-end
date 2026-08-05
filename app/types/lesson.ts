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
//
// Deliberately minimal: the API also sends `title` and `description`, but the
// front end owns display copy and resolves it from the curriculum copy catalog
// by slug (lib/api/curriculum-copy.ts). Do not re-add them here — this type is
// the spec for what the API should eventually send.
export interface Lesson {
  slug: string;
  type: LessonType;
  walkthrough_video_data: VideoSource[] | null;
}

// LessonWithData extends Lesson with type-specific data block.
//
// Exercise lessons carry no data block: the API's `data.slug` is always equal to
// the lesson's own slug, so the exercise is identified by `lesson.slug`.
export type LessonWithData = Lesson &
  (
    | { type: "video"; data: { sources: VideoSource[] } }
    | { type: "exercise" }
    | { type: "quiz" }
    | { type: "choose_language"; data: { sources: VideoSource[]; language_options: ProgrammingLanguage[] } }
  );
