import type {
  Level,
  LevelWithProgress,
  LessonWithProgress,
  LevelsResponse,
  UserLevel,
  UserLevelsResponse
} from "@/types/levels";
import { CURRENT_COURSE_SLUG } from "@/lib/constants/course";
import { api } from "./client";

export async function fetchLevels(): Promise<Level[]> {
  const response = await api.get<LevelsResponse>("/internal/levels", {
    params: { course_slug: CURRENT_COURSE_SLUG }
  });
  return response.data.levels;
}

export async function fetchUserLevels(): Promise<UserLevel[]> {
  const response = await api.get<UserLevelsResponse>("/internal/user_levels", {
    params: { course_slug: CURRENT_COURSE_SLUG }
  });
  return response.data.user_levels;
}

export async function completeLevelMilestone(levelSlug: string): Promise<any> {
  const response = await api.patch(`/internal/user_levels/${levelSlug}/complete`);
  return response.data;
}

export async function fetchLevelsWithProgress(): Promise<LevelWithProgress[]> {
  const [levels, userLevels] = await Promise.all([fetchLevels(), fetchUserLevels()]);

  // Create a map of user progress by level slug
  const userLevelMap = new Map(userLevels.map((ul) => [ul.level_slug, ul]));

  return levels.map((level) => {
    const userProgress = userLevelMap.get(level.slug);

    // Create a map of lesson progress for this level
    const lessonProgressMap = new Map(userProgress?.user_lessons.map((ul) => [ul.lesson_slug, ul.status]) || []);

    // Process lessons with their status
    const lessons: LessonWithProgress[] = level.lessons.map((lesson) => ({
      slug: lesson.slug,
      type: lesson.type,
      status: lessonProgressMap.get(lesson.slug) || "not_started"
    }));

    // Calculate level status
    let status: "not_started" | "started" | "completed" | "ready_for_completion" = "not_started";

    if (userProgress?.completed_at != null) {
      status = "completed";
    } else if (userProgress) {
      const completedLessons = lessons.filter((l) => l.status === "completed");
      if (completedLessons.length === lessons.length) {
        status = "ready_for_completion";
      } else if (completedLessons.length > 0 || lessons.some((l) => l.status === "started")) {
        status = "started";
      }
    }

    return {
      slug: level.slug,
      status,
      lessons
    };
  });
}
