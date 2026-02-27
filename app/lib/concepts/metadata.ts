import type { Metadata } from "next";
import conceptMetaServer from "@/lib/generated/concept-meta-server.json";

interface ConceptMetaEntry {
  slug: string;
  title: string;
  description: string;
}

const concepts = conceptMetaServer as ConceptMetaEntry[];

export function getConceptMetadata(slug: string): Metadata {
  const concept = concepts.find((c) => c.slug === slug);
  if (!concept) {
    return { title: "Concept Not Found" };
  }
  return {
    title: concept.title,
    description: concept.description
  };
}
