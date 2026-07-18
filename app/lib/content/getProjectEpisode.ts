import { fetchStaticContent } from "./fetchStaticContent";
import { getProject } from "./getProject";
import { projectEpisodeContentPath } from "@/lib/assets-paths";
import type { ProcessedEpisode } from "./types";

/**
 * Get a single project episode (metadata + rendered HTML transcript).
 *
 * @throws Error if the project or episode doesn't exist.
 */
export async function getProjectEpisode(
  projectSlug: string,
  episodeSlug: string,
  locale: string
): Promise<ProcessedEpisode> {
  const { episodes } = await getProject(projectSlug, locale);
  const meta = episodes.find((e) => e.slug === episodeSlug);

  if (!meta) {
    throw new Error(`Project episode not found: ${projectSlug}/${episodeSlug}`);
  }

  const content = await fetchStaticContent(
    projectEpisodeContentPath(projectSlug, meta.uuid, meta.locale, meta.contentHash)
  );
  return { ...meta, content };
}
