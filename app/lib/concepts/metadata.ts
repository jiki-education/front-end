import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getConceptServer } from "./server-concepts";

/**
 * Concept SEO metadata, read from the FETCHED per-locale concept index.
 *
 * This used to read `lib/generated/concept-meta-server.json`, a cross-locale
 * blob bundled into the worker. That was a second copy of data the concept index
 * already carries, and being bundled it pinned every concept's title and
 * description to build time, so a locale published later rendered its pages from
 * R2 while their `<title>` came from a file that had never heard of it.
 *
 * There is no English fallback any more, deliberately. Falling back produced an
 * English title over a page whose body was about to 404, which reads as a
 * working page to a crawler.
 */
export async function getConceptMetadata(slug: string, locale: string): Promise<Metadata> {
  const concept = await getConceptServer(slug, locale);
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
