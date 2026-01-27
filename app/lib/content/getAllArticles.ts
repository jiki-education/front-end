import { articles } from "./generated";
import type { ProcessedArticle } from "./generated/types";

/**
 * Get all articles for a specific locale
 * Falls back to English for articles that don't have the requested locale
 * Returns articles sorted alphabetically by title
 */
export async function getAllArticles(locale: string): Promise<ProcessedArticle[]> {
  const articleLoaders = Object.values(articles);

  const articlesList = await Promise.all(
    articleLoaders.map(async (loader) => {
      const articleModule = await loader();

      // Use requested locale if available, otherwise fall back to English
      const localeLoader =
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime safety for unsupported locales
        articleModule.locales[locale as keyof typeof articleModule.locales] || articleModule.locales.en;

      const localeModule = await localeLoader();
      return localeModule.post;
    })
  );

  return articlesList.sort((a, b) => a.title.localeCompare(b.title));
}
