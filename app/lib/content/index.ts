/**
 * Content API
 *
 * Public interface for loading blog posts and articles from generated content.
 */

// Article loaders
export { getArticle } from "./getArticle";
export { getAllArticles } from "./getAllArticles";
export { getArticles, getListedArticles } from "./getArticles";
export type { GetArticlesOptions, GetArticlesResult } from "./getArticles";

// Blog post loaders
export { getBlogPost } from "./getBlogPost";
export { getAllBlogPosts } from "./getAllBlogPosts";

// Utilities
export { getAllPostSlugsWithLocales, getAvailableLocales } from "./loader";

// Types
export type { ArticleTagSlug } from "./types";
export { ARTICLE_TAG_SLUGS, ARTICLE_TAG_LABELS, getArticleTagLabel } from "./types";
