/**
 * Content API
 *
 * Public interface for loading blog posts and articles from generated content.
 */

// Article loaders
export { getArticle } from "./getArticle";
export { getAllArticles } from "./getAllArticles";
export { getArticles } from "./getArticles";
export { getRelatedArticles } from "./getRelatedArticles";
export type { GetArticlesOptions, GetArticlesResult } from "./getArticles";

// Blog post loaders
export { getBlogPost } from "./getBlogPost";
export { getAllBlogPosts } from "./getAllBlogPosts";
export { getBlogPosts } from "./getBlogPosts";
export type { GetBlogPostsOptions, GetBlogPostsResult } from "./getBlogPosts";

// Utilities
export { getAllPostSlugsWithLocales, getAvailableLocales } from "./loader";

// Types
export type { ArticleTagSlug } from "./types";
export { ARTICLE_TAG_SLUGS, ARTICLE_TAG_LABELS, getArticleTagLabel } from "./types";
