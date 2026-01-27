import { articles } from "./generated";
import type { ProcessedArticle } from "./generated/types";

/**
 * Get a single article by slug and locale
 * Falls back to English if the requested locale doesn't exist
 *
 * @throws Error if the article doesn't exist at all
 */
export async function getArticle(slug: string, locale: string): Promise<ProcessedArticle> {
  const articleLoader = articles[slug as keyof typeof articles];
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime safety for invalid slugs
  if (!articleLoader) {
    throw new Error(`Article not found: ${slug}`);
  }

  const articleModule = await articleLoader();

  // Use requested locale if available, otherwise fall back to English
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime safety for unsupported locales
  const localeLoader = articleModule.locales[locale as keyof typeof articleModule.locales] || articleModule.locales.en;

  const localeModule = await localeLoader();
  return localeModule.post;
}
