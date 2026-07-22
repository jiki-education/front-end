import { notFound } from "next/navigation";
import EpisodePage from "@/components/projects/EpisodePage";
import SidebarLayout from "@/components/layout/SidebarLayout";
import JsonLd from "@/components/seo/JsonLd";
import { getAllGuides, getProject, getProjectEpisode } from "@/lib/content";
import { breadcrumbSchema, videoObjectSchema } from "@/lib/seo/schemas";
import { staticAsset } from "@/lib/static-asset";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string; slug: string; episodeSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, episodeSlug } = await params;
  try {
    const episode = await getProjectEpisode(slug, episodeSlug, locale);
    return {
      title: `${episode.title} - Jiki`,
      description: episode.seo.description
    };
  } catch {
    return {};
  }
}

export default async function LocaleEpisodePage({ params }: Props) {
  const { locale, slug, episodeSlug } = await params;

  let project;
  let episode;
  try {
    ({ project } = await getProject(slug, locale));
    episode = await getProjectEpisode(slug, episodeSlug, locale);
  } catch {
    notFound();
  }

  const allGuides = getAllGuides(locale);
  const guides = episode.guides
    .map((guideSlug) => allGuides.find((g) => g.slug === guideSlug))
    .filter((g) => g !== undefined);

  // Structured data: a VideoObject for Google's video index (this is the schema
  // that surfaces episodes in the Search Console Video report), plus a breadcrumb
  // trail Build > <project> > <episode>.
  const episodePath = `/projects/${slug}/episodes/${episodeSlug}`;
  const jsonLd = [
    videoObjectSchema({
      path: episodePath,
      locale,
      name: episode.title,
      description: episode.seo.description || episode.excerpt,
      uploadDate: episode.date,
      durationSeconds: episode.durationSeconds,
      provider: episode.videoProvider,
      videoKey: episode.videoKey,
      thumbnailUrl: episode.image ? staticAsset(`images/projects/episodes/${episode.image}`) : undefined,
      isAccessibleForFree: !episode.premium
    }),
    breadcrumbSchema(
      [
        { name: "Build", path: "/build" },
        { name: project.title, path: `/projects/${slug}` },
        { name: episode.title, path: episodePath }
      ],
      locale
    )
  ];

  return (
    <SidebarLayout activeItem="build">
      <JsonLd data={jsonLd} />
      <EpisodePage project={project} episode={episode} guides={guides} locale={locale} />
    </SidebarLayout>
  );
}
