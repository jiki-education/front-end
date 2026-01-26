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
  featured: boolean;
  listed: boolean;
  content: string; // Rendered HTML
  locale: string;
}

export interface AuthorRegistry {
  [key: string]: Author;
}
