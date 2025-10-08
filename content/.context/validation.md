# Content Validation

## Overview

All content validation happens at build time in the content package. The app package trusts that if the content builds successfully, all data is valid and safe to use.

## Validation Rules

### 1. English Required

Every post must have an `en.md` file. This serves as:

- The fallback locale
- The canonical source for slugs
- The reference for translators

**Error**: Build fails if no `en.md` exists for a post.

### 2. Frontmatter Schema

All required frontmatter fields must be present and correctly typed:

```typescript
{
  title: string;
  date: string;           // YYYY-MM-DD format
  excerpt: string;
  author: string;         // Must exist in authors.json
  tags: string[];         // Non-empty array
  seo: {
    description: string;
    keywords: string[];
  };
  featured: boolean;
  coverImage: string;     // Must exist in images/
}
```

**Error**: Build fails if any field is missing, wrong type, or empty.

### 3. Date Format

Dates must match `YYYY-MM-DD` format:

- ✅ `2025-01-15`
- ❌ `01/15/2025`
- ❌ `15-01-2025`
- ❌ `2025-1-5` (missing leading zeros)

**Error**: Build fails if date format is invalid.

### 4. Author Existence

The `author` field must be a key that exists in `src/authors.json`:

```json
{
  "jeremy": {
    "name": "Jeremy Walker",
    "avatar": "/images/avatars/jeremy.jpg"
  }
}
```

If frontmatter has `author: "jeremy"`, the key must exist.

**Error**: Build fails if author key not found in authors.json.

### 5. Image Files

Cover images must exist in the `images/` directory:

```yaml
coverImage: "/images/blog/jiki-launch.jpg"
```

The validator checks that `images/blog/jiki-launch.jpg` exists.

**Error**: Build fails if image file not found.

### 6. Author Avatars

All author avatars referenced in `authors.json` must exist:

```json
{
  "jeremy": {
    "name": "Jeremy Walker",
    "avatar": "/images/avatars/jeremy.jpg"
  }
}
```

The validator checks that `images/avatars/jeremy.jpg` exists.

**Error**: Build fails if avatar file not found.

### 7. No Duplicate Slugs

Each post slug must be unique across all content types:

```
posts/blog/jiki-is-born/       ✅
posts/articles/jiki-is-born/   ❌ Duplicate slug
```

**Error**: Build fails if duplicate slug detected.

### 8. Tag Validation

Tags must be:

- Non-empty array
- All strings
- No empty strings

```yaml
tags: ["beginners", "tutorial"]  ✅
tags: []                          ❌ Empty array
tags: ["beginners", ""]           ❌ Empty string
tags: [123, "tutorial"]           ❌ Non-string
```

**Error**: Build fails if tag validation fails.

## Validation Implementation

### Test-Driven Validation

All validation rules are tested in `tests/validator.test.ts`:

```typescript
describe("Validator", () => {
  it("should reject post without en.md", () => {
    // Test implementation
  });

  it("should reject invalid date format", () => {
    // Test implementation
  });

  it("should reject missing author", () => {
    // Test implementation
  });

  // ... more tests
});
```

### Build-Time Execution

The `pnpm build` command runs validation before compiling:

```bash
pnpm run build
# 1. Run validator.ts
# 2. If validation fails, exit with error
# 3. If validation passes, continue with compilation
```

### Pre-Commit Hook

The git pre-commit hook runs tests (including validation) before allowing commits:

```bash
scripts/pre-commit
# Runs: pnpm test
# Includes all validator tests
```

## Error Messages

Validation errors should be clear and actionable:

**Good Error Messages:**

```
❌ Post 'getting-started' missing required frontmatter field: author
❌ Post 'jiki-is-born' has invalid date format: '01-15-2025' (expected YYYY-MM-DD)
❌ Author 'katrina' not found in authors.json
❌ Cover image not found: images/blog/missing.jpg
❌ Duplicate slug detected: 'jiki-is-born' in both blog and articles
```

**Bad Error Messages:**

```
❌ Validation failed
❌ Invalid frontmatter
❌ Error in post
```

## Extending Validation

When adding new frontmatter fields:

1. Add field to TypeScript interface in `src/types.ts`
2. Add validation rule in `src/validator.ts`
3. Add test case in `tests/validator.test.ts`
4. Update this documentation

## Performance Considerations

Validation runs once at build time, not at runtime:

- **Build time**: ~100-500ms for validation (depending on content volume)
- **Runtime**: 0ms (no validation in app)

This trade-off ensures:

- Fast runtime performance
- Guaranteed data integrity
- Early error detection
- Simpler app code

## Skipping Validation (Not Recommended)

In extreme cases, validation can be skipped with an environment variable:

```bash
SKIP_VALIDATION=true pnpm build
```

⚠️ **Warning**: Only use this for debugging. Never deploy without validation.
