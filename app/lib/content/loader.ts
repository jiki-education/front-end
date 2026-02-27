/**
 * Content Loader
 *
 * Provides utility functions for content that span both blog posts and articles.
 * Reads from the bundled content-meta-server.json generated at build time.
 */

import contentMeta from "@/lib/generated/content-meta-server.json";

interface ContentMetaServer {
  locales: { [type: string]: string[] | undefined };
  slugsWithLocales: { [type: string]: Array<{ slug: string; locale: string }> | undefined };
}

const meta = contentMeta as ContentMetaServer;

/**
 * Get all post slugs with their available locales
 * Optionally filtered by supported locales
 */
export function getAllPostSlugsWithLocales(
  type: "blog" | "articles",
  supportedLocales?: readonly string[]
): Array<{ slug: string; locale: string }> {
  const all = meta.slugsWithLocales[type] || [];

  if (supportedLocales) {
    return all.filter((entry) => supportedLocales.includes(entry.locale));
  }
  return all;
}

/**
 * Get all available locales for a content type
 * Optionally filtered by supported locales
 */
export function getAvailableLocales(type: "blog" | "articles", supportedLocales?: readonly string[]): string[] {
  const locales = meta.locales[type] || [];

  if (supportedLocales) {
    return locales.filter((l) => supportedLocales.includes(l));
  }
  return locales;
}
