import { fetchStaticContent } from "./fetchStaticContent";
import { getBuildSeries } from "./getBuildSeries";
import type { ProcessedBuildEpisode } from "./types";

/**
 * Get a single build episode (metadata + rendered HTML body).
 *
 * @throws Error if the series or episode doesn't exist.
 */
export async function getBuildEpisode(
  seriesSlug: string,
  episodeSlug: string,
  locale: string
): Promise<ProcessedBuildEpisode> {
  const { episodes } = await getBuildSeries(seriesSlug, locale);
  const meta = episodes.find((e) => e.slug === episodeSlug);

  if (!meta) {
    throw new Error(`Build episode not found: ${seriesSlug}/${episodeSlug}`);
  }

  const content = await fetchStaticContent(
    `/static/content/build/${seriesSlug}/${meta.uuid}/${meta.locale}-${meta.contentHash}.html`
  );
  return { ...meta, content };
}
