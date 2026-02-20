import type { Lesson, LessonType, VideoData } from "./lesson";

// Re-export for convenience
export type { Lesson, LessonType };

export interface LessonWithProgress {
  slug: string;
  type: LessonType;
  status: "not_started" | "started" | "completed";
  walkthrough_video_data: VideoData[] | null;
}

export interface UserLesson {
  lesson_slug: string;
  status: "not_started" | "started" | "completed";
}

// Level types
export interface Level {
  slug: string;
  lessons: Lesson[];
}

export interface UserLevel {
  level_slug: string;
  user_lessons: UserLesson[];
  completed_at?: string;
  current?: boolean;
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
