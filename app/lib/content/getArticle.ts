import { fetchStaticContent } from "./fetchStaticContent";
import { getAllArticles } from "./getAllArticles";
import type { ProcessedArticle } from "./types";

/**
 * Get a single article by slug and locale (metadata + rendered content)
 * Falls back to English if the requested locale doesn't exist
 *
 * @throws Error if the article doesn't exist at all
 */
export async function getArticle(slug: string, locale: string): Promise<ProcessedArticle> {
  const allArticles = getAllArticles(locale);
  const meta = allArticles.find((a) => a.slug === slug);

  if (!meta) {
    throw new Error(`Article not found: ${slug}`);
  }

  const content = await fetchStaticContent(`/static/content/articles/${slug}/${meta.locale}-${meta.contentHash}.html`);
  return { ...meta, content };
}
