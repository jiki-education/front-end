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

// Build series loaders
export { getAllBuildSeries } from "./getAllBuildSeries";
export { getBuildSeries } from "./getBuildSeries";
export type { BuildSeriesWithEpisodes } from "./getBuildSeries";
export { getBuildEpisode } from "./getBuildEpisode";

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
  BuildSeriesMeta,
  BuildEpisodeMeta,
  ProcessedBuildEpisode,
  BuildVideoProvider
} from "./types";
export { ARTICLE_TAG_SLUGS, ARTICLE_TAG_LABELS, getArticleTagLabel } from "./types";
export { GUIDE_TAG_SLUGS, GUIDE_TAG_LABELS, getGuideTagLabel } from "./types";
