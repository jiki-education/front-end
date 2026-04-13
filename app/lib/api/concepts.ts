import { api } from "./client";
import { conceptIndexHashes } from "@/lib/generated/concept-hashes";
import type { ConceptMeta, ConceptAncestor, ExerciseInfo } from "@/types/concepts";
import type { VideoSource } from "@/types/lesson";

// Promise-level cache to deduplicate concurrent requests for the same locale
let cachedPromise: Promise<ConceptMeta[]> | null = null;
let cachedLocale: string | null = null;

async function fetchAllConcepts(locale: string = "en"): Promise<ConceptMeta[]> {
  if (cachedPromise && cachedLocale === locale) {
    return cachedPromise;
  }

  const hash = conceptIndexHashes[locale] || conceptIndexHashes["en"];
  const effectiveLocale = conceptIndexHashes[locale] ? locale : "en";

  cachedLocale = locale;
  cachedPromise = fetch(`/static/concepts/${effectiveLocale}-${hash}.json`).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch concepts");
    }
    return res.json();
  });
  return cachedPromise;
}

export async function getConcepts(locale: string = "en"): Promise<ConceptMeta[]> {
  return fetchAllConcepts(locale);
}

export async function getConcept(slug: string, locale: string = "en"): Promise<ConceptMeta | null> {
  const all = await fetchAllConcepts(locale);
  return all.find((c) => c.slug === slug) ?? null;
}

export async function searchConcepts(
  query: string,
  parentSlug?: string | null,
  locale: string = "en"
): Promise<ConceptMeta[]> {
  let pool = await fetchAllConcepts(locale);
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
  const all = await fetchAllConcepts(locale);
  const slugSet = new Set(slugs);
  return all.filter((c) => slugSet.has(c.slug));
}

export async function getTopLevelConcepts(locale: string = "en"): Promise<ConceptMeta[]> {
  const all = await fetchAllConcepts(locale);
  return all.filter((c) => c.parentSlug === null).sort((a, b) => a.order - b.order);
}

export async function getChildren(parentSlug: string, locale: string = "en"): Promise<ConceptMeta[]> {
  const all = await fetchAllConcepts(locale);
  return all.filter((c) => c.parentSlug === parentSlug).sort((a, b) => a.order - b.order);
}

export async function getAncestors(slug: string, locale: string = "en"): Promise<ConceptAncestor[]> {
  const all = await fetchAllConcepts(locale);
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
  const all = await fetchAllConcepts(locale);
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

  // Deduplicate and exclude self and categories

  const seen = new Set<string>([slug]);
  return related
    .filter((c) => {
      if (seen.has(c.slug)) {
        return false;
      }
      seen.add(c.slug);
      return true;
    })
    .filter((c) => !c.category)
    .slice(0, 6);
}

export async function getExercisesForConcept(slug: string, locale: string = "en"): Promise<ExerciseInfo[]> {
  const concept = await getConcept(slug, locale);
  if (!concept || concept.exerciseSlugs.length === 0) {
    return [];
  }
  const { getExerciseMetaBySlugs } = await import("@/lib/api/exercise-meta");
  const metas = await getExerciseMetaBySlugs(concept.exerciseSlugs, locale);
  return metas.map((m) => ({ slug: m.slug, title: m.title }));
}

export async function getConceptContent(slug: string, locale: string = "en"): Promise<string> {
  const concept = await getConcept(slug, locale);
  if (!concept?.contentHash) {
    return "";
  }
  const res = await fetch(`/static/concepts/${slug}/${locale}-${concept.contentHash}.html`);
  if (!res.ok) {
    throw new Error("Failed to fetch concept content");
  }
  return res.text();
}

export async function fetchConceptVideoData(slug: string): Promise<VideoSource[] | null> {
  try {
    const response = await api.get<{ video_data: VideoSource[] | null }>(`/external/concepts/${slug}`);
    return response.data.video_data;
  } catch {
    return null;
  }
}
