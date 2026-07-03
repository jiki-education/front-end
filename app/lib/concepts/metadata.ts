import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import conceptMetaServer from "@/lib/generated/concept-meta-server.json";

interface ConceptMetaEntry {
  slug: string;
  title: string;
  description: string;
  image: string | null;
}

const conceptsByLocale = conceptMetaServer as Record<string, ConceptMetaEntry[] | undefined>;

export async function getConceptMetadata(slug: string, locale: string = "en"): Promise<Metadata> {
  const concepts = conceptsByLocale[locale] ?? conceptsByLocale["en"] ?? [];
  const concept = concepts.find((c) => c.slug === slug);
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
