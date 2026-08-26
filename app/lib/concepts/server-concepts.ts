import { cache } from "react";
import { conceptCopyHashes, conceptStructureHash } from "@/lib/generated/concept-hashes";
import {
  selectTopLevelConcepts,
  selectConcept,
  selectChildren,
  selectAncestors,
  selectRelatedConcepts
} from "@/lib/concepts/select";
import { getExerciseMetaBySlugsServer } from "@/lib/api/exercise-meta-server";
import { assetsUrl } from "@/lib/server/origin";
import { readArtifact, readArtifactJson } from "@/lib/server/artifacts";
import { conceptStructurePath, conceptCopyPath, conceptIndexPointerPath, conceptContentPath } from "@/lib/assets-paths";
import { assembleConcepts, type ConceptCopyCatalog, type ConceptStructure } from "./assemble";
import { getVideoIndexServer } from "@/lib/videos/server-videos";
import { createHashResolver } from "@/lib/i18n/catalogPointer";
import { fetchStaticContent } from "@/lib/content/fetchStaticContent";
import type { ConceptMeta, ConceptAncestor, ExerciseInfo } from "@/types/concepts";

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
// Non-English hashes resolve at runtime from the pointer, exactly as on the
// client, so a locale the i18n repo published after this build still renders.
const resolveHash = createHashResolver({
  label: "concept copy catalog",
  compiledHashes: () => conceptCopyHashes,
  pointerPath: (locale) => conceptIndexPointerPath(locale),
  resolveUrl: assetsUrl,
  readPointer: readArtifactJson
});

const fetchConceptIndex = cache(async (locale: string): Promise<ConceptMeta[]> => {
  // No English fallback: a locale with no concept index resolves to an empty
  // list rather than silently serving English concepts.
  let hash: string;
  try {
    hash = await resolveHash(locale);
  } catch {
    return [];
  }

  // Structure, copy and videos in parallel: three artifacts, one round trip of
  // depth.
  const structurePath = conceptStructurePath(conceptStructureHash);
  const [structureRes, copyRes, videos] = await Promise.all([
    readArtifact(structurePath),
    readArtifact(conceptCopyPath(locale, hash)),
    getVideoIndexServer(locale)
  ]);
  if (!structureRes.ok) {
    throw new Error(`Failed to read concept structure: ${structurePath} (${structureRes.status})`);
  }
  if (!copyRes.ok) {
    return [];
  }
  return assembleConcepts(
    await structureRes.json<ConceptStructure[]>(),
    await copyRes.json<ConceptCopyCatalog>(),
    videos
  );
});

/** Every concept in a locale's index. The sitemap enumerates slugs from this. */
export async function getAllConceptsServer(locale: string): Promise<ConceptMeta[]> {
  return fetchConceptIndex(locale);
}

/** Top-level concepts for server-rendering the concepts list (logged-out SSR). */
export async function getTopLevelConceptsServer(locale: string): Promise<ConceptMeta[]> {
  return selectTopLevelConcepts(await fetchConceptIndex(locale));
}

/** Single concept by slug. */
export async function getConceptServer(slug: string, locale: string): Promise<ConceptMeta | null> {
  return selectConcept(await fetchConceptIndex(locale), slug);
}

/** Ancestor breadcrumb chain for a concept. */
export async function getAncestorsServer(slug: string, locale: string): Promise<ConceptAncestor[]> {
  return selectAncestors(await fetchConceptIndex(locale), slug);
}

/** Direct children of a category concept. */
export async function getChildrenServer(parentSlug: string, locale: string): Promise<ConceptMeta[]> {
  return selectChildren(await fetchConceptIndex(locale), parentSlug);
}

/** Related concepts (parent, children, siblings) for a leaf's sidebar. */
export async function getRelatedConceptsServer(slug: string, locale: string): Promise<ConceptMeta[]> {
  return selectRelatedConcepts(await fetchConceptIndex(locale), slug);
}

/** Rendered body HTML for a leaf concept. Empty string when there is no content. */
export async function getConceptContentServer(slug: string, locale: string): Promise<string> {
  const concept = await getConceptServer(slug, locale);
  if (!concept?.contentHash) {
    return "";
  }
  return fetchStaticContent(conceptContentPath(slug, locale, concept.contentHash));
}

/** Exercises linked to a concept (slug + title) for the sidebar. */
export async function getExercisesForConceptServer(slug: string, locale: string): Promise<ExerciseInfo[]> {
  const concept = await getConceptServer(slug, locale);
  if (!concept || concept.exerciseSlugs.length === 0) {
    return [];
  }
  const metas = await getExerciseMetaBySlugsServer(concept.exerciseSlugs, locale);
  return metas.map((m) => ({ slug: m.slug, title: m.title }));
}
