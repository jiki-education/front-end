import type { ExerciseLessonSlug, LessonSlug, VideoLessonSlug } from "@jiki/curriculum";
import type { ProgrammingLanguage } from "./course";

// Video source type (used across lessons, walkthroughs, concepts). Every source
// carries duration + upload date (enforced by the video catalog generator) so the
// front-end can emit schema.org VideoObject JSON-LD.
//
// This is one already-resolved video, not a set to pick from: the catalog holds
// each video's per-locale recordings and `scripts/lib/videos.js` resolves them at
// build time, so a locale's payload carries exactly the source it plays.
export interface VideoSource {
  provider: "youtube" | "mux";
  id: string;
  durationSeconds: number;
  uploadDate: string;
}

export type LessonType = "exercise" | "video" | "quiz" | "choose_language";

// What every lesson carries, whatever its type.
//
// This is only what the front end reads; the API's payload is wider. Neither
// display copy nor videos are part of it — titles, descriptions and the video to
// play all come from the curriculum copy catalog (lib/api/curriculum-copy.ts),
// keyed by the slug.
interface LessonFields {
  slug: LessonSlug;
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
}

export interface QuizLesson extends LessonFields {
  type: "quiz";
}

export interface ChooseLanguageLesson extends LessonFields {
  type: "choose_language";
  data: { language_options: ProgrammingLanguage[] };
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
