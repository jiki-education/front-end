# Frontmatter Schema Reference

## Overview

All blog posts and articles use YAML frontmatter to store metadata. Frontmatter appears at the top of each markdown file between `---` delimiters.

## Required Fields

Every post must include all of these fields:

### `title` (string)

The post title displayed in listings and on the post page.

```yaml
title: "Getting Started with Jiki"
```

### `date` (string)

Publication date in `YYYY-MM-DD` format.

```yaml
date: "2025-01-15"
```

For articles (evergreen content), this typically represents the creation date and can be updated via a separate `lastUpdated` field if needed in the future.

### `excerpt` (string)

Short summary displayed in post listings. Keep to 1-2 sentences.

```yaml
excerpt: "Learn how to start your coding journey with Jiki's interactive platform."
```

### `author` (string)

Author key that must exist in `src/authors.json`. During build, this key is expanded to include full author details (name, avatar).

```yaml
author: "jeremy"
```

### `tags` (array of strings)

Category tags for filtering and organization. Use lowercase kebab-case.

```yaml
tags: ["beginners", "getting-started", "tutorial"]
```

### `seo` (object)

SEO metadata for search engines and social sharing.

```yaml
seo:
  description: "Complete guide to starting your coding journey with Jiki"
  keywords: ["learn to code", "jiki", "beginners", "programming"]
```

- **description**: Meta description for search results (150-160 characters ideal)
- **keywords**: Array of SEO keywords

### `featured` (boolean)

Whether this post should be highlighted in featured sections.

```yaml
featured: true
```

### `coverImage` (string)

Path to cover image, relative to the public directory after build.

```yaml
coverImage: "/images/blog/jiki-launch.jpg"
```

Image files should be placed in:

- `images/blog/` for blog posts
- `images/articles/` for articles

## Complete Example

```yaml
---
title: "Getting Started with Jiki"
date: "2025-01-15"
excerpt: "Learn how to start your coding journey with Jiki's interactive platform."
author: "jeremy"
tags: ["beginners", "getting-started", "tutorial"]
seo:
  description: "Complete guide to starting your coding journey with Jiki"
  keywords: ["learn to code", "jiki", "beginners", "programming"]
featured: true
coverImage: "/images/blog/getting-started.jpg"
---
Your markdown content goes here...
```

## Validation Rules

The content package validates all frontmatter at build time:

1. **All required fields must be present**
2. **Field types must match schema** (string, boolean, array, object)
3. **Author key must exist in authors.json**
4. **Date must be valid YYYY-MM-DD format**
5. **Cover image file must exist** in images directory
6. **Tags must be non-empty array** of strings
7. **SEO object must have both description and keywords**

Build will fail if any validation rule is violated.

## Multi-Language Support

Each locale has its own markdown file with its own frontmatter:

```
posts/blog/jiki-is-born/
├── en.md
└── hu.md
```

Each file must have complete frontmatter. Fields like `title`, `excerpt`, and `seo.description` should be translated. Structural fields like `author`, `date`, `featured`, and `coverImage` typically remain the same across locales.

### Example: English vs Hungarian

**en.md:**

```yaml
---
title: "Getting Started with Jiki"
excerpt: "Learn how to start your coding journey."
seo:
  description: "Complete guide to starting with Jiki"
author: "jeremy"
date: "2025-01-15"
---
```

**hu.md:**

```yaml
---
title: "Kezdés a Jikivel"
excerpt: "Tanuld meg, hogyan kezdheted el a kódolási utazásodat."
seo:
  description: "Teljes útmutató a Jiki használatának megkezdéséhez"
author: "jeremy"
date: "2025-01-15"
---
```

## Future Enhancements

Potential frontmatter additions for future consideration:

- `lastUpdated`: Track article revisions
- `readingTime`: Estimated minutes to read
- `relatedPosts`: Array of related post slugs
- `ogImage`: Separate image for Open Graph social sharing
- `draft`: Boolean to hide unpublished content
