export interface Frontmatter {
  title: string;
  date: string;
  excerpt: string;
  author: string;
  tags: string[];
  seo: {
    description: string;
    keywords: string[];
  };
  featured: boolean;
  coverImage: string;
}

export interface Author {
  name: string;
  avatar: string;
}

export interface ProcessedPost {
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

export interface AuthorRegistry {
  [key: string]: Author;
}
