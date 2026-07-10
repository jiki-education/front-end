import { notFound } from "next/navigation";
import EpisodePage from "@/components/projects/EpisodePage";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { getAllGuides, getProject, getProjectEpisode } from "@/lib/content";
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

  return (
    <SidebarLayout activeItem="build">
      <EpisodePage project={project} episode={episode} guides={guides} locale={locale} />
    </SidebarLayout>
  );
}
