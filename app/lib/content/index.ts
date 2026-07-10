/**
 * Content API
 *
 * Public interface for loading blog posts and articles from static content.
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
export { getRelatedBlogPosts } from "./getRelatedBlogPosts";
export type { GetBlogPostsOptions, GetBlogPostsResult } from "./getBlogPosts";

// Guide loaders
export { getGuide } from "./getGuide";
export { getAllGuides } from "./getAllGuides";
export { getGuides } from "./getGuides";
export { getRelatedGuides } from "./getRelatedGuides";
export type { GetGuidesOptions, GetGuidesResult } from "./getGuides";

// Project loaders
export { getAllProjects } from "./getAllProjects";
export { getProject } from "./getProject";
export type { ProjectWithEpisodes } from "./getProject";
export { getProjectEpisode } from "./getProjectEpisode";

// Utilities
export { getAvailableLocales } from "./loader";

// Types
export type {
  ArticleTagSlug,
  GuideTagSlug,
  BlogPostMeta,
  ArticleMeta,
  GuideMeta,
  ProcessedBlogPost,
  ProcessedArticle,
  ProcessedGuide,
  SearchIndexData,
  ProjectMeta,
  EpisodeMeta,
  EpisodeSummary,
  ProcessedEpisode,
  VideoProvider
} from "./types";
export { ARTICLE_TAG_SLUGS, ARTICLE_TAG_LABELS, getArticleTagLabel } from "./types";
export { GUIDE_TAG_SLUGS, GUIDE_TAG_LABELS, getGuideTagLabel } from "./types";
