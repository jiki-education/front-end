import contentMeta from "@/lib/generated/content-meta-server.json";
import type { ProjectMeta } from "./types";

/**
 * Get all project metadata for a locale, sorted by `order`.
 * Falls back to English if the requested locale has no projects.
 */
export function getAllProjects(locale: string): ProjectMeta[] {
  const meta = contentMeta as {
    projects?: { [locale: string]: ProjectMeta[] | undefined };
  };
  const byLocale = meta.projects ?? {};
  const projects = byLocale[locale] ?? byLocale["en"] ?? [];
  return [...projects].sort((a, b) => a.order - b.order);
}
