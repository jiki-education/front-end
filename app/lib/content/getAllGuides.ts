import contentMeta from "@/lib/generated/content-meta-server.json";
import type { GuideMeta } from "./types";

/**
 * Get all guides metadata for a specific locale
 * No English fallback: a locale with no guides returns an empty list (never
 * silently shows English). Returns guides sorted by their config `order`
 * (ascending), then alphabetically by title.
 *
 * NOTE: this includes premium guides. Callers rendering public/unauthenticated
 * views must filter them out (or gate them) themselves.
 */
export function getAllGuides(locale: string): GuideMeta[] {
  const meta = contentMeta as { guides: { [locale: string]: GuideMeta[] | undefined } };
  const guides = meta.guides[locale] ?? [];
  return [...guides].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}
