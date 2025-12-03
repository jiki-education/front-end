// Lesson types
export interface Lesson {
  slug: string;
  type: "exercise" | "video";
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
export interface LevelWithProgress extends Level {
  userProgress?: UserLevel;
  status?: "not_started" | "started" | "completed";
  milestoneStatus?: "not_ready" | "ready_for_completion" | "completed";
}
