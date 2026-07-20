import { fetchStaticContent } from "./fetchStaticContent";
import { getAllProjects } from "./getAllProjects";
import { projectEpisodesIndexPath } from "@/lib/assets-paths";
import type { EpisodeMeta, ProjectMeta } from "./types";

export interface ProjectWithEpisodes {
  project: ProjectMeta;
  episodes: EpisodeMeta[];
}

/**
 * Get a single project plus its full episode list (metadata only — no episode
 * HTML body). Episode bodies are loaded on demand by getProjectEpisode.
 *
 * @throws Error if the project doesn't exist for the given locale.
 */
export async function getProject(projectSlug: string, locale: string): Promise<ProjectWithEpisodes> {
  const allProjects = getAllProjects(locale);
  const project = allProjects.find((p) => p.slug === projectSlug);

  if (!project) {
    throw new Error(`Project not found: ${projectSlug}`);
  }

  const url = projectEpisodesIndexPath(project.slug, project.locale, project.episodesIndexHash);
  const json = await fetchStaticContent(url);
  const episodes = JSON.parse(json) as EpisodeMeta[];

  return { project, episodes };
}
