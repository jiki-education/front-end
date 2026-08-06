import { conceptCopyHashes, conceptStructureHash } from "@/lib/generated/concept-hashes";
import { assetsUrl } from "@/lib/assets";
import { conceptStructurePath, conceptCopyPath, conceptIndexPointerPath, conceptContentPath } from "@/lib/assets-paths";
import { assembleConcepts, type ConceptCopyCatalog, type ConceptStructure } from "@/lib/concepts/assemble";
import { createHashResolver } from "@/lib/i18n/catalogPointer";
import {
  selectTopLevelConcepts,
  selectConcept,
  selectChildren,
  selectAncestors,
  selectRelatedConcepts
} from "@/lib/concepts/select";
import type { ConceptMeta, ConceptAncestor, ExerciseInfo } from "@/types/concepts";

// English's hash is compiled in; every other locale's is read at runtime from
// its pointer, so a concept index published by the i18n repo goes live with no
// front-end rebuild. See lib/i18n/catalogPointer.ts.
const resolveHash = createHashResolver({
  label: "concept copy catalog",
  compiledHashes: () => conceptCopyHashes,
  pointerPath: (locale) => conceptIndexPointerPath(locale),
  resolveUrl: assetsUrl
});

// Keyed by locale AND hash, so a republished index is picked up as a new key
// rather than pinned for the isolate's lifetime.
const conceptIndexCache = new Map<string, Promise<ConceptMeta[]>>();

async function fetchAllConcepts(locale: string): Promise<ConceptMeta[]> {
  // No English fallback: a locale with no concept index resolves to an empty
  // list rather than silently serving English concepts.
  let hash: string;
  try {
    hash = await resolveHash(locale);
  } catch {
    return [];
  }

  const key = `${locale}:${hash}`;
  const cached = conceptIndexCache.get(key);
  if (cached !== undefined) {
    return cached;
  }

  // Structure and copy in parallel: two artifacts, one round trip of depth.
  const promise = Promise.all([
    fetch(assetsUrl(conceptStructurePath(conceptStructureHash))).then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch concept structure");
      }
      return res.json() as Promise<ConceptStructure[]>;
    }),
    fetch(assetsUrl(conceptCopyPath(locale, hash))).then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch concept copy");
      }
      return res.json() as Promise<ConceptCopyCatalog>;
    })
  ]).then(([structure, copy]) => assembleConcepts(structure, copy));
  conceptIndexCache.set(key, promise);
  return promise;
}

export async function getConcepts(locale: string): Promise<ConceptMeta[]> {
  return fetchAllConcepts(locale);
}

export async function getConcept(slug: string, locale: string): Promise<ConceptMeta | null> {
  return selectConcept(await fetchAllConcepts(locale), slug);
}

export async function searchConcepts(
  query: string,
  parentSlug: string | null | undefined,
  locale: string
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

export async function getConceptsBySlugs(slugs: string[], locale: string): Promise<ConceptMeta[]> {
  const all = await fetchAllConcepts(locale);
  const slugSet = new Set(slugs);
  return all.filter((c) => slugSet.has(c.slug));
}

export async function getTopLevelConcepts(locale: string): Promise<ConceptMeta[]> {
  return selectTopLevelConcepts(await fetchAllConcepts(locale));
}

export async function getChildren(parentSlug: string, locale: string): Promise<ConceptMeta[]> {
  return selectChildren(await fetchAllConcepts(locale), parentSlug);
}

export async function getAncestors(slug: string, locale: string): Promise<ConceptAncestor[]> {
  return selectAncestors(await fetchAllConcepts(locale), slug);
}

export async function getRelatedConcepts(slug: string, locale: string): Promise<ConceptMeta[]> {
  return selectRelatedConcepts(await fetchAllConcepts(locale), slug);
}

export async function getExercisesForConcept(slug: string, locale: string): Promise<ExerciseInfo[]> {
  const concept = await getConcept(slug, locale);
  if (!concept || concept.exerciseSlugs.length === 0) {
    return [];
  }
  const { getExerciseMetaBySlugs } = await import("@/lib/api/exercise-meta");
  const metas = await getExerciseMetaBySlugs(concept.exerciseSlugs, locale);
  return metas.map((m) => ({ slug: m.slug, title: m.title }));
}

export async function getConceptContent(slug: string, locale: string): Promise<string> {
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
