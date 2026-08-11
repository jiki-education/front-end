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

Articles are served under `/help` (the Help Center). Legacy `/articles/*` URLs 308 to `/help/*`.

- **`/help`** - English Help Center index page
- **`/help/[slug]`** - Individual English article

### Article Routes (Localized)

- **`/[locale]/help`** - Localized Help Center index (e.g., `/hu/help`)
- **`/[locale]/help/[slug]`** - Localized article (e.g., `/hu/help/about-jiki`)
- **`/en/help/*`** - Redirects to naked `/help/*` URLs

### Build / Project Routes

The "Build with Jeremy" section. All routes are locale-routed like blog/help.

- **`/build`** - Hub page: intro video, project portfolio, upcoming live streams sidebar
- **`/projects/[slug]`** - Project page: summary, episode list, sidebar (project's streams + coming-soon projects). Projects with no episodes are "coming soon" and have no detail page.
- **`/projects/[slug]/episodes/[episodeSlug]`** - Episode page: from→to summary box, video (Mux or YouTube), transcript, related-guides sidebar

Content is authored in `content/src/posts/projects/` (see `content/AGENTS.md`). Loaders: `getAllProjects`, `getProject`, `getProjectEpisode` in `lib/content/`. Types: `ProjectMeta`, `EpisodeMeta`, `ProcessedEpisode`.

## Testimonials

Student testimonials feed two surfaces: the landing page (a featured quote, a grid of trimmed
quotes, and the hero marquee blurbs) and the full `/testimonials` page. They are **editorial
content**, not UI chrome, so they live in the content package rather than the i18n message catalog.
Unlike blog/article/guide bodies they are not markdown documents but small structured data, and they
are authored as two files split along the line that decides who publishes what:

```
content/src/testimonials/structure.json   # locale-invariant, never translated
content/src/testimonials/messages.json    # the English copy catalog
```

`structure.json` holds everything that is the same in every language: `people` (each person's display
name and avatar filename), `quotes` (which person each quote key belongs to), `landing` (the
`primary` quote key plus the ordered grid keys) and `page` (the ordered keys the `/testimonials` page
shows). It rides inside the locale-invariant `/static/content/structure-{hash}.json` artifact under a
`testimonials` key, alongside the structural half of posts and projects.

`messages.json` holds the copy: `heading`, `subheading` (a single sentence carrying one
`<link>…</link>` span linking to the full testimonials page), `roles` keyed by person, `quotes` keyed
by quote key, and a `marquee` array of short blurbs. English is published to
`/static/content/testimonials/en/meta-{hash}.json` by `scripts/generate-content-cache.js`; **every
other locale's catalog is published by the `i18n` repo** to the same path shape, with a mutable
pointer at `/static/content/testimonials/{locale}/current.json` that the i18n repo owns. This is the
same split and the same mechanism project copy uses (`projectCopyPath` / `projectCopyPointerPath`,
mirrored by `testimonialsCopyPath` / `testimonialsCopyPointerPath` in `lib/assets-paths.ts`).

A quote key is a person's slug, or that slug plus `-short` where the landing grid shows a trimmed
form of the same testimonial the `/testimonials` page shows in full. Ownership therefore has to live
in `structure.json`: two keys can resolve to one person, one name and one avatar, and neither surface
should have to know that.

Quote text is a **restricted Markdown subset** (`**bold**` and blank-line paragraph breaks, nothing
else), rendered element by element by `components/testimonials/text.tsx`. No testimonial string is
ever injected as HTML, so a translator producing ordinary text can never break the page or inject
markup. The avatar `image` field is a **filename only**: the presentational assets stay bundled with
the landing-page component (`components/landing-page/assets/testimonials/`), which maps the filename
to a `StaticImageData`, keeping the optimized `next/image` output identical while the copy lives in
content.

`getTestimonials(locale)` (from `@/lib/content`) fetches the locale's copy catalog and assembles it
against the structure. **There is no English fallback.** A locale with no testimonial catalog gets
`null`: the landing section disappears and the `/testimonials` page renders an empty list. Showing
English marketing copy to a reader who asked for another language is the exact failure the split
exists to prevent, and it would hide the gap from everyone who could fix it. Validation lives in
`lib/content/validator.ts` (`validateTestimonials`) and runs in `tests/unit/content/`.

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

Source images live in the content package and are symlinked into `public/`:

```bash
public/static/images/blog -> ../../../../content/images/blog
public/static/images/articles -> ../../../../content/images/articles
public/static/images/avatars -> ../../../../content/images/avatars
```

- Symlinks point to source images in `content/images/` (not `content/dist/images/`)
- Source images are committed to git and always available
- Symlinks are tracked in git for consistent deployment

### Content-hashed serving

`generate-content-cache.js` does not serve images from those symlinks directly.
For every `/images/...` reference (cover images, author avatars, and inline
markdown images) it reads the source bytes, content-hashes them, and copies the
file to a fingerprinted path under the immutable content cache:

```
/images/blog/foo.webp → /static/content/images/blog/foo.<hash>.webp
```

The hashed URL is baked into the generated metadata/HTML, so consumers just
render `post.coverImage` / `author.avatar` unchanged. Because `/static/content/*`
is served `immutable` (see `public/_headers`), changing an image produces a new
URL and busts the cache automatically. The `/static/images/*` symlinks remain the
build-time source only.

## Locale Handling

### Configuration

Supported locales are defined in `app/config/locales.ts`:

```typescript
export const SUPPORTED_LOCALES = ["en", "hu"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
```

### How It Works

1. **Default locale (English)**: Served at naked URLs (`/blog`, `/help`)
2. **Non-default locales**: Served at locale-prefixed URLs (`/hu/blog`, `/hu/help`)
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

- Use the `ui-textual-content` UI-kit class for prose typography
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
