import { api } from "./client";
import { conceptIndexHashes } from "@/lib/generated/concept-hashes";
import { assetsUrl } from "@/lib/assets";
import { conceptIndexPath, conceptContentPath } from "@/lib/assets-paths";
import {
  selectTopLevelConcepts,
  selectConcept,
  selectChildren,
  selectAncestors,
  selectRelatedConcepts
} from "@/lib/concepts/select";
import type { ConceptMeta, ConceptAncestor, ExerciseInfo } from "@/types/concepts";
import type { VideoSource } from "@/types/lesson";

// Promise-level cache to deduplicate concurrent requests for the same locale
let cachedPromise: Promise<ConceptMeta[]> | null = null;
let cachedLocale: string | null = null;

async function fetchAllConcepts(locale: string = "en"): Promise<ConceptMeta[]> {
  if (cachedPromise && cachedLocale === locale) {
    return cachedPromise;
  }

  // No English fallback: a locale with no concept index resolves to an empty
  // list rather than silently serving English concepts.
  const hash = conceptIndexHashes[locale];
  if (!hash) {
    return [];
  }

  cachedLocale = locale;
  cachedPromise = fetch(assetsUrl(conceptIndexPath(locale, hash))).then((res) => {
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
  return selectConcept(await fetchAllConcepts(locale), slug);
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
  return selectTopLevelConcepts(await fetchAllConcepts(locale));
}

export async function getChildren(parentSlug: string, locale: string = "en"): Promise<ConceptMeta[]> {
  return selectChildren(await fetchAllConcepts(locale), parentSlug);
}

export async function getAncestors(slug: string, locale: string = "en"): Promise<ConceptAncestor[]> {
  return selectAncestors(await fetchAllConcepts(locale), slug);
}

export async function getRelatedConcepts(slug: string, locale: string = "en"): Promise<ConceptMeta[]> {
  return selectRelatedConcepts(await fetchAllConcepts(locale), slug);
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
  const res = await fetch(assetsUrl(conceptContentPath(slug, locale, concept.contentHash)));
  if (!res.ok) {
    throw new Error("Failed to fetch concept content");
  }
  return res.text();
}

export async function fetchConceptVideoData(slug: string): Promise<VideoSource[] | null> {
  try {
    const response = await api.get<{ concept: { video_data: VideoSource[] | null } }>(`/external/concepts/${slug}`);
    return response.data.concept.video_data;
  } catch {
    return null;
  }
}
