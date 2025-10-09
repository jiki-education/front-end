# Instructions for AI Assistants - Jiki Content

## ⚠️ CRITICAL: First Step for ANY Work

**Before starting ANY task, you MUST create a feature branch using git worktree:**

```bash
# 1. Ensure you're on main and up-to-date
git checkout main && git pull

# 2. Create a new feature branch
git checkout -b feature-branch-name

# 3. Create an isolated worktree directory
git worktree add ../../worktrees/front-end-app-feature-branch feature-branch-name

# 4. Change to the worktree directory
cd ../../worktrees/front-end-app-feature-branch/content
```

This isolates your work in a separate directory. Never work directly in the main repository directory.

---

This file provides guidance to AI agents when working with the Jiki content repository.

## Repository Overview

This is the **@jiki/content** package - a TypeScript library that manages all blog posts and articles for the Jiki platform. Content is authored in Markdown with frontmatter, validated at build time, and exported as structured data for the app to consume.

### Purpose

The content repository:

- Stores blog posts and articles as Markdown files
- Validates frontmatter and content structure at build time
- Manages multi-language support (English + Hungarian)
- Exports typed data structures for frontend consumption
- Handles image assets (covers, avatars)
- Provides author registry

### Key Documentation

For detailed information about specific aspects of the content package:

- **[.context/README.md](.context/README.md)** - Overview of all context documentation
- **[.context/architecture.md](.context/architecture.md)** - Package structure and build process
- **[.context/frontmatter.md](.context/frontmatter.md)** - Frontmatter schema and field reference
- **[.context/validation.md](.context/validation.md)** - Validation rules and error handling

### Integration with Jiki Ecosystem

- **App Consumer**: The `@jiki/app` package imports content at build time
- **Type Safety**: Provides `ProcessedPost` types for frontend consumption
- **Independent**: No dependencies on curriculum or interpreters packages

## Git Workflow

### Creating Pull Requests

After completing work:

```bash
# Make changes
git add .
git commit -m "Add blog post: [name]"
git push -u origin branch-name
gh pr create --title "Add blog post: [name]" --body "Description of the post"
```

## Project Structure

```
content/
├── .context/                 # Detailed documentation
│   ├── README.md            # Documentation overview
│   ├── architecture.md      # Package structure
│   ├── frontmatter.md       # Schema reference
│   └── validation.md        # Validation rules
├── src/
│   ├── index.ts              # Main exports
│   ├── types.ts              # TypeScript definitions
│   ├── loader.ts             # Content parsing
│   ├── validator.ts          # Validation logic
│   ├── authors.json          # Author registry
│   └── posts/
│       ├── blog/             # Blog posts
│       │   └── [slug]/
│       │       ├── en.md     # English (required)
│       │       └── hu.md     # Hungarian (optional)
│       └── articles/         # Evergreen articles
│           └── [slug]/
│               ├── en.md
│               └── hu.md
├── images/
│   ├── blog/                 # Blog post images
│   ├── articles/             # Article images
│   └── avatars/              # Author avatars
├── tests/                    # Validation tests
├── dist/                     # Compiled output
└── scripts/
    └── pre-commit            # Git hook script
```

## Core Concepts

For detailed documentation on each concept, see the `.context/` directory files linked above.

### Content Organization

Content is organized **slug-first**, not language-first:

```
posts/blog/jiki-is-born/
├── en.md    # Required
└── hu.md    # Optional
```

This structure:

- Makes translations easy to manage
- Ensures slug consistency
- Allows adding new languages without restructuring

### Frontmatter Schema

All posts use comprehensive frontmatter with required fields:

```yaml
---
title: "Getting Started with Jiki"
date: "2025-01-15"
excerpt: "Learn how to start your coding journey"
author: "jeremy"
tags: ["beginners", "tutorial"]
seo:
  description: "Complete guide to starting with Jiki"
  keywords: ["learn to code", "jiki"]
featured: true
coverImage: "/images/blog/getting-started.jpg"
---
```

See `.context/frontmatter.md` for complete schema reference.

### Validation Strategy

All validation happens **only in tests**:

- ✅ Every post has `en.md`
- ✅ All frontmatter fields present and correctly typed
- ✅ Author keys exist in `authors.json`
- ✅ Date format valid (`YYYY-MM-DD`)
- ✅ Cover images and avatars exist
- ✅ No duplicate slugs

The loader does NOT validate - it trusts tests have verified content integrity. The app package also **trusts** content data - no runtime validation.

### Build Process

```bash
pnpm run build
```

1. Parse all markdown files with gray-matter
2. Expand author keys to full objects
3. Render markdown to HTML with marked
4. Copy images to dist/
5. Export typed data structures

**Note**: Validation is NOT part of the build - it only runs in tests (`pnpm test`).

