import type { BlogPostMeta, ArticleMeta } from "../types";
import type { ConceptMeta } from "@/types/concepts";

export interface SearchIndexData {
  index: object;
  articles: Array<{ slug: string; title: string; excerpt: string }>;
}

export interface ContentLoader {
  getAllBlogPostMeta: (locale: string) => Promise<BlogPostMeta[]>;
  getAllArticleMeta: (locale: string) => Promise<ArticleMeta[]>;
  getBlogPostContent: (slug: string, locale: string) => Promise<string>;
  getArticleContent: (slug: string, locale: string) => Promise<string>;
  getSearchIndex: (type: "articles", locale: string) => Promise<SearchIndexData>;
  getAllSlugsWithLocales: (type: "blog" | "articles") => Promise<Array<{ slug: string; locale: string }>>;
  getAvailableLocales: (type: "blog" | "articles") => Promise<string[]>;
  getAllConceptMeta: (locale: string) => Promise<ConceptMeta[]>;
  getConceptContent: (slug: string, locale: string) => Promise<string>;
}
