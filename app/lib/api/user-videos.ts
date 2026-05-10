import { api } from "./client";

export type UserVideoStatus = "started" | "completed";

export interface UserVideoData {
  uuid: string;
  watched_percentage: number;
  status: UserVideoStatus;
  completed_at: string | null;
}

export async function fetchUserVideos(): Promise<UserVideoData[]> {
  try {
    const response = await api.get<{ user_videos: UserVideoData[] }>(`/internal/user_videos`);
    return response.data.user_videos;
  } catch {
    return [];
  }
}

export async function fetchUserVideo(uuid: string): Promise<UserVideoData | null> {
  try {
    const response = await api.get<{ user_video: UserVideoData }>(`/internal/user_videos/${uuid}`);
    return response.data.user_video;
  } catch {
    return null;
  }
}

export async function updateUserVideoPercentage(uuid: string, percentage: number): Promise<void> {
  await api.patch(`/internal/user_videos/${uuid}`, { watched_percentage: Math.round(percentage) }, undefined, false);
}
