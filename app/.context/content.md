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

### Blog Routes

- **`/blog`** - Blog index page listing all blog posts
- **`/blog/[slug]`** - Individual blog post page

### Article Routes

- **`/articles`** - Articles index page listing all articles
- **`/articles/[slug]`** - Individual article page

## Using Content Functions

Import content functions from `@jiki/content`:

```typescript
import { getAllBlogPosts, getBlogPost, getAllArticles, getArticle } from "@jiki/content";
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
// Throws: Error if post not found
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
// Throws: Error if article not found
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

All blog and article pages use Next.js static generation:

```typescript
// Generate static paths at build time
export async function generateStaticParams() {
  const posts = getAllBlogPosts("en");
  return posts.map((post) => ({ slug: post.slug }));
}
```

This ensures:

- Fast page loads
- SEO-friendly URLs
- No runtime data fetching
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

Images are copied from the content package during prebuild:

```bash
./scripts/copy-content-images.sh
```

This copies:

- `content/dist/images/blog/` → `app/public/images/blog/`
- `content/dist/images/articles/` → `app/public/images/articles/`
- `content/dist/images/avatars/` → `app/public/images/avatars/`

Copied images are gitignored and regenerated on each build.

## Locale Handling

Currently hardcoded to `"en"` locale. Future improvements:

1. Get user locale from settings/preferences
2. Pass locale to all content functions
3. Show language switcher on posts with translations
4. Automatic fallback to English (handled by content package)

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
