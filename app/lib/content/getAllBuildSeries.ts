import contentMeta from "@/lib/generated/content-meta-server.json";
import type { BuildSeriesMeta } from "./types";

/**
 * Get all build series metadata for a locale, sorted by `order`.
 * Falls back to English if the requested locale has no series.
 */
export function getAllBuildSeries(locale: string): BuildSeriesMeta[] {
  const meta = contentMeta as {
    build?: { series?: { [locale: string]: BuildSeriesMeta[] | undefined } };
  };
  const byLocale = meta.build?.series ?? {};
  const series = byLocale[locale] ?? byLocale["en"] ?? [];
  return [...series].sort((a, b) => a.order - b.order);
}
