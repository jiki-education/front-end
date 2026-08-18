import type { ConceptMeta } from "@/types/concepts";
import { videoFor, type VideoIndex } from "@/lib/videos/select";

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

/**
 * A concept's translated copy for one locale, as published by the i18n repo.
 *
 * It carries no video, and that absence is the design. This is the artifact the
 * i18n repo republishes for every non-English locale, and it builds each entry
 * as a closed literal, so a video folded in here would be present in English and
 * silently gone in every other locale. Videos come from the front-end-owned
 * index instead. The same reasoning keeps code hashes out of the exercise prose
 * index; see `lib/api/exercise-meta.ts`.
 */
export interface ConceptCopy {
  title: string;
  description: string;
  contentHash: string | null;
}

export type ConceptCopyCatalog = Record<string, ConceptCopy>;

/**
 * Merge the structural half with a locale's copy into the shape the app renders,
 * attaching each concept's recap video from that locale's video index.
 *
 * A concept the locale has no copy for is DROPPED rather than filled in from
 * English. A listing that quietly showed English titles among translated ones
 * would look like a working page, which is the failure this split exists to make
 * impossible; an absence is visible and fixable.
 *
 * A missing VIDEO is not that failure and is not dropped: a concept that names
 * no video simply has none, and the page renders without one.
 *
 * Ordering is the structure's, because order is a property of the curriculum
 * rather than of any translation of it.
 */
export function assembleConcepts(
  structure: ConceptStructure[],
  copy: ConceptCopyCatalog,
  videos: VideoIndex
): ConceptMeta[] {
  return structure
    .filter((entry) => Object.prototype.hasOwnProperty.call(copy, entry.slug))
    .map((entry) => ({ ...entry, ...copy[entry.slug], video: videoFor(videos, entry.slug) }))
    .sort((a, b) => a.order - b.order);
}
