import { api } from "./client";
import type { UserConversationData } from "./types/conversation";

export type ChallengeStatus = "locked" | "unlocked" | "started" | "completed";

export interface UserChallengeData extends UserConversationData {
  challenge_slug: string;
}

interface UserChallengeResponse {
  user_challenge: UserChallengeData;
}

export interface ChallengeData {
  slug: string;
  title: string;
  description: string;
  status?: ChallengeStatus;
  exercise_slug?: string;
}

export interface ChallengesResponse {
  results: ChallengeData[];
  meta: {
    current_page: number;
    total_count: number;
    total_pages: number;
  };
}

export interface ChallengeSubmissionFile {
  filename: string;
  code: string;
}

/**
 * Fetch all challenges with status for current user
 */
export async function fetchChallenges(params?: {
  title?: string;
  page?: number;
  per?: number;
}): Promise<ChallengesResponse> {
  const response = await api.get<ChallengesResponse>("/internal/challenges", {
    params
  });

  return response.data;
}

/**
 * Fetch individual challenge details by slug
 */
export async function fetchChallenge(slug: string): Promise<ChallengeData> {
  const response = await api.get<{ challenge: ChallengeData }>(`/internal/challenges/${slug}`);
  return response.data.challenge;
}

/**
 * Submit exercise files for a challenge
 */
export async function submitChallengeExercise(slug: string, files: ChallengeSubmissionFile[]): Promise<void> {
  await api.post(`/internal/challenges/${slug}/exercise_submissions`, {
    submission: { files }
  });
}

/**
 * Start tracking a challenge - called when the user opens a challenge.
 * Acts as the lock-enforcement point for the detail route: rejects with a 403
 * (challenge_locked / premium_required) or 404 (challenge_not_found) when the user
 * may not access the challenge.
 */
export async function startChallenge(slug: string): Promise<void> {
  await api.post(`/internal/user_challenges/${slug}/start`);
}

export async function markChallengeComplete(slug: string): Promise<{ meta?: { events?: unknown[] } }> {
  const response = await api.patch<{ meta?: { events?: unknown[] } }>(`/internal/user_challenges/${slug}/complete`);
  return response.data;
}

/**
 * Fetch user challenge data including conversation history.
 * Throws NotFoundError if the user challenge (or underlying challenge) doesn't exist.
 */
export async function fetchUserChallenge(slug: string): Promise<UserChallengeData> {
  const response = await api.get<UserChallengeResponse>(`/internal/user_challenges/${slug}`);
  return response.data.user_challenge;
}
