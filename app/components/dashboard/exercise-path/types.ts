import type { Lesson } from "@/types/lesson";

// Display wrapper for dashboard lesson rendering
export interface LessonDisplayData {
  lesson: Lesson;
  completed: boolean;
  locked: boolean;
  route: string;
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
