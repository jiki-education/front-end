import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import conceptMetaServer from "@/lib/generated/concept-meta-server.json";

export interface ConceptMetaEntry {
  slug: string;
  title: string;
  description: string;
  image: string | null;
}

const conceptsByLocale = conceptMetaServer as Record<string, ConceptMetaEntry[] | undefined>;

/** The concept metadata entry for a slug in the given locale (falls back to en). */
export function getConceptEntry(slug: string, locale: string = "en"): ConceptMetaEntry | undefined {
  const concepts = conceptsByLocale[locale] ?? conceptsByLocale["en"] ?? [];
  return concepts.find((c) => c.slug === slug);
}

export async function getConceptMetadata(slug: string, locale: string = "en"): Promise<Metadata> {
  const concept = getConceptEntry(slug, locale);
  if (!concept) {
    const t = await getTranslations("seo.concepts");
    return { title: t("notFound") };
  }
  return {
    title: concept.title,
    description: concept.description,
    ...(concept.image ? { openGraph: { images: [{ url: concept.image }] } } : {})
  };
}
