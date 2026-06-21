import { cache } from "react";
import { conceptIndexHashes } from "@/lib/generated/concept-hashes";
import {
  selectTopLevelConcepts,
  selectConcept,
  selectChildren,
  selectAncestors,
  selectRelatedConcepts
} from "@/lib/concepts/select";
import { getExerciseMetaBySlugsServer } from "@/lib/api/exercise-meta-server";
import { originUrl } from "@/lib/server/origin";
import { fetchStaticContent } from "@/lib/content/fetchStaticContent";
import { getApiUrl } from "@/lib/api/config";
import type { ConceptMeta, ConceptAncestor, ExerciseInfo } from "@/types/concepts";
import type { VideoSource } from "@/types/lesson";

/**
 * Server-side concept loading.
 *
 * Fetches the same static index file the client fetches (served from the origin
 * / R2), reconstructing an absolute URL from the request headers since Server
 * Components cannot use relative URLs. Only the tiny hash manifest is bundled —
 * the (potentially large, per-locale) index stays out of the server payload.
 *
 * Wrapped in React's cache() so the several helpers a single page calls share one
 * fetch+parse per request.
 */
const fetchConceptIndex = cache(async (locale: string): Promise<ConceptMeta[]> => {
  const hash = conceptIndexHashes[locale] || conceptIndexHashes["en"];
  const effectiveLocale = conceptIndexHashes[locale] ? locale : "en";

  const url = await originUrl(`/static/concepts/${effectiveLocale}-${hash}.json`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch concepts index: ${url} (${res.status})`);
  }
  return res.json() as Promise<ConceptMeta[]>;
});

/** Top-level concepts for server-rendering the concepts list (logged-out SSR). */
export async function getTopLevelConceptsServer(locale: string = "en"): Promise<ConceptMeta[]> {
  return selectTopLevelConcepts(await fetchConceptIndex(locale));
}

/** Single concept by slug. */
export async function getConceptServer(slug: string, locale: string = "en"): Promise<ConceptMeta | null> {
  return selectConcept(await fetchConceptIndex(locale), slug);
}

/** Ancestor breadcrumb chain for a concept. */
export async function getAncestorsServer(slug: string, locale: string = "en"): Promise<ConceptAncestor[]> {
  return selectAncestors(await fetchConceptIndex(locale), slug);
}

/** Direct children of a category concept. */
export async function getChildrenServer(parentSlug: string, locale: string = "en"): Promise<ConceptMeta[]> {
  return selectChildren(await fetchConceptIndex(locale), parentSlug);
}

/** Related concepts (parent, children, siblings) for a leaf's sidebar. */
export async function getRelatedConceptsServer(slug: string, locale: string = "en"): Promise<ConceptMeta[]> {
  return selectRelatedConcepts(await fetchConceptIndex(locale), slug);
}

/** Rendered body HTML for a leaf concept. Empty string when there is no content. */
export async function getConceptContentServer(slug: string, locale: string = "en"): Promise<string> {
  const concept = await getConceptServer(slug, locale);
  if (!concept?.contentHash) {
    return "";
  }
  return fetchStaticContent(`/static/concepts/${slug}/${locale}-${concept.contentHash}.html`);
}

/** Exercises linked to a concept (slug + title) for the sidebar. */
export async function getExercisesForConceptServer(slug: string, locale: string = "en"): Promise<ExerciseInfo[]> {
  const concept = await getConceptServer(slug, locale);
  if (!concept || concept.exerciseSlugs.length === 0) {
    return [];
  }
  const metas = await getExerciseMetaBySlugsServer(concept.exerciseSlugs, locale);
  return metas.map((m) => ({ slug: m.slug, title: m.title }));
}

/** Video data for a concept from the Rails external API. Null when unavailable. */
export async function getConceptVideoDataServer(slug: string): Promise<VideoSource[] | null> {
  try {
    const res = await fetch(getApiUrl(`/external/concepts/${slug}`));
    if (!res.ok) {
      return null;
    }
    const data = (await res.json()) as { concept: { video_data: VideoSource[] | null } };
    return data.concept.video_data;
  } catch {
    return null;
  }
}
