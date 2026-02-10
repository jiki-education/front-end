# Plan: Make Blog & Article Pages Responsive

## Conventions

The codebase uses **desktop-first** `max-width` media queries with two standard breakpoints:

- **1024px** — tablet / small laptop
- **768px** — mobile

Components using CSS Modules already follow this pattern (e.g., `FeaturedLatestPost`, `BlogPostCard`, `PageHeader`, `ArticlesContent`, `FilterSidebar`). We'll follow the same convention everywhere.

---

## Current State Analysis

### Already responsive (no work needed)

| Component              | File                                  | Notes                                                                       |
| ---------------------- | ------------------------------------- | --------------------------------------------------------------------------- |
| PageHeader             | `blog/PageHeader.module.css`          | 768px: title 56→36, subtitle 18→16                                          |
| BlogPage wrapper       | `blog/BlogPage.module.css`            | 768px: padding 40→20px horizontal                                           |
| FeaturedLatestPost     | `blog/FeaturedLatestPost.module.css`  | 1024px: single column, smaller fonts. 768px: further reductions, meta wraps |
| BlogPostCard grid      | `blog/BlogPostCard.module.css`        | 1024px: 3→2 cols. 768px: 1 col, smaller fonts                               |
| ArticlesPage wrapper   | `articles/ArticlesPage.module.css`    | 768px: padding 40→20px horizontal                                           |
| ArticlesContent layout | `articles/ArticlesContent.module.css` | 1024px: sidebar below, gap 64→40. 768px: grid 2→1 col                       |
| FilterSidebar          | `articles/FilterSidebar.module.css`   | 1024px: full-width horizontal. 768px: vertical stack                        |

### Needs responsive work

| Component                | File                                       | Key Issues                                                                                      |
| ------------------------ | ------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| **BlogPostHeader**       | `blog/BlogPostHeader.module.css`           | `padding: 60px 150px`, 2-col grid, 48px title, meta doesn't wrap — **zero media queries**       |
| **BlogPostContent**      | `blog/BlogPostContent.module.css`          | `grid: 1fr 350px`, 48px gap — **zero media queries**                                            |
| **RelatedPosts**         | `blog/RelatedPosts.module.css`             | Fine internally, but parent never stacks it — no changes needed here (fixed by BlogPostContent) |
| **RecentBlogPosts**      | `blog/RecentBlogPosts.tsx`                 | Inline Tailwind: `px-80`, `grid-cols-3`, `gap-32`, `text-36` — **zero responsive classes**      |
| **CTABlock**             | `blog/CTABlock.tsx`                        | Inline Tailwind: `px-80`, `mb-128`, `py-48`, `text-36` — **zero responsive classes**            |
| **ArticleHeader**        | `articles/ArticleHeader.module.css`        | `padding: 60px 150px`, 48px title, meta doesn't wrap — **zero media queries**                   |
| **ArticleDetailContent** | `articles/ArticleDetailContent.module.css` | `grid: 1fr 350px`, 48px gap — **zero media queries**                                            |
| **ArticleCard**          | `articles/ArticleCard.module.css`          | Fine internally, no changes needed (lives in sidebar that gets stacked)                         |
| **Textual content**      | `styles/components/textual-content.css`    | `padding: spacing-60 spacing-80`, no responsive font sizes — **zero media queries**             |

---

## Changes

### Step 1: BlogPostHeader — add media queries

**File**: `components/blog/BlogPostHeader.module.css`

Add at the end:

```css
@media (max-width: 1024px) {
  .articleHeader {
    grid-template-columns: 1fr;
    padding: 48px 40px;
    gap: 32px;
  }

  .articleTitle {
    font-size: 36px;
  }
}

@media (max-width: 768px) {
  .articleHeader {
    padding: 32px 20px;
  }

  .articleTitle {
    font-size: 28px;
  }

  .articleSubtitle {
    font-size: 16px;
  }

  .articleMeta {
    flex-wrap: wrap;
    gap: 12px;
  }
}
```

### Step 2: BlogPostContent — collapse sidebar on mobile

**File**: `components/blog/BlogPostContent.module.css`

Add at the end:

```css
@media (max-width: 1024px) {
  .contentWrapper {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 40px 20px;
  }

  .contentWrapperFull {
    padding: 40px 20px;
  }

  .rightPanel {
    position: static;
  }
}
```

