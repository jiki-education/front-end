import type { VideoSource } from "@/types/lesson";

export interface ConceptMeta {
  slug: string;
  title: string;
  description: string;
  parentSlug: string | null;
  order: number;
  category: boolean;
  childrenCount: number;
  exerciseSlugs: string[];
  video_data?: VideoSource[] | null;
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
