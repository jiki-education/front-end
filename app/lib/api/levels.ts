import type { Level, LevelWithProgress, LevelsResponse, UserLevel, UserLevelsResponse } from "@/types/levels";
import { api } from "./client";

export async function fetchLevels(): Promise<Level[]> {
  const response = await api.get<LevelsResponse>("/levels");
  return response.data.levels;
}

export async function fetchUserLevels(): Promise<UserLevel[]> {
  const response = await api.get<UserLevelsResponse>("/user_levels");
  return response.data.user_levels;
}

export async function fetchLevelsWithProgress(): Promise<LevelWithProgress[]> {
  const [levels, userLevels] = await Promise.all([fetchLevels(), fetchUserLevels()]);

  // Create a map of user progress by level slug
  const userLevelMap = new Map(userLevels.map((ul) => [ul.level_slug, ul]));

  return levels.map((level) => {
    const userProgress = userLevelMap.get(level.slug);

    // Determine overall level status based on lesson progress
    let status: "not_started" | "started" | "completed" = "not_started";
    if (userProgress) {
      const completedCount = userProgress.user_lessons.filter((l) => l.status === "completed").length;
      const startedCount = userProgress.user_lessons.filter((l) => l.status === "started").length;

      if (completedCount === level.lessons.length) {
        status = "completed";
      } else if (completedCount > 0 || startedCount > 0) {
        status = "started";
      }
    }

    return {
      ...level,
      userProgress,
      status
    };
  });
}
