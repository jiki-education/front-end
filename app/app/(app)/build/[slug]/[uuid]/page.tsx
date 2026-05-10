import { notFound } from "next/navigation";
import BuildEpisodeVideo from "@/components/build-episode/BuildEpisodeVideo";
import { getBuildEpisode } from "@/lib/content";

interface PageProps {
  params: Promise<{ slug: string; uuid: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, uuid } = await params;
  try {
    const episode = await getBuildEpisode(slug, uuid, "en");
    return {
      title: `${episode.title} - Jiki`,
      description: episode.excerpt
    };
  } catch {
    return {};
  }
}

export default async function BuildEpisodePage({ params }: PageProps) {
  const { slug, uuid } = await params;

  let episode;
  try {
    episode = await getBuildEpisode(slug, uuid, "en");
  } catch {
    notFound();
  }

  return (
    <BuildEpisodeVideo
      uuid={uuid}
      seriesSlug={slug}
      videoProvider={episode.videoProvider}
      videoKey={episode.videoKey}
    />
  );
}
