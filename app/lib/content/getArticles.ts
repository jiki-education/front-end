import type { ProcessedArticle } from "./generated/types";
import { getAllArticles } from "./getAllArticles";
import { type ArticleTagSlug } from "./types";

const ARTICLES_PAGE_SIZE = 10;

export interface GetArticlesOptions {
  locale?: string;
  tag?: ArticleTagSlug | null;
  page?: number;
}

export interface GetArticlesResult {
  articles: ProcessedArticle[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Get articles with optional tag filtering and pagination
 * Returns only listed articles, sorted alphabetically by title
 */
export async function getArticles(options: GetArticlesOptions = {}): Promise<GetArticlesResult> {
  const { locale = "en", tag = null, page = 1 } = options;

  let filteredArticles = await getListedArticles(locale);

  // Filter by tag if provided
  if (tag) {
    filteredArticles = filteredArticles.filter((article) => article.tags.includes(tag));
  }

  const totalCount = filteredArticles.length;
  const totalPages = Math.ceil(totalCount / ARTICLES_PAGE_SIZE);

  // Paginate
  const start = (page - 1) * ARTICLES_PAGE_SIZE;
  const paginatedArticles = filteredArticles.slice(start, start + ARTICLES_PAGE_SIZE);

  return {
    articles: paginatedArticles,
    totalCount,
    totalPages,
    currentPage: page
  };
}

/**
 * Get all LISTED articles for a specific locale
 * Excludes articles where listed=false
 * Returns articles sorted alphabetically by title
 */
export async function getListedArticles(locale: string): Promise<ProcessedArticle[]> {
  const allArticles = await getAllArticles(locale);
  return allArticles.filter((article) => article.listed);
}
