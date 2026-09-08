import type { LessonSummary, VideoSource } from "@/types/lesson";

// Display wrapper for dashboard lesson rendering.
//
// `title`/`description` are curriculum copy resolved during the dashboard's load
// phase (see useLevels) rather than fields the API supplies — the API type
// deliberately has neither.
export interface LessonDisplayData {
  lesson: LessonSummary & { title: string; description: string };
  // The recorded walkthrough solve, if this exercise has one.
  deepDiveVideo?: VideoSource;
  completed: boolean;
  locked: boolean;
  route: string;
  deepDiveVideoWatchedPercentage: number;
  // Whether the exercise has a bonus task (from the compiled manifest) and
  // whether the student has passed it (from the API). Non-exercises have neither.
  hasBonus: boolean;
  bonusCompleted: boolean;
}

// Simple types for the level section component
export interface LevelSectionData {
  levelSlug: string;
  levelTitle: string;
  levelIndex: number;
  lessons: LessonDisplayData[];
  isLocked: boolean;
  status: "not_started" | "started" | "completed";
  completedLessonsCount: number;
  xpEarned: number;
}
