import type { LessonSlug } from "@jiki/curriculum";
import type { LessonSummary, LessonType } from "./lesson";

// Re-export for convenience
export type { LessonSummary, LessonType };

export interface LessonWithProgress {
  slug: LessonSlug;
  type: LessonType;
  status: "not_started" | "started" | "completed" | "locked";
  walkthrough_video_watched_percentage: number;
  // Every bonus task passed at some point. Only exercises can earn this.
  bonus_completed: boolean;
}

export interface UserLesson {
  lesson_slug: LessonSlug;
  status: "not_started" | "started" | "completed";
  walkthrough_video_watched_percentage: number;
  bonus_completed: boolean;
}

// Level types
export interface Level {
  slug: string;
  lessons: LessonSummary[];
}

export interface UserLevel {
  level_slug: string;
  status: "started" | "completed";
  user_lessons: UserLesson[];
}

// API Response types
export interface LevelsResponse {
  levels: Level[];
}

export interface UserLevelsResponse {
  user_levels: UserLevel[];
}

// Combined type for UI
export interface LevelWithProgress {
  slug: string;
  status: "not_started" | "started" | "completed" | "ready_for_completion";
  lessons: LessonWithProgress[];
}
