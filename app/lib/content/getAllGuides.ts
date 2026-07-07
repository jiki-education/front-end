import contentMeta from "@/lib/generated/content-meta-server.json";
import type { GuideMeta } from "./types";

/**
 * Get all guides metadata for a specific locale
 * Falls back to English for locales that don't exist
 * Returns guides sorted alphabetically by title
 *
 * NOTE: this includes premium guides. Callers rendering public/unauthenticated
 * views must filter them out (or gate them) themselves.
 */
export function getAllGuides(locale: string): GuideMeta[] {
  const meta = contentMeta as { guides: { [locale: string]: GuideMeta[] | undefined } };
  const guides = meta.guides[locale] ?? meta.guides["en"] ?? [];
  return [...guides].sort((a, b) => a.title.localeCompare(b.title));
}