### Step 3: ArticleHeader — add media queries (same as BlogPostHeader but no image column to remove)

**File**: `components/articles/ArticleHeader.module.css`

Add at the end:

```css
@media (max-width: 1024px) {
  .articleHeader {
    padding: 48px 40px;
  }

  .articleTitle {
    font-size: 36px;
  }
}

@media (max-width: 768px) {
  .articleHeader {
    padding: 32px 20px;
  }

  .articleTitle {
    font-size: 28px;
  }

  .articleSubtitle {
    font-size: 16px;
  }

  .articleMeta {
    flex-wrap: wrap;
    gap: 12px;
  }
}
```

### Step 4: ArticleDetailContent — collapse sidebar on mobile

**File**: `components/articles/ArticleDetailContent.module.css`

Add at the end (identical to BlogPostContent):

```css
@media (max-width: 1024px) {
  .contentWrapper {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 40px 20px;
  }

  .contentWrapperFull {
    padding: 40px 20px;
  }

  .rightPanel {
    position: static;
  }
}
```

### Step 5: RecentBlogPosts — add responsive Tailwind classes

**File**: `components/blog/RecentBlogPosts.tsx`

Change the inline classes to add responsive breakpoints:

| Current                   | Change to                                                         |
| ------------------------- | ----------------------------------------------------------------- |
| `px-80`                   | `px-20 md:px-80`                                                  |
| `text-36`                 | `text-24 md:text-36`                                              |
| `mb-32 pt-72`             | `mb-20 pt-40 md:mb-32 md:pt-72`                                   |
| `grid grid-cols-3 gap-32` | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 md:gap-32` |
| `p-32` (on cards)         | `p-20 md:p-32`                                                    |
| `text-24` (card title)    | `text-20 md:text-24`                                              |

### Step 6: CTABlock — add responsive Tailwind classes

**File**: `components/blog/CTABlock.tsx`

**Minimal variant**:
| Current | Change to |
|---------|-----------|
| `py-48` | `py-32 md:py-48` |
| `text-36` | `text-24 md:text-36` |
| `mb-32` | `mb-20 md:mb-32` |
| `px-40` (button) | `px-24 md:px-40` |

**Gradient variant**:
| Current | Change to |
|---------|-----------|
| outer `px-80` | `px-20 md:px-80` |
| outer `mb-128` | `mb-48 md:mb-128` |
| inner `px-80 py-48` | `px-20 py-32 md:px-80 md:py-48` |
| `text-32` | `text-24 md:text-32` |

### Step 7: Textual content — add responsive padding and font sizes

**File**: `app/styles/components/textual-content.css`

Add a media query at the end of `.ui-textual-content`:

```css
@media (max-width: 768px) {
  .ui-textual-content {
    padding: var(--spacing-32) var(--spacing-20) 0 var(--spacing-20);
  }

  .ui-textual-content-large {
    font-size: var(--text-17);

    h2 {
      font-size: var(--text-28);
    }
    h3 {
      font-size: var(--text-22);
    }
  }

  .ui-textual-content-base {
    font-size: var(--text-16);

    h2 {
      font-size: var(--text-24);
    }
    h3 {
      font-size: var(--text-20);
    }
  }
}
```

### Step 8: Typecheck & visual verify

- Run `pnpm typecheck` from monorepo root
- Test on mobile viewport widths (375px, 768px, 1024px) in dev tools

---

## Summary of files to edit

| #   | File                                                  | Type of change                  |
| --- | ----------------------------------------------------- | ------------------------------- |
| 1   | `components/blog/BlogPostHeader.module.css`           | Add media queries               |
| 2   | `components/blog/BlogPostContent.module.css`          | Add media queries               |
| 3   | `components/articles/ArticleHeader.module.css`        | Add media queries               |
| 4   | `components/articles/ArticleDetailContent.module.css` | Add media queries               |
| 5   | `components/blog/RecentBlogPosts.tsx`                 | Add responsive Tailwind classes |
| 6   | `components/blog/CTABlock.tsx`                        | Add responsive Tailwind classes |
| 7   | `app/styles/components/textual-content.css`           | Add media queries               |

No new files needed. All changes are additive (appending media queries or adding Tailwind prefixes).
