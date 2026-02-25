"use server";

import { getContentLoader } from "@/lib/content/loaders";
import type { ConceptMeta, ConceptAncestor } from "@/types/concepts";

export async function getConcepts(locale: string = "en"): Promise<ConceptMeta[]> {
  const loader = await getContentLoader();
  return loader.getAllConceptMeta(locale);
}

export async function getConcept(slug: string, locale: string = "en"): Promise<ConceptMeta | null> {
  const all = await getConcepts(locale);
  return all.find((c) => c.slug === slug) ?? null;
}

export async function searchConcepts(query: string, locale: string = "en"): Promise<ConceptMeta[]> {
  const all = await getConcepts(locale);
  const q = query.toLowerCase().trim();
  if (!q) {
    return all;
  }
  return all.filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
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
  const concept = await getConcept(slug, locale);
  if (!concept?.parentSlug) {
    return [];
  }
  const siblings = await getChildren(concept.parentSlug, locale);
  return siblings.filter((c) => c.slug !== slug);
}

export async function getConceptContent(slug: string, locale: string = "en"): Promise<string> {
  const loader = await getContentLoader();
  return loader.getConceptContent(slug, locale);
}
