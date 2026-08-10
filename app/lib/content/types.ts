// Article tag slugs - used in URLs and frontmatter
export const ARTICLE_TAG_SLUGS = ["legal", "premium", "exercises", "videos"] as const;
export type ArticleTagSlug = (typeof ARTICLE_TAG_SLUGS)[number];

// Guide tag slugs - used in URLs and frontmatter
export const GUIDE_TAG_SLUGS = ["editors", "installation", "agentic-coding", "front-end-basics"] as const;
export type GuideTagSlug = (typeof GUIDE_TAG_SLUGS)[number];

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
  order: number;
  readingTime: number;
  contentHash: string;
  locale: string;
}

export interface ProcessedGuide extends GuideMeta {
  content: string;
}

export type VideoProvider = "youtube" | "mux";

// A project with no episodes yet is "coming soon" — there is no explicit
// status field.
export interface ProjectMeta {
  slug: string;
  order: number;
  title: string;
  description: string;
  tags: string[];
  image: string;
  livestream: boolean;
  upcomingStreams: string[];
  /** How many episodes this locale has, counted from the assembled list. */
  episodeCount: number;
  locale: string;
}

// Freeform, localized prose describing the journey an episode takes you on.
export interface EpisodeSummary {
  from: string;
  to: string;
  keyConcepts: string[];
}

export interface EpisodeMeta {
  uuid: string;
  slug: string;
  project: string;
  order: number;
  title: string;
  excerpt: string;
  date: string;
  author: Author;
  videoProvider: VideoProvider;
  videoKey: string;
  durationSeconds: number;
  premium: boolean;
  image: string;
  guides: string[];
  summary: EpisodeSummary | null;
  tags: string[];
  seo: {
    description: string;
    keywords: string[];
  };
  readingTime: number;
  contentHash: string;
  locale: string;
}

// `content` is the episode's transcript, pre-rendered to HTML.
export interface ProcessedEpisode extends EpisodeMeta {
  content: string;
}

export interface AuthorRegistry {
  [key: string]: Author;
}

// Landing-page testimonials. Editorial content (student quotes + marquee blurbs),
// authored per-locale in the content package (content/src/testimonials/{locale}.json)
// and baked into content-meta-server.json for synchronous SSR delivery.
//
// `image` is a filename only (e.g. "fred.webp"); the presentational avatar assets
// live with the landing-page component, which maps the filename to a bundled
// StaticImageData. `html` is trusted, hand-authored markup (only <strong> is used)
// rendered via dangerouslySetInnerHTML.
export interface Testimonial {
  slug: string;
  name: string;
  role: string;
  image: string;
  html: string;
}

export interface PrimaryTestimonial {
  quote: string;
  name: string;
  role: string;
  image: string;
}

export interface TestimonialsData {
  heading: string;
  // Sentence containing a single <link>…</link> span linking to the full
  // testimonials page. Rendered by splitting on the <link> tag.
  subheading: string;
  primary: PrimaryTestimonial;
  quotes: Testimonial[];
  // Short attribution-free blurbs for the hero marquee.
  marquee: string[];
}

export interface SearchIndexData {
  index: object;
  items: Array<{ slug: string; title: string; excerpt: string }>;
}
