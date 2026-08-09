import { getContentMeta } from "./contentMeta";
import type { ProjectMeta } from "./types";

/**
 * Get all project metadata for a locale, sorted by `order`.
 * No English fallback: a locale with no projects returns an empty list (never
 * silently shows English).
 */
export async function getAllProjects(locale: string): Promise<ProjectMeta[]> {
  const projects = (await getContentMeta(locale)).projects;
  return [...projects].sort((a, b) => a.order - b.order);
}
