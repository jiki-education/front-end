# Content Package Integration Plan

This document outlines the plan for integrating the `@jiki/content` package into the app to render blog posts and articles.

## Overview

The `@jiki/content` package provides validated, processed blog posts and articles as structured data. The app will consume this data at build time to generate static pages.

## Implementation Steps

### 1. Update App Dependencies

Add `@jiki/content` to the app's `package.json`:

```json
{
  "dependencies": {
    "@jiki/content": "workspace:*"
  }
}
```

Run `pnpm install` to link the workspace package.

### 2. Update Build Scripts

Add a prebuild script to `package.json` that runs the image copy script:

```json
{
  "scripts": {
    "prebuild": "./scripts/copy-content-images.sh"
  }
}
```

The script (`scripts/copy-content-images.sh`) copies images from the content package to the app's public directory. This ensures all images (blog covers, article images, author avatars) are available in the public directory for serving.

**Important**: These copied images should NOT be committed to git. They are added to `.gitignore`:

```
public/images/blog/
public/images/articles/
public/images/avatars/
```

The source images remain in the `content` package and are copied during the prebuild step.

### 3. Create Blog Routes

Create the following route structure for blog posts:

```
app/app/blog/
├── page.tsx          # Blog index - lists all blog posts
└── [slug]/
    └── page.tsx      # Individual blog post - renders single post
```

#### Blog Index (`app/app/blog/page.tsx`)

```typescript
import { getAllBlogPosts } from '@jiki/content';

export default async function BlogPage() {
  const posts = getAllBlogPosts('en'); // TODO: Get locale from user settings

  return (
    <div>
      <h1>Blog</h1>
      {posts.map(post => (
        <article key={post.slug}>
          <h2><a href={`/blog/${post.slug}`}>{post.title}</a></h2>
          <p>{post.excerpt}</p>
          <time>{post.date}</time>
          <div>By {post.author.name}</div>
        </article>
      ))}
    </div>
  );
}
```

#### Blog Post (`app/app/blog/[slug]/page.tsx`)

```typescript
import { getBlogPost, getAllBlogPosts } from '@jiki/content';

export async function generateStaticParams() {
  const posts = getAllBlogPosts('en');
  return posts.map(post => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug, 'en'); // TODO: Get locale from user settings

  return (
    <article>
      <h1>{post.title}</h1>
      <time>{post.date}</time>
      <div>By {post.author.name}</div>
      {post.coverImage && <img src={post.coverImage} alt={post.title} />}
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

### 4. Create Article Routes

Create the following route structure for articles:

```
app/app/articles/
├── page.tsx          # Articles index - lists all articles
└── [slug]/
    └── page.tsx      # Individual article - renders single article
```

Implementation is similar to blog routes but uses `getAllArticles()` and `getArticle()` from `@jiki/content`.

### 5. Styling Considerations

- Blog posts and articles will need styling for rendered markdown content
- Consider creating a shared `<MarkdownContent>` component
- Add Tailwind classes for typography (headings, paragraphs, lists, code blocks)
- Consider using `@tailwindcss/typography` plugin

### 6. Locale Support

Current implementation uses hardcoded `'en'` locale. Future improvements:

- Get user locale from settings/preferences
- Pass locale to all `@jiki/content` functions
- Show language switcher on posts with translations
- Fallback to English if translation not available

### 7. SEO Considerations

Use the SEO fields from the processed posts:

```typescript
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug, "en");

  return {
    title: post.title,
    description: post.seo.description,
    keywords: post.seo.keywords.join(", ")
  };
}
```

### 8. Update Context Documentation

Add `.context/content.md` explaining:

- How content package works
- Content data structure
- How to use content functions
- Locale handling strategy

Update `.context/README.md` to reference the new file.

### 9. Update AGENTS.md

Add section about content integration:

- Where blog/article routes live
- How to add new routes for content
- Styling conventions for markdown content

### 10. Update Root Documentation

Update `/Users/iHiD/Code/jiki/front-end-app/CLAUDE.md` to include:

- Reference to content package
- Updated dependency graph: `app → content`, `app → curriculum → interpreters`
- Add `pnpm test:content` to test commands

### 11. Update Root Package Scripts

Add content package test script to root `package.json`:

```json
{
  "scripts": {
    "test:content": "pnpm --filter @jiki/content test"
  }
}
```

Update `pnpm test` to include content tests.

## Future Enhancements

- Add pagination for blog index
- Add tag filtering for blog posts
- Add search functionality
- Add RSS feed generation
- Add social sharing meta tags (Open Graph, Twitter Cards)
- Add related posts/articles
- Add comments system
- Add reading time estimation

## Validation

Before considering complete:

- [ ] All routes render correctly
- [ ] Images load from public directory
- [ ] Static generation works (`pnpm build`)
- [ ] SEO metadata present in page source
- [ ] Both English and Hungarian content accessible
- [ ] No console errors
- [ ] TypeScript compilation succeeds
- [ ] All existing tests pass
