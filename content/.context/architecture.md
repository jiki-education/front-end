# Content Package Architecture

## Package Structure

```
content/
├── package.json              # Package configuration
├── tsconfig.json             # TypeScript config
├── tsconfig.build.json       # Build-specific TS config
├── .prettierrc.json          # Prettier formatting rules
├── .prettierignore           # Prettier ignore patterns
├── eslint.config.mjs         # ESLint configuration
├── scripts/
│   └── pre-commit            # Git pre-commit hook script
├── src/
│   ├── index.ts              # Main exports
│   ├── types.ts              # TypeScript type definitions
│   ├── loader.ts             # Content loading and parsing
│   ├── validator.ts          # Frontmatter validation
│   ├── authors.json          # Author registry
│   └── posts/
│       ├── blog/             # Blog posts (time-based)
│       │   └── [slug]/
│       │       ├── en.md     # English version (required)
│       │       └── hu.md     # Hungarian version (optional)
│       └── articles/         # Articles (evergreen)
│           └── [slug]/
│               ├── en.md
│               └── hu.md
├── images/
│   ├── blog/                 # Blog post images
│   ├── articles/             # Article images
│   └── avatars/              # Author avatars
├── tests/                    # Validation tests
│   ├── validator.test.ts
│   ├── loader.test.ts
│   └── authors.test.ts
└── dist/                     # Build output (generated)
    ├── index.js
    ├── types.d.ts
    └── images/               # Copied images
```

## Content Organization

### Slug-First Structure

Content is organized by slug (post identifier), not by language. Each post lives in its own directory with locale-specific markdown files:

```
posts/blog/jiki-is-born/
├── en.md    # Required
└── hu.md    # Optional
```

This makes it easy to:

- See all translations for a post
- Add new languages without restructuring
- Ensure slug consistency across locales

### English Required

Every post must have an `en.md` file. This serves as:

- The fallback when translations are missing
- The canonical source for validation
- The reference for translators

## Build Process

### 1. Parse Markdown

```typescript
// loader.ts
const content = fs.readFileSync(filePath, "utf-8");
const parsed = matter(content); // gray-matter
```

Extracts frontmatter and content from markdown files.

### 2. Validate Frontmatter

```typescript
// validator.ts
validateFrontmatter(parsed.data);
// - Check required fields
// - Validate types
// - Verify author exists
// - Check image files exist
// - Ensure no duplicate slugs
```

All validation happens at build time to fail fast.

### 3. Expand Author Data

```typescript
// loader.ts
const author = authors[frontmatter.author];
// Replaces author key with full object
```

Author registry in `authors.json` provides name and avatar path.

### 4. Render Markdown

```typescript
// loader.ts
const html = marked.parse(parsed.content);
```

Converts markdown content to HTML using marked.

### 5. Copy Images

```bash
# package.json build script
mkdir -p dist/images && cp -r images/* dist/images/
```

All images are copied to dist for distribution.

### 6. Export Data

```typescript
// index.ts
export function getAllBlogPosts(locale: string): ProcessedPost[];
export function getBlogPost(slug: string, locale: string): ProcessedPost;
```

Exports typed functions for app consumption.

## Data Flow

```
Markdown Files (src/posts/)
    ↓
Parse (gray-matter)
    ↓
Validate (validator.ts)
    ↓
Expand Authors (authors.json)
    ↓
Render HTML (marked)
    ↓
Export Functions (index.ts)
    ↓
App Consumes at Build Time
```

## Type Safety

All data structures are fully typed:

```typescript
interface ProcessedPost {
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

TypeScript ensures compile-time safety between content package and app.

## Validation Strategy

### Build-Time Validation

All validation happens in the content package during `pnpm build`:

- ✅ Frontmatter schema validation
- ✅ Required field checks
- ✅ Author existence verification
- ✅ Image file existence
- ✅ Date format validation
- ✅ No duplicate slugs

### App Trust Model

The app package trusts that content data is valid. No runtime validation occurs in the app - if the content package builds successfully, the data is guaranteed to be correct.

This separation of concerns means:

- Content validation is centralized
- App code is simpler
- Build fails fast if content is invalid
- No runtime performance cost

## Package Dependencies

```
content (standalone - no dependencies on other Jiki packages)
    ↓
app imports @jiki/content at build time
```

The content package is independent and doesn't depend on curriculum or interpreters.

## CI/CD Integration

GitHub Actions workflow at `.github/workflows/content.yml` runs:

- TypeScript type checking
- Prettier format checking
- ESLint
- Test suite

Workflow triggers on changes to `content/**` files.

## Git Hooks

Pre-commit hook in `.husky/pre-commit` detects changes to `content/` and runs:

- TypeScript type check
- Auto-format with Prettier
- ESLint with zero warnings
- Full test suite

This ensures all commits maintain code quality.
