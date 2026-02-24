import { api } from "./client";

interface ProfileStreakData {
  streaks_enabled: true;
  current_streak: number;
}

interface ProfileActiveDaysData {
  streaks_enabled: false;
  total_active_days: number;
}

export type ProfileData = {
  avatar_url: string;
  icon: string;
} & (ProfileStreakData | ProfileActiveDaysData);

export interface ProfileResponse {
  profile: ProfileData;
}

export async function fetchProfile(): Promise<ProfileResponse> {
  const response = await api.get<ProfileResponse>("/internal/profile");
  return response.data;
}

export async function uploadAvatar(file: Blob): Promise<ProfileResponse> {
  const formData = new FormData();
  formData.append("avatar", file);
  const response = await api.upload<ProfileResponse>("/internal/profile/avatar", "PUT", formData);
  return response.data;
}

export async function deleteAvatar(): Promise<ProfileResponse> {
  const response = await api.delete<ProfileResponse>("/internal/profile/avatar", undefined, false);
  return response.data;
}
