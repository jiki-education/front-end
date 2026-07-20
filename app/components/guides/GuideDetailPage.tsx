import { getGuide, getAllGuides, getAllProjects, getProject, getRelatedGuides } from "@/lib/content";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import GuideDetailContent from "./GuideDetailContent";
import type { FeaturedInEpisode } from "./FeaturedInProjects";

interface GuideDetailPageProps {
  slug: string;
  locale: string;
}

// Helper for generateMetadata
export async function getGuideMetadata(slug: string, locale: string = "en"): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "guides.metadata" });
  try {
    const allGuides = getAllGuides(locale);
    const guide = allGuides.find((g) => g.slug === slug);
    if (!guide) {
      return { title: t("notFoundTitle") };
    }

    return {
      title: guide.title,
      description: guide.seo.description,
      keywords: guide.seo.keywords.join(", ")
    };
  } catch {
    return { title: t("notFoundTitle") };
  }
}

/**
 * The project episodes that reference this guide in their `guides` list, in
 * project order then episode order.
 */
async function getFeaturedInEpisodes(guideSlug: string, locale: string): Promise<FeaturedInEpisode[]> {
  const featuredIn: FeaturedInEpisode[] = [];
  for (const projectMeta of getAllProjects(locale)) {
    if (projectMeta.episodeCount === 0) {
      continue;
    }
    const { project, episodes } = await getProject(projectMeta.slug, locale);
    for (const episode of [...episodes].sort((a, b) => a.order - b.order)) {
      if (episode.guides.includes(guideSlug)) {
        featuredIn.push({
          projectSlug: project.slug,
          projectTitle: project.title,
          episodeSlug: episode.slug,
          episodeTitle: episode.title,
          episodeImage: episode.image,
          episodeExcerpt: episode.excerpt
        });
      }
    }
  }
  return featuredIn;
}

export default async function GuideDetailPage({ slug, locale }: GuideDetailPageProps) {
  let guide;
  try {
    guide = await getGuide(slug, locale);
  } catch {
    notFound();
  }

  const allGuides = getAllGuides(locale);
  const relatedGuides = getRelatedGuides(slug, allGuides, 5);
  const featuredInEpisodes = await getFeaturedInEpisodes(slug, locale);

  return (
    <GuideDetailContent
      guide={guide}
      relatedGuides={relatedGuides}
      featuredInEpisodes={featuredInEpisodes}
      locale={locale}
    />
  );
}
