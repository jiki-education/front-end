import type { VideoSource } from "@/types/lesson";

export interface ConceptMeta {
  slug: string;
  title: string;
  description: string;
  /** Fingerprinted icon URL, or null when the concept has none. Doubles as the OG image. */
  image: string | null;
  parentSlug: string | null;
  order: number;
  category: boolean;
  childrenCount: number;
  exerciseSlugs: string[];
  contentHash: string | null;
  // The recap video to play, resolved for this locale at build time. Null for a
  // concept with no video of its own.
  video: VideoSource | null;
}

export interface ConceptForDisplay extends ConceptMeta {
  isUnlocked: boolean;
}

export interface ConceptAncestor {
  slug: string;
  title: string;
}

export interface ExerciseInfo {
  slug: string;
  title: string;
}

export interface ChallengeInfo {
  slug: string;
  title: string;
}
