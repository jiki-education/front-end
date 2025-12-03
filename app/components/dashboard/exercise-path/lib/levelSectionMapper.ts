import type { LevelWithProgress } from "@/types/levels";
import { type Exercise, generateMockExercises } from "../../lib/mockData";

export interface LevelSection {
  levelSlug: string;
  levelTitle: string;
  lessons: Exercise[];
  isLocked: boolean;
  milestoneStatus: "not_ready" | "ready_for_completion" | "completed";
  completedLessonsCount: number;
  xpEarned: number;
}

function formatTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function mapLevelToSection(
  level: LevelWithProgress,
  levelIndex: number,
  levels: LevelWithProgress[],
  baseY: number
): LevelSection {
  const levelTitle = formatTitle(level.slug);

  const lessons: Exercise[] = level.lessons.map((lesson, lessonIndex) => {
    const userLesson = level.userProgress?.user_lessons.find((ul) => ul.lesson_slug === lesson.slug);
    const isCompleted = userLesson?.status === "completed";

    // Locking logic based on progression rules
    let isLocked = false;

    if (levelIndex === 0 && lessonIndex === 0) {
      // Rule 1: First lesson ever - always unlocked
      isLocked = false;
    } else if (lessonIndex === 0) {
      // Rule 3: First lesson of a level - unlocked only if previous level is completed
      const prevLevel = levels[levelIndex - 1];
      isLocked = prevLevel.status !== "completed";
    } else {
      // Rule 2: Subsequent lessons within a level - unlocked only if previous lesson is completed
      const prevLessonProgress = level.userProgress?.user_lessons.find(
        (ul) => ul.lesson_slug === level.lessons[lessonIndex - 1].slug
      );
      isLocked = prevLessonProgress?.status !== "completed";
    }

    const title = formatTitle(lesson.slug);

    // Calculate position with zigzag pattern
    const xOffset = lessonIndex % 2 === 0 ? -50 : 50;
    const zigzag = Math.sin(lessonIndex * 0.8) * 30;

    return {
      id: `${level.slug}-${lesson.slug}`,
      title,
      type: lesson.type === "video" ? "video" : "coding",
      completed: isCompleted || false,
      locked: isLocked,
      description: lesson.type === "video" ? "Video lesson" : "Interactive exercise",
      estimatedTime: lesson.type === "video" ? 15 : 10,
      difficulty: levelIndex < 2 ? "easy" : levelIndex < 4 ? "medium" : "hard",
      xpReward: 10 + (levelIndex >= 2 ? 5 : 0) + (levelIndex >= 4 ? 5 : 0),
      route: `/lesson/${lesson.slug}`,
      position: {
        x: xOffset + zigzag,
        y: baseY + lessonIndex * 120
      }
    };
  });

  // Calculate milestone status
  const completedLessonsCount = lessons.filter((l) => l.completed).length;
  const allLessonsCompleted = completedLessonsCount === lessons.length;
  const isLevelCompleted = level.userProgress?.completed_at != null;

  // Level is locked if its first lesson is locked
  const isLevelLocked = lessons.length > 0 ? lessons[0].locked : false;

  let milestoneStatus: "not_ready" | "ready_for_completion" | "completed" = "not_ready";
  if (isLevelCompleted) {
    milestoneStatus = "completed";
  } else if (allLessonsCompleted && !isLevelLocked) {
    milestoneStatus = "ready_for_completion";
  }

  const xpEarned = lessons.reduce((total, lesson) => total + (lesson.completed ? lesson.xpReward : 0), 0);

  return {
    levelSlug: level.slug,
    levelTitle,
    lessons,
    isLocked: isLevelLocked,
    milestoneStatus,
    completedLessonsCount,
    xpEarned
  };
}

export function mapLevelsToSections(levels: LevelWithProgress[]): LevelSection[] {
  if (levels.length === 0) {
    const mockExercises = generateMockExercises();
    const completedLessonsCount = mockExercises.filter((e) => e.completed).length;
    return [
      {
        levelSlug: "mock",
        levelTitle: "Mock Exercises",
        lessons: mockExercises,
        isLocked: false,
        milestoneStatus: completedLessonsCount === mockExercises.length ? "ready_for_completion" : "not_ready",
        completedLessonsCount,
        xpEarned: mockExercises.reduce((total, lesson) => total + (lesson.completed ? lesson.xpReward : 0), 0)
      }
    ];
  }

  const sections: LevelSection[] = [];
  let yPosition = 100;

  levels.forEach((level, levelIndex) => {
    const section = mapLevelToSection(level, levelIndex, levels, yPosition);
    sections.push(section);

    // Update y position for next level (account for header + lessons + potential milestone button)
    const milestoneButtonSpace = section.milestoneStatus === "ready_for_completion" ? 100 : 0;
    yPosition += 80 + section.lessons.length * 120 + milestoneButtonSpace;
  });

  return sections;
}
