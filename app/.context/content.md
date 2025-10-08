# Content Integration

## Overview

The app integrates with the `@jiki/content` package to display blog posts and articles. Content is loaded at build time using static generation for optimal performance.

## Content Package

The content package (`@jiki/content`) provides:

- Validated blog posts and articles as structured data
- Markdown content rendered to HTML
- Author information with avatars
- SEO metadata
- Multi-language support (en, hu)

All content validation happens in the content package's test suite, ensuring data integrity before it reaches the app.

## Routes

### Blog Routes (English - Default)

- **`/blog`** - English blog index page
- **`/blog/[slug]`** - Individual English blog post

### Blog Routes (Localized)

- **`/[locale]/blog`** - Localized blog index (e.g., `/hu/blog`)
- **`/[locale]/blog/[slug]`** - Localized blog post (e.g., `/hu/blog/jiki-is-born`)
- **`/en/blog/*`** - Redirects to naked `/blog/*` URLs

### Article Routes (English - Default)

- **`/articles`** - English articles index page
- **`/articles/[slug]`** - Individual English article

### Article Routes (Localized)

- **`/[locale]/articles`** - Localized articles index (e.g., `/hu/articles`)
- **`/[locale]/articles/[slug]`** - Localized article (e.g., `/hu/articles/about-jiki`)
- **`/en/articles/*`** - Redirects to naked `/articles/*` URLs

## Using Content Functions

Import content functions from `@jiki/content`:

```typescript
import {
  getAllBlogPosts,
  getBlogPost,
  getAllArticles,
  getArticle,
  getAllPostSlugsWithLocales,
  getAvailableLocales
} from "@jiki/content";
```

### Get All Blog Posts

```typescript
const posts = getAllBlogPosts("en");
// Returns: ProcessedPost[] sorted by date (newest first)
```

### Get Single Blog Post

```typescript
const post = getBlogPost("jiki-is-born", "en");
// Returns: ProcessedPost with rendered HTML content
// Throws: Error if post not found (falls back to English if locale missing)
```

### Get All Articles

```typescript
const articles = getAllArticles("en");
// Returns: ProcessedPost[] sorted alphabetically by title
```

### Get Single Article

```typescript
const article = getArticle("about-jiki-javascript", "en");
// Returns: ProcessedPost with rendered HTML content
// Throws: Error if article not found (falls back to English if locale missing)
```

### Get All Post Slugs with Locales (Route Generation)

```typescript
import { SUPPORTED_LOCALES } from "@/config/locales";

const slugsWithLocales = getAllPostSlugsWithLocales("blog", SUPPORTED_LOCALES);
// Returns: [{ slug: "jiki-is-born", locale: "en" }, { slug: "jiki-is-born", locale: "hu" }, ...]
// Only includes locales that are both in content AND in SUPPORTED_LOCALES
```

### Get Available Locales

```typescript
import { SUPPORTED_LOCALES } from "@/config/locales";

const locales = getAvailableLocales("blog", SUPPORTED_LOCALES);
// Returns: ["en", "hu"] (intersection of content locales and SUPPORTED_LOCALES)
```

## Data Structure

The `ProcessedPost` type returned by all functions:

```typescript
interface ProcessedPost {
  slug: string; // URL-friendly identifier
  title: string; // Post title
  date: string; // ISO date string (YYYY-MM-DD)
  excerpt: string; // Short summary
  author: {
    name: string; // Author full name
    avatar: string; // Path to avatar image
  };
  tags: string[]; // Topic tags
  seo: {
    description: string; // Meta description
    keywords: string[]; // Meta keywords
  };
  featured: boolean; // Featured post flag
  coverImage: string; // Path to cover image
  content: string; // Rendered HTML content
  locale: string; // Language code (en, hu)
}
```

## Static Generation

All blog and article pages use Next.js static generation. Routes are generated dynamically based on actual translated content:

```typescript
import { getAllPostSlugsWithLocales } from "@jiki/content";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/config/locales";

// For locale-specific routes (e.g., /[locale]/blog/[slug])
export function generateStaticParams() {
  return getAllPostSlugsWithLocales("blog", SUPPORTED_LOCALES)
    .filter((p) => p.locale !== DEFAULT_LOCALE)
    .map((p) => ({ locale: p.locale, slug: p.slug }));
}
```

This ensures:

- Routes only generated for locales in SUPPORTED_LOCALES
- Routes only generated for content that actually exists
- Adding new translation automatically creates routes
- Fast page loads with static generation
- SEO-friendly URLs
- Build-time error detection

## SEO Metadata

Use the `generateMetadata` function for SEO:

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPost(params.slug, "en");

  return {
    title: post.title,
    description: post.seo.description,
    keywords: post.seo.keywords.join(", ")
  };
}
```

## Images

Images are symlinked from the content package for local development:

```bash
public/images/blog -> ../../../content/dist/images/blog
public/images/articles -> ../../../content/dist/images/articles
public/images/avatars -> ../../../content/dist/images/avatars
```

- **Local development**: Symlinks provide instant access without copying
- **Production**: Script at `scripts/copy-content-images.sh` available for S3/CDN upload
- Images in `public/images/{blog,articles,avatars}/` are gitignored

## Locale Handling

### Configuration

Supported locales are defined in `app/config/locales.ts`:

```typescript
export const SUPPORTED_LOCALES = ["en", "hu"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
```

### How It Works

1. **Default locale (English)**: Served at naked URLs (`/blog`, `/articles`)
2. **Non-default locales**: Served at locale-prefixed URLs (`/hu/blog`, `/hu/articles`)
3. **English locale prefix**: Redirects to naked URLs (`/en/blog` → `/blog`)
4. **Content filtering**: Only locales in BOTH content AND SUPPORTED_LOCALES are exposed

### Adding a New Locale

1. Add locale to `SUPPORTED_LOCALES` in `app/config/locales.ts`
2. Add translated content markdown files in `content/src/posts/`
3. Routes automatically generated on next build

### Fallback Behavior

If a post exists in English but not in the requested locale:

- `getBlogPost(slug, "hu")` automatically falls back to English
- This allows partial translations without breaking the site

## Styling Content

Markdown content is rendered as HTML and needs styling:

```tsx
<div dangerouslySetInnerHTML={{ __html: post.content }} />
```

Recommendations:

- Use Tailwind's `prose` classes for typography
- Create a `<MarkdownContent>` component for consistent styling
- Handle code blocks, headings, lists, blockquotes
- Ensure mobile-responsive layout

## Error Handling

Content functions throw errors for missing posts:

```typescript
try {
  const post = getBlogPost(slug, "en");
} catch (error) {
  // Handle not found
  notFound(); // Next.js 404
}
```

The content package automatically falls back to English if a translation is missing.

## Development Workflow

### Adding New Content

1. Content is added in the `content` package
2. Tests validate the new content
3. App automatically picks up new content on next build
4. No code changes needed in app

### Testing Content Integration

```bash
# Test content package
pnpm test:content

# Test app
pnpm test:app

# Type check
pnpm typecheck
```

## Performance Considerations

- All content loaded at build time (zero runtime cost)
- Images optimized with Next.js Image component
- Static generation for instant page loads
- HTML content pre-rendered from markdown

## Future Enhancements

- Pagination for blog index
- Tag filtering
- Search functionality
- RSS feed generation
- Social sharing (Open Graph, Twitter Cards)
- Related posts/articles
- Comments system
- Reading time estimation
