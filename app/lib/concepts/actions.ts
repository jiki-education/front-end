"use server";

import { getContentLoader } from "@/lib/content/loaders";
import { getExercise } from "@jiki/curriculum";
import type { ConceptMeta, ConceptAncestor, ExerciseInfo } from "@/types/concepts";

export async function getConcepts(locale: string = "en"): Promise<ConceptMeta[]> {
  const loader = await getContentLoader();
  return loader.getAllConceptMeta(locale);
}

export async function getConcept(slug: string, locale: string = "en"): Promise<ConceptMeta | null> {
  const all = await getConcepts(locale);
  return all.find((c) => c.slug === slug) ?? null;
}

export async function searchConcepts(
  query: string,
  parentSlug?: string | null,
  locale: string = "en"
): Promise<ConceptMeta[]> {
  let pool = await getConcepts(locale);
  if (parentSlug !== undefined) {
    pool = pool.filter((c) => c.parentSlug === parentSlug);
  }
  const q = query.toLowerCase().trim();
  if (!q) {
    return pool;
  }
  return pool.filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
}

export async function getConceptsBySlugs(slugs: string[], locale: string = "en"): Promise<ConceptMeta[]> {
  const all = await getConcepts(locale);
  const slugSet = new Set(slugs);
  return all.filter((c) => slugSet.has(c.slug));
}

export async function getTopLevelConcepts(locale: string = "en"): Promise<ConceptMeta[]> {
  const all = await getConcepts(locale);
  return all.filter((c) => c.parentSlug === null).sort((a, b) => a.order - b.order);
}

export async function getChildren(parentSlug: string, locale: string = "en"): Promise<ConceptMeta[]> {
  const all = await getConcepts(locale);
  return all.filter((c) => c.parentSlug === parentSlug).sort((a, b) => a.order - b.order);
}

export async function getAncestors(slug: string, locale: string = "en"): Promise<ConceptAncestor[]> {
  const all = await getConcepts(locale);
  const bySlug = new Map(all.map((c) => [c.slug, c]));
  const ancestors: ConceptAncestor[] = [];
  let current = bySlug.get(slug);
  while (current?.parentSlug) {
    const parent = bySlug.get(current.parentSlug);
    if (!parent) {
      break;
    }
    ancestors.unshift({ slug: parent.slug, title: parent.title });
    current = parent;
  }
  return ancestors;
}

export async function getRelatedConcepts(slug: string, locale: string = "en"): Promise<ConceptMeta[]> {
  const all = await getConcepts(locale);
  const concept = all.find((c) => c.slug === slug);
  if (!concept) {
    return [];
  }

  const related: ConceptMeta[] = [];

  // Parent
  if (concept.parentSlug) {
    const parent = all.find((c) => c.slug === concept.parentSlug);
    if (parent) {
      related.push(parent);
    }
  }

  // Children
  related.push(...all.filter((c) => c.parentSlug === slug).sort((a, b) => a.order - b.order));

  // Siblings
  if (concept.parentSlug) {
    related.push(
      ...all.filter((c) => c.parentSlug === concept.parentSlug && c.slug !== slug).sort((a, b) => a.order - b.order)
    );
  }

  // Deduplicate and exclude self
  const seen = new Set<string>([slug]);
  return related
    .filter((c) => {
      if (seen.has(c.slug)) {
        return false;
      }
      seen.add(c.slug);
      return true;
    })
    .slice(0, 6);
}

export async function getExercisesForConcept(slug: string, locale: string = "en"): Promise<ExerciseInfo[]> {
  const concept = await getConcept(slug, locale);
  if (!concept || concept.exerciseSlugs.length === 0) {
    return [];
  }

  const results = await Promise.all(
    concept.exerciseSlugs.map(async (exSlug) => {
      const exercise = await getExercise(exSlug);
      if (!exercise) {
        return null;
      }
      return { slug: exSlug, title: exercise.title };
    })
  );
  return results.filter((r): r is ExerciseInfo => r !== null);
}

export async function getConceptContent(slug: string, locale: string = "en"): Promise<string> {
  const loader = await getContentLoader();
  return loader.getConceptContent(slug, locale);
}
