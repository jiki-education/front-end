// Article tag slugs - used in URLs and frontmatter
export const ARTICLE_TAG_SLUGS = ["legal", "premium", "exercises", "videos"] as const;
export type ArticleTagSlug = (typeof ARTICLE_TAG_SLUGS)[number];

// Tag labels for each locale
export const ARTICLE_TAG_LABELS: Record<ArticleTagSlug, Record<string, string>> = {
  legal: { en: "Legal", hu: "Jogi" },
  premium: { en: "Premium", hu: "Prémium" },
  exercises: { en: "Exercises", hu: "Gyakorlatok" },
  videos: { en: "Videos", hu: "Videók" }
};

export function getArticleTagLabel(slug: ArticleTagSlug, locale: string): string {
  return ARTICLE_TAG_LABELS[slug][locale] || ARTICLE_TAG_LABELS[slug].en;
}

// Guide tag slugs - used in URLs and frontmatter
export const GUIDE_TAG_SLUGS = ["editors", "installation"] as const;
export type GuideTagSlug = (typeof GUIDE_TAG_SLUGS)[number];

// Tag labels for each locale
export const GUIDE_TAG_LABELS: Record<GuideTagSlug, Record<string, string>> = {
  editors: { en: "Editors", hu: "Szerkesztők" },
  installation: { en: "Installation", hu: "Telepítés" }
};

export function getGuideTagLabel(slug: GuideTagSlug, locale: string): string {
  return GUIDE_TAG_LABELS[slug][locale] || GUIDE_TAG_LABELS[slug].en;
}

export interface Frontmatter {
  title: string;
  excerpt: string;
  tags: string[];
  seo: {
    description: string;
    keywords: string[];
  };
}

export interface Author {
  name: string;
  avatar: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: Author;
  tags: string[];
  seo: {
    description: string;
    keywords: string[];
  };
  featured: boolean;
  coverImage: string;
  readingTime: number;
  contentHash: string;
  locale: string;
}

export interface ProcessedBlogPost extends BlogPostMeta {
  content: string;
}

export interface ArticleMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: Author;
  tags: string[];
  seo: {
    description: string;
    keywords: string[];
  };
  listed: boolean;
  readingTime: number;
  contentHash: string;
  locale: string;
}

export interface ProcessedArticle extends ArticleMeta {
  content: string;
}

// Guides have a cover image (like blog posts) and fixed, searchable tags (like
// articles), but no author. `premium` gates the guide behind a premium
// subscription. `date` is treated as a "last updated" date, not a creation date.
export interface GuideMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  seo: {
    description: string;
    keywords: string[];
  };
  coverImage: string;
  premium: boolean;
  readingTime: number;
  contentHash: string;
  locale: string;
}

export interface ProcessedGuide extends GuideMeta {
  content: string;
}

export type BuildVideoProvider = "youtube" | "mux";

export interface BuildSeriesMeta {
  slug: string;
  order: number;
  title: string;
  description: string;
  audience: string;
  cadence: string;
  image: string;
  status: "live" | "pending";
  livestream: boolean;
  upcomingStreams: string[];
  episodeCount: number;
  episodesIndexHash: string;
  locale: string;
}

export interface BuildEpisodeMeta {
  uuid: string;
  slug: string;
  series: string;
  order: number;
  title: string;
  excerpt: string;
  date: string;
  author: Author;
  videoProvider: BuildVideoProvider;
  videoKey: string;
  durationSeconds: number;
  premium: boolean;
  image: string;
  seo: {
    description: string;
    keywords: string[];
  };
  contentHash: string;
  locale: string;
}

export interface ProcessedBuildEpisode extends BuildEpisodeMeta {
  content: string;
}

export interface AuthorRegistry {
  [key: string]: Author;
}

export interface SearchIndexData {
  index: object;
  items: Array<{ slug: string; title: string; excerpt: string }>;
}
