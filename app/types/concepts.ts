export interface ConceptMeta {
  slug: string;
  title: string;
  description: string;
  parentSlug: string | null;
  order: number;
  childrenCount: number;
  exerciseSlugs: string[];
}

export interface ConceptForDisplay extends ConceptMeta {
  isUnlocked: boolean;
}

export interface ConceptAncestor {
  slug: string;
  title: string;
}