## Development Workflow

### Commands

```bash
# Development
pnpm run dev          # Watch mode for TypeScript compilation
pnpm run build        # Build the package

# Quality Checks
pnpm run typecheck    # Check TypeScript types
pnpm run lint         # Run ESLint
pnpm run format       # Format with Prettier
pnpm run format:check # Check formatting
pnpm test             # Run validation tests
```

### Adding a New Blog Post

1. **Create post directory**: `src/posts/blog/[slug]/`
2. **Add English version**: `en.md` with complete frontmatter
3. **Optionally add translations**: `hu.md` with translated content
4. **Add cover image**: Place in `images/blog/`
5. **Run tests**: `pnpm test` to validate
6. **Build**: `pnpm run build` to compile

### Adding a New Article

Same process as blog post, but in `src/posts/articles/[slug]/`

### Adding a New Author

1. **Update `src/authors.json`**:
   ```json
   {
     "author-key": {
       "name": "Full Name",
       "avatar": "/images/avatars/author-key.jpg"
     }
   }
   ```
2. **Add avatar image**: `images/avatars/author-key.jpg`
3. **Run tests**: Validation will check avatar exists

### Adding a New Language

1. **Add locale file**: `src/posts/blog/[slug]/xx.md` (where xx is locale code)
2. **Translate frontmatter and content**
3. **Keep structural fields consistent**: `author`, `date`, `coverImage` stay the same
4. **Run tests**: Validation ensures consistency

## Type Architecture

### Type Flow

1. **Content defines** post types and frontmatter schema
2. **App imports** these types from `@jiki/content`
3. **TypeScript ensures** compatibility at compile time

### Exported Types

```typescript
export interface ProcessedPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
  };
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

export function getAllBlogPosts(locale: string): ProcessedPost[];
export function getBlogPost(slug: string, locale: string): ProcessedPost;
export function getAllArticles(locale: string): ProcessedPost[];
export function getArticle(slug: string, locale: string): ProcessedPost;
```

## Best Practices

### Content Writing

- **Clear titles** - Descriptive and concise
- **Useful excerpts** - Summarize key value (1-2 sentences)
- **Proper tags** - Use lowercase kebab-case, be consistent
- **SEO optimization** - Write unique descriptions and keywords
- **Image quality** - Use appropriate resolution and file size

### Code Organization

- **Single responsibility** - Each module has one clear purpose
- **Type safety** - All functions and data structures fully typed
- **Error handling** - Clear, actionable error messages
- **Documentation** - Comment complex validation logic

### Validation

- **Test-only** - Validation only runs in test suite, not in loader or build
- **Fail fast** - Validation errors stop tests immediately
- **Clear messages** - Errors explain what's wrong and how to fix it
- **Comprehensive tests** - Test all validation rules and all actual content
- **No build/runtime cost** - Zero validation overhead during build or runtime

## Integration with Frontend

### How App Uses Content

1. **Import functions**: `import { getAllBlogPosts } from '@jiki/content'`
2. **Get data**: Call functions with desired locale
3. **Render**: Use returned data in React components
4. **Images**: Images are copied to app's `public/` during prebuild

### Static Generation

App uses Next.js static generation:

```typescript
export async function generateStaticParams() {
  const posts = getAllBlogPosts("en");
  return posts.map((post) => ({ slug: post.slug }));
}
```

## Important Rules

1. **English required** - Every post must have `en.md`
2. **Test-only validation** - All validation in test suite only, not in loader or app
3. **Type safety first** - All interfaces properly typed
4. **Clear documentation** - Document all public APIs
5. **Test validation** - Every validation rule has unit tests, and all content has integration tests
6. **Slug consistency** - Same slug across all locales
7. **Author registry** - All authors in `authors.json`

## Common Tasks

### Running Development Server

```bash
pnpm run dev
```

Starts TypeScript in watch mode, recompiling on changes.

### Building for Production

```bash
pnpm run build
```

Validates content, compiles TypeScript, and copies images to `dist/`.

### Type Checking

```bash
pnpm run typecheck
```

Validates all TypeScript without emitting files.

## Debugging Tips

- **Check validation errors** - Read error messages carefully
- **Verify frontmatter** - Ensure all required fields present
- **Test authors.json** - Make sure author keys match
- **Check image paths** - Verify images exist in correct location
- **Run tests** - `pnpm test` catches most issues
- **Check date format** - Must be `YYYY-MM-DD`

## Repository Links

- **App**: `../app` (Consumes content at build time)
- **Monorepo Root**: `..` (Workspace configuration)

## Contact for Questions

When in doubt about content structure or validation:

1. Check existing posts for patterns
2. Review `.context/` documentation
3. Run tests to catch validation issues
4. Ask for clarification on architectural decisions
