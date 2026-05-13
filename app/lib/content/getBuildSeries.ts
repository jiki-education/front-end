import { fetchStaticContent } from "./fetchStaticContent";
import { getAllBuildSeries } from "./getAllBuildSeries";
import type { BuildEpisodeMeta, BuildSeriesMeta } from "./types";

export interface BuildSeriesWithEpisodes {
  series: BuildSeriesMeta;
  episodes: BuildEpisodeMeta[];
}

/**
 * Get a single build series plus its full episode list (metadata only — no
 * episode HTML body). Episode bodies are loaded on demand by getBuildEpisode.
 *
 * @throws Error if the series doesn't exist for the given locale.
 */
export async function getBuildSeries(seriesSlug: string, locale: string): Promise<BuildSeriesWithEpisodes> {
  const allSeries = getAllBuildSeries(locale);
  const series = allSeries.find((s) => s.slug === seriesSlug);

  if (!series) {
    throw new Error(`Build series not found: ${seriesSlug}`);
  }

  const url = `/static/content/build/${series.slug}/episodes-${series.locale}-${series.episodesIndexHash}.json`;
  const json = await fetchStaticContent(url);
  const episodes = JSON.parse(json) as BuildEpisodeMeta[];

  return { series, episodes };
}
