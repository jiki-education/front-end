import type { ConceptMeta } from "@/types/concepts";

/** A concept's locale-invariant structure, as published by the front-end. */
export interface ConceptStructure {
  slug: string;
  image: string | null;
  parentSlug: string | null;
  order: number;
  category: boolean;
  childrenCount: number;
  exerciseSlugs: string[];
}

/** A concept's translated copy for one locale, as published by the i18n repo. */
export interface ConceptCopy {
  title: string;
  description: string;
  contentHash: string | null;
}

export type ConceptCopyCatalog = Record<string, ConceptCopy>;

/**
 * Merge the structural half with a locale's copy into the shape the app renders.
 *
 * A concept the locale has no copy for is DROPPED rather than filled in from
 * English. A listing that quietly showed English titles among translated ones
 * would look like a working page, which is the failure this split exists to make
 * impossible; an absence is visible and fixable.
 *
 * Ordering is the structure's, because order is a property of the curriculum
 * rather than of any translation of it.
 */
export function assembleConcepts(structure: ConceptStructure[], copy: ConceptCopyCatalog): ConceptMeta[] {
  return structure
    .filter((entry) => Object.prototype.hasOwnProperty.call(copy, entry.slug))
    .map((entry) => ({ ...entry, ...copy[entry.slug] }))
    .sort((a, b) => a.order - b.order);
}
