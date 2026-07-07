import { fetchStaticContent } from "./fetchStaticContent";
import { getAllGuides } from "./getAllGuides";
import type { ProcessedGuide } from "./types";

/**
 * Get a single guide by slug and locale (metadata + rendered content)
 * Falls back to English if the requested locale doesn't exist
 *
 * NOTE: returns premium guides too (the body is still fetched). Premium gating
 * is applied by the detail page based on the viewer's membership.
 *
 * @throws Error if the guide doesn't exist at all
 */
export async function getGuide(slug: string, locale: string): Promise<ProcessedGuide> {
  const allGuides = getAllGuides(locale);
  const meta = allGuides.find((g) => g.slug === slug);

  if (!meta) {
    throw new Error(`Guide not found: ${slug}`);
  }

  const content = await fetchStaticContent(`/static/content/guides/${slug}/${meta.locale}-${meta.contentHash}.html`);
  return { ...meta, content };
}
