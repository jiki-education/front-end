import type { Metadata } from "next";
import { fetchConcept } from "@/lib/api/concepts";

export async function getConceptMetadata(slug: string): Promise<Metadata> {
  try {
    const concept = await fetchConcept(slug, "external");
    return {
      title: concept.title,
      description: concept.description
    };
  } catch {
    return { title: "Concept Not Found" };
  }
}
