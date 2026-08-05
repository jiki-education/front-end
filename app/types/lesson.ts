import type { ExerciseLessonSlug, LessonSlug, VideoLessonSlug } from "@jiki/curriculum";
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

export type LessonType = "exercise" | "video" | "quiz" | "choose_language";

// What every lesson carries, whatever its type.
//
// This is only what the front end reads; the API's payload is wider. Display copy
// is not part of it — titles and descriptions come from the curriculum copy
// catalog (lib/api/curriculum-copy.ts), keyed by the slug.
interface LessonFields {
  slug: LessonSlug;
  walkthrough_video_data: VideoSource[] | null;
}

// An exercise lesson needs no data block: its slug is the curriculum exercise to
// load.
export interface ExerciseLesson extends LessonFields {
  type: "exercise";
  slug: ExerciseLessonSlug;
}

export interface VideoLesson extends LessonFields {
  type: "video";
  slug: VideoLessonSlug;
  data: { sources: VideoSource[] };
}

export interface QuizLesson extends LessonFields {
  type: "quiz";
}

export interface ChooseLanguageLesson extends LessonFields {
  type: "choose_language";
  data: { sources: VideoSource[]; language_options: ProgrammingLanguage[] };
}

// A lesson as the single-lesson endpoint returns it. Discriminate on `type` to
// reach the data block and the narrowed slug.
export type Lesson = ExerciseLesson | VideoLesson | QuizLesson | ChooseLanguageLesson;

// A lesson as list endpoints return it. `SerializeLesson` omits the data block
// unless asked (`include_data`), and `SerializeLevels` doesn't ask — so listings
// genuinely cannot reach `data`, and the dashboard must not assume otherwise.
export interface LessonSummary extends LessonFields {
  type: LessonType;
}
