import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getExerciseMetaServer } from "@/lib/api/exercise-meta-server";

/**
 * Public exercise page SEO metadata, read from the fetched per-locale prose
 * index — the same artifact the page body renders from, so a locale published
 * after this build gets its own title rather than an English one over a 404.
 */
export async function getExerciseMetadata(slug: string, locale: string): Promise<Metadata> {
  const exercise = await getExerciseMetaServer(slug, locale);
  if (!exercise) {
    const t = await getTranslations("seo.exercises");
    return { title: t("notFound") };
  }
  return {
    title: exercise.title,
    description: exercise.description
  };
}
