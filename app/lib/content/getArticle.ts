import { getContentLoader } from "./loaders";
import type { ProcessedArticle } from "./types";

/**
 * Get a single article by slug and locale (metadata + rendered content)
 * Falls back to English if the requested locale doesn't exist
 *
 * @throws Error if the article doesn't exist at all
 */
export async function getArticle(slug: string, locale: string): Promise<ProcessedArticle> {
  const loader = await getContentLoader();
  const allMeta = await loader.getAllArticleMeta(locale);
  const meta = allMeta.find((a) => a.slug === slug);

  if (!meta) {
    throw new Error(`Article not found: ${slug}`);
  }

  const content = await loader.getArticleContent(slug, locale);
  return { ...meta, content };
}
