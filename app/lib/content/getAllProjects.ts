import { getContentMeta } from "./contentMeta";
import type { ProjectMeta } from "./types";

/**
 * Get all project metadata for a locale, sorted by `order`.
 *
 * Projects are one of the two deliberate English fallbacks (see
 * `assembleProjects` in contentMeta.ts): there are three of them and they are
 * the site's headline feature, so a locale whose copy the i18n repo has not
 * published yet renders English rather than a blank hub.
 */
export async function getAllProjects(locale: string): Promise<ProjectMeta[]> {
  const projects = (await getContentMeta(locale)).projects;
  return [...projects].sort((a, b) => a.order - b.order);
}
