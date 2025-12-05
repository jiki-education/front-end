// Simple types for the level section component
export interface LevelSectionData {
  levelSlug: string;
  levelTitle: string;
  levelIndex: number;
  lessons: LessonData[];
  isLocked: boolean;
  status: "not_started" | "started" | "completed";
  completedLessonsCount: number;
  xpEarned: number;
}

export interface LessonData {
  id: string;
  slug: string;
  title: string;
  type: string;
  completed: boolean;
  locked: boolean;
  description: string;
  route: string;
  position: { x: number; y: number };
}
