import type { Metadata } from "next";
import { getConcept } from "@/lib/concepts/actions";

export async function getConceptMetadata(slug: string): Promise<Metadata> {
  try {
    const concept = await getConcept(slug);
    if (!concept) {
      return { title: "Concept Not Found" };
    }
    return {
      title: concept.title,
      description: concept.description
    };
  } catch {
    return { title: "Concept Not Found" };
  }
}
