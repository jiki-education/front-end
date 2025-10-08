# Content Package Context Documentation

This directory contains detailed documentation about the `@jiki/content` package structure, architecture, and workflows.

## Overview

The content package manages all blog posts and articles for the Jiki platform. Content is authored in Markdown with frontmatter, validated at build time, and exported as structured data for the app to consume.

## Documentation Files

- **[architecture.md](architecture.md)** - Package structure, build process, and data flow
- **[frontmatter.md](frontmatter.md)** - Frontmatter schema reference and field descriptions
- **[validation.md](validation.md)** - Content validation rules and error handling

## Quick Reference

### Adding New Content

1. Create slug directory in `src/posts/blog/` or `src/posts/articles/`
2. Add `en.md` file (required) with frontmatter and content
3. Optionally add translations (`hu.md`, etc.)
4. Add cover image to `images/blog/` or `images/articles/`
5. Run `pnpm test` to validate
6. Run `pnpm build` to compile

### Frontmatter Requirements

All posts must have:

- `title`, `date`, `excerpt`, `author` (key from authors.json)
- `tags` (array of strings)
- `seo` (description and keywords)
- `featured` (boolean)
- `coverImage` (path to image)

### Build Process

1. Parse markdown files with gray-matter
2. Validate all frontmatter fields
3. Expand author keys to full objects
4. Render markdown to HTML with marked
5. Copy images to dist/
6. Export typed data structures

### Testing

```bash
pnpm test        # Run all validation tests
pnpm typecheck   # TypeScript type checking
pnpm lint        # ESLint
pnpm format      # Format with Prettier
```

## Integration with App

The app package imports content at build time:

```typescript
import { getAllBlogPosts, getBlogPost } from "@jiki/content";
```

Images are copied to app's `public/` directory during prebuild.
