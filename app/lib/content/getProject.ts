import { getContentMeta } from "./contentMeta";
import type { EpisodeMeta, ProjectMeta } from "./types";

export interface ProjectWithEpisodes {
  project: ProjectMeta;
  episodes: EpisodeMeta[];
}

/**
 * Get a single project plus its full episode list (metadata only, no episode
 * HTML body). Episode bodies are loaded on demand by getProjectEpisode.
 *
 * Both halves come out of the one locale metadata read: an episode's structure
 * rides in the locale-invariant artifact and its listing copy in that locale's
 * copy artifact, so there is no per-project index to fetch and no locale to
 * choose. A project shows the episodes THIS locale has, and no others.
 *
 * @throws Error if the project doesn't exist for the given locale.
 */
export async function getProject(projectSlug: string, locale: string): Promise<ProjectWithEpisodes> {
  const { projects, episodes } = await getContentMeta(locale);
  const project = projects.find((p) => p.slug === projectSlug);

  if (!project) {
    throw new Error(`Project not found: ${projectSlug}`);
  }

  return { project, episodes: episodes.filter((e) => e.project === projectSlug) };
}
