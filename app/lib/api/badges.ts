import { api } from "./client";

// Identity and per-user state only; the API's payload is wider. A badge's name,
// description and fun fact come from the curriculum badge catalog
// (lib/api/curriculum-copy.ts), keyed by this slug.
export interface BadgeData {
  id: number;
  slug: string;
  state: "locked" | "unrevealed" | "revealed";
  unlocked_at?: string;
}

export interface BadgesResponse {
  badges: BadgeData[];
  num_locked_secret_badges: number;
}

export interface RevealBadgeResponse {
  badge: {
    id: number;
    slug: string;
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
