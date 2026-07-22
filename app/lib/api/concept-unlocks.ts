import { api } from "./client";
import type { ConceptMeta } from "@/types/concepts";

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

/**
 * Resolve the set of concept slugs the current user may access, expanded so a
 * category counts as unlocked when any descendant is. Logged-out users get an
 * empty set (callers treat everything as unlocked via isUnlocked()).
 */
export async function getUnlockedConceptSet(
  concepts: Array<Pick<ConceptMeta, "slug" | "parentSlug">>,
  isAuthenticated: boolean
): Promise<Set<string>> {
  const slugs = isAuthenticated ? await fetchUnlockedConceptSlugs() : [];
  return expandUnlocked(concepts, slugs);
}

/**
 * Whether a concept is unlocked for the current user. Logged-out users see every
 * concept as unlocked.
 */
export function isUnlocked(unlockedSlugs: Set<string>, slug: string, isAuthenticated: boolean): boolean {
  return !isAuthenticated || unlockedSlugs.has(slug);
}

/**
 * Expand a set of explicitly-unlocked concept slugs to also include the ancestor
 * (parent category) of any unlocked concept.
 *
 * Category concepts have no exercises of their own, so they are never returned
 * directly by the unlock API. A category is considered unlocked when at least one
 * of its descendants is unlocked. The direction is child -> parent only: unlocking
 * a parent never implicitly unlocks its children.
 */
export function expandUnlocked(
  concepts: Array<Pick<ConceptMeta, "slug" | "parentSlug">>,
  unlockedSlugs: Iterable<string>
): Set<string> {
  const result = new Set<string>(unlockedSlugs);
  const bySlug = new Map(concepts.map((c) => [c.slug, c]));
  for (const slug of Array.from(result)) {
    let current = bySlug.get(slug);
    while (current?.parentSlug && !result.has(current.parentSlug)) {
      result.add(current.parentSlug);
      current = bySlug.get(current.parentSlug);
    }
  }
  return result;
}
