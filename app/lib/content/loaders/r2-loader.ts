import { getCloudflareContext } from "@opennextjs/cloudflare";
import { marked } from "marked";
import type { BlogPostMeta, ArticleMeta } from "../types";
import type { ConceptMeta } from "@/types/concepts";
import type { ContentLoader, SearchIndexData } from "./types";

/**
 * Minimal R2 types to avoid importing @cloudflare/workers-types globally,
 * which conflicts with DOM types used elsewhere in the app.
 */
interface R2ObjectBody {
  json: <T = unknown>() => Promise<T>;
  text: () => Promise<string>;
}

interface R2BucketLike {
  get: (key: string) => Promise<R2ObjectBody | null>;
}

const KEY_PREFIX = "content";

interface MetadataIndex<T> {
  posts: T[];
}

interface ConceptsIndex {
  concepts: ConceptMeta[];
}

interface Manifest {
  blog: Array<{ slug: string; locale: string }>;
  articles: Array<{ slug: string; locale: string }>;
  concepts: Array<{ slug: string; locale: string }>;
}

export class R2ContentLoader implements ContentLoader {
  private getBucket(): R2BucketLike {
    const { env } = getCloudflareContext();
    return (env as Record<string, R2BucketLike>).ASSETS_R2_BUCKET;
  }

  async getAllBlogPostMeta(locale: string): Promise<BlogPostMeta[]> {
    const data = await this.readJsonFile<MetadataIndex<BlogPostMeta>>(`blog/index/${locale}.json`);
    if (!data) {
      const fallback = await this.readJsonFile<MetadataIndex<BlogPostMeta>>("blog/index/en.json");
      return fallback?.posts ?? [];
    }
    return data.posts;
  }

  async getAllArticleMeta(locale: string): Promise<ArticleMeta[]> {
    const data = await this.readJsonFile<MetadataIndex<ArticleMeta>>(`articles/index/${locale}.json`);
    if (!data) {
      const fallback = await this.readJsonFile<MetadataIndex<ArticleMeta>>("articles/index/en.json");
      return fallback?.posts ?? [];
    }
    return data.posts;
  }

  async getBlogPostContent(slug: string, locale: string): Promise<string> {
    return this.getMarkdownContent(`blog/${slug}/${locale}.md`, `blog/${slug}/en.md`);
  }

  async getArticleContent(slug: string, locale: string): Promise<string> {
    return this.getMarkdownContent(`articles/${slug}/${locale}.md`, `articles/${slug}/en.md`);
  }

  async getSearchIndex(_type: "articles", locale: string): Promise<SearchIndexData> {
    const data = await this.readJsonFile<SearchIndexData>(`search/articles-${locale}.json`);
    if (!data) {
      const fallback = await this.readJsonFile<SearchIndexData>("search/articles-en.json");
      if (!fallback) {
        return { index: {}, articles: [] };
      }
      return fallback;
    }
    return data;
  }

  async getAllSlugsWithLocales(type: "blog" | "articles"): Promise<Array<{ slug: string; locale: string }>> {
    const data = await this.readJsonFile<Manifest>("manifest.json");
    if (!data) {
      return [];
    }
    return data[type];
  }

  async getAllConceptMeta(locale: string): Promise<ConceptMeta[]> {
    const data = await this.readJsonFile<ConceptsIndex>(`concepts/index/${locale}.json`);
    if (!data) {
      const fallback = await this.readJsonFile<ConceptsIndex>("concepts/index/en.json");
      return fallback?.concepts ?? [];
    }
    return data.concepts;
  }

  async getConceptContent(slug: string, locale: string): Promise<string> {
    return this.getMarkdownContent(`concepts/${slug}/${locale}.md`, `concepts/${slug}/en.md`);
  }

  async getAvailableLocales(type: "blog" | "articles"): Promise<string[]> {
    const slugsWithLocales = await this.getAllSlugsWithLocales(type);
    return [...new Set(slugsWithLocales.map((s) => s.locale))];
  }

  private async getMarkdownContent(primaryKey: string, fallbackKey: string): Promise<string> {
    let markdown = await this.readTextFile(primaryKey);
    if (!markdown) {
      markdown = await this.readTextFile(fallbackKey);
    }
    if (!markdown) {
      throw new Error(`Content not found: ${primaryKey}`);
    }
    return marked.parse(markdown) as string;
  }

  private async readJsonFile<T>(key: string): Promise<T | null> {
    try {
      const bucket = this.getBucket();
      const obj = await bucket.get(`${KEY_PREFIX}/${key}`);
      if (!obj) {
        return null;
      }
      return await obj.json<T>();
    } catch {
      return null;
    }
  }

  private async readTextFile(key: string): Promise<string | null> {
    try {
      const bucket = this.getBucket();
      const obj = await bucket.get(`${KEY_PREFIX}/${key}`);
      if (!obj) {
        return null;
      }
      return await obj.text();
    } catch {
      return null;
    }
  }
}
