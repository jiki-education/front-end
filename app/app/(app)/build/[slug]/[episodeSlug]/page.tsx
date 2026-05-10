import { notFound } from "next/navigation";
import BuildEpisodeVideo from "@/components/build-episode/BuildEpisodeVideo";
import { getBuildEpisode } from "@/lib/content";

interface PageProps {
  params: Promise<{ slug: string; episodeSlug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, episodeSlug } = await params;
  try {
    const episode = await getBuildEpisode(slug, episodeSlug, "en");
    return {
      title: `${episode.title} - Jiki`,
      description: episode.excerpt
    };
  } catch {
    return {};
  }
}

export default async function BuildEpisodePage({ params }: PageProps) {
  const { slug, episodeSlug } = await params;

  let episode;
  try {
    episode = await getBuildEpisode(slug, episodeSlug, "en");
  } catch {
    notFound();
  }

  return (
    <BuildEpisodeVideo
      uuid={episode.uuid}
      seriesSlug={slug}
      videoProvider={episode.videoProvider}
      videoKey={episode.videoKey}
    />
  );
}
