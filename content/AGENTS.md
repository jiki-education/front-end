# Instructions for AI Assistants - Jiki Content

## ⚠️ CRITICAL: First Step for ANY Work

**Before starting ANY task, you MUST create a feature branch:**

```bash
# 1. Ensure you're on main and up-to-date
git checkout main && git pull

# 2. Create a new feature branch
git checkout -b feature-branch-name
```

---

This file provides guidance to AI agents when working with the Jiki content repository.

## Repository Overview

This is the **@jiki/content** package - a data-only repository that stores blog posts and articles as Markdown files. Content is consumed by the app package at build time, which handles parsing, validation, and type generation.

### Purpose

The content repository:

- Stores blog posts and articles as Markdown files with frontmatter
- Manages multi-language support (English plus multiple additional languages)
- Stores image assets (covers, avatars)
- Provides author registry
- **Does NOT handle**: parsing, validation, or TypeScript compilation (handled by app package)

### Translation Workflow

**IMPORTANT**: When asked to translate content, ALWAYS use the `translate` subagent. Do not translate manually.

The `translate` subagent orchestrates parallel translations into all supported languages by delegating to specialized language-specific translation agents. Simply invoke it with the post slug and type.

**Translation agents are provided by the Jiki Claude Marketplace** (`jiki-education/claude-marketplace`), which is configured in `.claude/settings.json` and automatically available to the team. The marketplace defines which languages are supported - check the marketplace repository for the current list of available translation agents.

### Key Documentation

For detailed information about specific aspects of the content package:

- **[.context/README.md](.context/README.md)** - Overview of all context documentation
- **[.context/architecture.md](.context/architecture.md)** - Package structure and content organization
- **[.context/frontmatter.md](.context/frontmatter.md)** - Frontmatter schema and field reference
- **[.context/validation.md](.context/validation.md)** - Validation rules (enforced by app package)

### Integration with Jiki Ecosystem

- **App Consumer**: The `@jiki/app` package generates content at build time by reading these files
- **Build-Time Generation**: App's `scripts/generate-content.js` parses markdown and generates TypeScript files
- **No Compilation**: This package contains only source data, no build process
- **Independent**: No dependencies on other packages

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
└── scripts/
    └── pre-commit            # Git hook script
```

**Note**: No `dist/` directory - content is consumed directly by app package at build time.

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

All validation happens in the **app package** during build:

- ✅ Every post has `en.md`
- ✅ All frontmatter fields present and correctly typed
- ✅ Author keys exist in `authors.json`
- ✅ Date format valid (`YYYY-MM-DD`)
- ✅ Cover images and avatars exist
- ✅ No duplicate slugs

Validation tests are located in `app/tests/unit/content/`.

### Build-Time Content Generation

The app package generates content at build time:

1. **App runs**: `pnpm run generate:content`
2. **Script reads**: Markdown files from this package
3. **Parses**: Frontmatter and content with gray-matter
4. **Validates**: All content meets requirements
5. **Generates**: TypeScript files in `app/lib/content/generated/`
6. **Copies**: Images to `app/public/images/`

This package has **no build process** - it's a pure data repository.

## Development Workflow

### Commands

This package has minimal commands since it's data-only:

```bash
# Quality Checks (run from app package)
cd ../app
pnpm run generate:content  # Generate content from this package
pnpm test -- content       # Run content validation tests

# Formatting (run from content package)
pnpm run format            # Format with Prettier
pnpm run format:check      # Check formatting
```

### Adding a New Blog Post

1. **Create post directory**: `src/posts/blog/[slug]/`
2. **Add English version**: `en.md` with complete frontmatter
3. **Optionally add translations**: `hu.md` with translated content
4. **Add cover image**: Place in `images/blog/`
5. **Generate content**: `cd ../app && pnpm run generate:content`
6. **Run tests**: `pnpm test -- content` to validate

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
3. **Regenerate content**: App's validation will check avatar exists

### Adding a New Language

1. **Add locale file**: `src/posts/blog/[slug]/xx.md` (where xx is locale code)
2. **Translate frontmatter and content**
3. **Keep structural fields consistent**: `author`, `date`, `coverImage` stay the same
4. **Regenerate content**: App will pick up new language

## Type Architecture

### Type Flow

1. **Content provides**: Raw markdown and authors.json
2. **App generates**: TypeScript types from content at build time
3. **App exports**: Types in `app/lib/content/types.ts`
4. **Components use**: Generated types for type safety

### Generated Types (in app package)

The app package generates types like:

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
```

## Best Practices

### Content Writing

- **Clear titles** - Descriptive and concise
- **Useful excerpts** - Summarize key value (1-2 sentences)
- **Proper tags** - Use lowercase kebab-case, be consistent
- **SEO optimization** - Write unique descriptions and keywords
- **Image quality** - Use appropriate resolution and file size

### Content Organization

- **Consistent slugs** - Same slug across all locales
- **Author registry** - All authors in `authors.json`
- **English required** - Every post must have `en.md`
- **Image paths** - Match frontmatter `coverImage` values

## Integration with Frontend

### How App Uses Content

1. **Build time**: App runs `generate:content` script
2. **Reads**: Markdown files from this package
3. **Generates**: TypeScript loader functions in `app/lib/content/generated/`
4. **Components import**: From `@/lib/content/loader`
5. **Images copied**: To `app/public/images/` during generation

### Static Generation

App uses Next.js static generation with generated loaders:

```typescript
import { getAllBlogPosts } from "@/lib/content/loader";

export async function generateStaticParams() {
  const posts = getAllBlogPosts("en");
  return posts.map((post) => ({ slug: post.slug }));
}
```

## Important Rules

1. **English required** - Every post must have `en.md`
2. **Data only** - This package contains no TypeScript code
3. **App validates** - All validation happens in app package
4. **Slug consistency** - Same slug across all locales
5. **Author registry** - All authors in `authors.json`
6. **No build process** - Content consumed directly by app

## Common Tasks

### Viewing Generated Content

After adding/editing content:

```bash
cd ../app
pnpm run generate:content  # Generate TypeScript from markdown
pnpm run dev              # Start dev server to see changes
```

### Checking Validation

```bash
cd ../app
pnpm test -- content      # Run content validation tests
```

### Formatting

```bash
pnpm run format           # Auto-format all files
```

## Debugging Tips

- **Check frontmatter** - Ensure all required fields present
- **Verify authors.json** - Make sure author keys match
- **Check image paths** - Verify images exist in correct location
- **Run generation**: `cd ../app && pnpm run generate:content` to see parsing errors
- **Run tests**: `cd ../app && pnpm test -- content` to validate
- **Check date format** - Must be `YYYY-MM-DD`

## Repository Links

- **App**: `../app` (Consumes content at build time)
- **Monorepo Root**: `..` (Workspace configuration)

## Contact for Questions

When in doubt about content structure or validation:

1. Check existing posts for patterns
2. Review `.context/` documentation
3. Run content generation in app to catch issues
4. Check app's content tests for validation rules
