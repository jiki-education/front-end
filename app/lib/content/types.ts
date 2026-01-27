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

export interface ProcessedBlogPost {
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
  content: string; // Rendered HTML
  locale: string;
}

export interface ProcessedArticle {
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
  content: string; // Rendered HTML
  locale: string;
}

export interface AuthorRegistry {
  [key: string]: Author;
}
