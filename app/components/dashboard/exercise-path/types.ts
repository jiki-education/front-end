import type { LessonSummary, VideoSource } from "@/types/lesson";

// Display wrapper for dashboard lesson rendering.
//
// `title`/`description` are curriculum copy resolved during the dashboard's load
// phase (see useLevels) rather than fields the API supplies — the API type
// deliberately has neither.
export interface LessonDisplayData {
  lesson: LessonSummary & { title: string; description: string };
  // The recorded walkthrough solve, if this exercise has one.
  walkthroughVideo?: VideoSource;
  completed: boolean;
  locked: boolean;
  route: string;
  walkthroughVideoWatchedPercentage: number;
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
