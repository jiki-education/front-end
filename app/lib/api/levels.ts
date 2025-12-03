import type { Level, LevelWithProgress, LevelsResponse, UserLevel, UserLevelsResponse } from "@/types/levels";
import { api } from "./client";

export async function fetchLevels(): Promise<Level[]> {
  const response = await api.get<LevelsResponse>("/internal/levels");
  return response.data.levels;
}

export async function fetchUserLevels(): Promise<UserLevel[]> {
  const response = await api.get<UserLevelsResponse>("/internal/user_levels");
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

    // Use the backend's completion data instead of calculating manually
    let status: "not_started" | "started" | "completed" = "not_started";
    if (userProgress) {
      // Level is "completed" if the backend says it's completed
      if (userProgress.completed_at != null) {
        status = "completed";
      } else if (userProgress.user_lessons.length > 0) {
        // Level is "started" if there are any lesson records (started or completed)
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
