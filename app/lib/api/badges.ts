import { api } from "./client";

export interface BadgeData {
  id: number;
  name: string;
  slug: string;
  description: string;
  fun_fact: string;
  state: "locked" | "unrevealed" | "revealed";
  num_awardees: number;
  unlocked_at?: string;
}

export interface BadgesResponse {
  badges: BadgeData[];
  num_locked_secret_badges: number;
}

export interface RevealBadgeResponse {
  badge: {
    id: number;
    name: string;
    slug: string;
    description: string;
    revealed: boolean;
    unlocked_at: string;
  };
}

/**
 * Fetch all badges for the current user
 * Returns both earned and unearned badges that are visible to the user
 */
export async function fetchBadges(): Promise<BadgesResponse> {
  const response = await api.get<BadgesResponse>("/internal/badges");
  return response.data;
}

/**
 * Reveal an unrevealed badge for the user
 * This triggers the "ceremony" moment for newly earned badges
 */
export async function revealBadge(badgeId: number): Promise<RevealBadgeResponse> {
  const response = await api.patch<RevealBadgeResponse>(`/internal/badges/${badgeId}/reveal`);
  return response.data;
}
