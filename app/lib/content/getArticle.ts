import { fetchStaticContent } from "./fetchStaticContent";
import { getAllArticles } from "./getAllArticles";
import { contentBodyPath } from "@/lib/assets-paths";
import type { ProcessedArticle } from "./types";

/**
 * Get a single article by slug and locale (metadata + rendered content).
 * No English fallback — the article must exist for the requested locale.
 *
 * @throws Error if the article doesn't exist at all
 */
export async function getArticle(slug: string, locale: string): Promise<ProcessedArticle> {
  const allArticles = getAllArticles(locale);
  const meta = allArticles.find((a) => a.slug === slug);

  if (!meta) {
    throw new Error(`Article not found: ${slug}`);
  }

  const content = await fetchStaticContent(contentBodyPath("articles", slug, meta.locale, meta.contentHash));
  return { ...meta, content };
}
