import type { ConceptMeta, ConceptAncestor } from "@/types/concepts";

/**
 * Pure selectors over a concept index. Shared by the client API
 * (lib/api/concepts.ts) and the server loader (lib/concepts/server-concepts.ts)
 * so the two only differ in how they fetch the index, not in how they read it.
 */

export function selectTopLevelConcepts(all: ConceptMeta[]): ConceptMeta[] {
  return all.filter((c) => c.parentSlug === null).sort((a, b) => a.order - b.order);
}

export function selectConcept(all: ConceptMeta[], slug: string): ConceptMeta | null {
  return all.find((c) => c.slug === slug) ?? null;
}

export function selectChildren(all: ConceptMeta[], parentSlug: string): ConceptMeta[] {
  return all.filter((c) => c.parentSlug === parentSlug).sort((a, b) => a.order - b.order);
}

export function selectRelatedConcepts(all: ConceptMeta[], slug: string): ConceptMeta[] {
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

export function selectAncestors(all: ConceptMeta[], slug: string): ConceptAncestor[] {
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
