import type { Lesson, LessonType, VideoSource } from "./lesson";

// Re-export for convenience
export type { Lesson, LessonType };

export interface LessonWithProgress {
  slug: string;
  type: LessonType;
  description: string;
  status: "not_started" | "started" | "completed";
  walkthrough_video_data: VideoSource[] | null;
  walkthrough_video_watched_percentage: number;
}

export interface UserLesson {
  lesson_slug: string;
  status: "not_started" | "started" | "completed";
  walkthrough_video_watched_percentage: number;
}

// Level types
export interface Level {
  slug: string;
  lessons: Lesson[];
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
