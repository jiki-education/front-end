import contentMeta from "@/lib/generated/content-meta-server.json";
import type { ProjectMeta } from "./types";

/**
 * Get all project metadata for a locale, sorted by `order`.
 * No English fallback: a locale with no projects returns an empty list (never
 * silently shows English).
 */
export function getAllProjects(locale: string): ProjectMeta[] {
  const meta = contentMeta as {
    projects?: { [locale: string]: ProjectMeta[] | undefined };
  };
  const byLocale = meta.projects ?? {};
  const projects = byLocale[locale] ?? [];
  return [...projects].sort((a, b) => a.order - b.order);
}
