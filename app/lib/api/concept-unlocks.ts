import { api } from "./client";

interface UnlockedConceptsResponse {
  unlocked_slugs: string[];
}

/**
 * Fetch which concepts the current user has unlocked.
 * Returns empty array for unauthenticated users or on error.
 */
export async function fetchUnlockedConceptSlugs(): Promise<string[]> {
  try {
    const response = await api.get<UnlockedConceptsResponse>("/internal/concepts/unlocked");
    return response.data.unlocked_slugs;
  } catch {
    return [];
  }
}
