import { getContentMeta } from "./contentMeta";
import type { ProjectMeta } from "./types";

/**
 * Get all project metadata for a locale, sorted by `order`.
 *
 * A project the locale has no copy for is not in this list. See
 * `assembleProjects` in contentMeta.ts: there is no English fallback, because a
 * locale is complete before it is served.
 */
export async function getAllProjects(locale: string): Promise<ProjectMeta[]> {
  const projects = (await getContentMeta(locale)).projects;
  return [...projects].sort((a, b) => a.order - b.order);
}
