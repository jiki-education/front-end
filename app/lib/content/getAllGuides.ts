import { getContentMeta } from "./contentMeta";
import type { GuideMeta } from "./types";

/**
 * Get all guides metadata for a specific locale.
 * No English fallback: a locale with no guides returns an empty list (never
 * silently shows English). Returns guides sorted by their config `order`
 * (ascending), then alphabetically by title.
 *
 * NOTE: this includes premium guides. Callers rendering public/unauthenticated
 * views must filter them out (or gate them) themselves.
 */
export async function getAllGuides(locale: string): Promise<GuideMeta[]> {
  const guides = (await getContentMeta(locale)).guides;
  return [...guides].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}
