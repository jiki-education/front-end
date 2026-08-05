import { api } from "./client";

// Deliberately minimal: the API also sends `name`, `description`, `fun_fact` and
// `num_awardees`. The front end owns badge display copy (resolved from the app
// catalog via useBadgeContent) and nothing renders the awardee count. Do not
// re-add them — this type is the spec for what the API should eventually send.
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
