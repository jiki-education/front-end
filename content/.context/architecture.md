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
│       │       └── xx.md     # Translation (optional, where xx is locale code)
│       └── articles/         # Articles (evergreen)
│           └── [slug]/
│               ├── en.md
│               └── xx.md     # Translation (optional)
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
└── xx.md    # Optional (where xx is locale code like hu, de, ja, etc.)
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

### 2. Expand Author Data

```typescript
// loader.ts
const author = authors[frontmatter.author];
// Replaces author key with full object
```

Author registry in `authors.json` provides name and avatar path.

### 3. Render Markdown

```typescript
// loader.ts
const html = marked.parse(parsed.content);
```

Converts markdown content to HTML using marked.

### 4. Copy Images

```bash
# package.json build script
mkdir -p dist/images && cp -r images/* dist/images/
```

All images are copied to dist for distribution.

### 5. Export Data

```typescript
// index.ts
export function getAllBlogPosts(locale: string): ProcessedPost[];
export function getBlogPost(slug: string, locale: string): ProcessedPost;
```

Exports typed functions for app consumption.

**Note**: Validation is NOT part of the build process - it happens only in tests.

## Data Flow

### Build Flow

```
Markdown Files (src/posts/)
    ↓
Parse (gray-matter)
    ↓
Expand Authors (authors.json)
    ↓
Render HTML (marked)
    ↓
Export Functions (index.ts)
    ↓
App Consumes at Build Time
```

### Test Flow (Separate)

```
Markdown Files (src/posts/)
    ↓
Tests Read Files
    ↓
Validate (validator.ts)
    ↓
Pass/Fail Tests
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

### Test-Only Validation

All validation happens exclusively in the test suite (`tests/content-validation.test.ts` and `tests/validator.test.ts`):

- ✅ Frontmatter schema validation
- ✅ Required field checks
- ✅ Author existence verification
- ✅ Image file existence
- ✅ Date format validation
- ✅ No duplicate slugs

The loader (`src/loader.ts`) does NOT perform validation - it simply parses and returns data.

### App Trust Model

The app package trusts that content data is valid because:

1. Tests validate all content before commits (pre-commit hook)
2. CI validates all content before merging PRs
3. No invalid content can enter the repository

This separation of concerns means:

- Content validation is centralized in tests
- Loader and app code are simpler
- Tests fail fast if content is invalid
- Zero build and runtime performance cost for validation

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
