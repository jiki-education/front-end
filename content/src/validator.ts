import fs from "fs";
import path from "path";
import type { Frontmatter, AuthorRegistry } from "./types.js";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function validateFrontmatter(
  slug: string,
  frontmatter: unknown,
  authors: AuthorRegistry,
  imagesDir: string
): asserts frontmatter is Frontmatter {
  if (frontmatter === null || typeof frontmatter !== "object") {
    throw new ValidationError(`Post '${slug}' has invalid frontmatter: not an object`);
  }

  const fm = frontmatter as Record<string, unknown>;

  // Validate required fields
  const requiredFields = ["title", "date", "excerpt", "author", "tags", "seo", "featured", "coverImage"];
  for (const field of requiredFields) {
    if (!(field in fm)) {
      throw new ValidationError(`Post '${slug}' missing required frontmatter field: ${field}`);
    }
  }

  // Validate types
  if (typeof fm.title !== "string" || fm.title.trim() === "") {
    throw new ValidationError(`Post '${slug}' has invalid title: must be non-empty string`);
  }

  if (typeof fm.excerpt !== "string" || fm.excerpt.trim() === "") {
    throw new ValidationError(`Post '${slug}' has invalid excerpt: must be non-empty string`);
  }

  if (typeof fm.author !== "string" || fm.author.trim() === "") {
    throw new ValidationError(`Post '${slug}' has invalid author: must be non-empty string`);
  }

  if (typeof fm.featured !== "boolean") {
    throw new ValidationError(`Post '${slug}' has invalid featured: must be boolean`);
  }

  if (typeof fm.coverImage !== "string" || fm.coverImage.trim() === "") {
    throw new ValidationError(`Post '${slug}' has invalid coverImage: must be non-empty string`);
  }

  // Validate date format (YYYY-MM-DD)
  if (typeof fm.date !== "string") {
    throw new ValidationError(`Post '${slug}' has invalid date: must be string`);
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(fm.date)) {
    throw new ValidationError(`Post '${slug}' has invalid date format: '${fm.date}' (expected YYYY-MM-DD)`);
  }

  // Validate it's an actual date
  const dateObj = new Date(fm.date);
  if (isNaN(dateObj.getTime())) {
    throw new ValidationError(`Post '${slug}' has invalid date: '${fm.date}' is not a valid date`);
  }

  // Validate tags
  if (!Array.isArray(fm.tags)) {
    throw new ValidationError(`Post '${slug}' has invalid tags: must be array`);
  }

  if (fm.tags.length === 0) {
    throw new ValidationError(`Post '${slug}' has invalid tags: array cannot be empty`);
  }

  for (const tag of fm.tags) {
    if (typeof tag !== "string" || tag.trim() === "") {
      throw new ValidationError(`Post '${slug}' has invalid tag: must be non-empty string`);
    }
  }

  // Validate SEO
  if (fm.seo === null || fm.seo === undefined || typeof fm.seo !== "object") {
    throw new ValidationError(`Post '${slug}' has invalid seo: must be object`);
  }

  const seo = fm.seo as Record<string, unknown>;

  if (typeof seo.description !== "string" || seo.description.trim() === "") {
    throw new ValidationError(`Post '${slug}' has invalid seo.description: must be non-empty string`);
  }

  if (!Array.isArray(seo.keywords) || seo.keywords.length === 0) {
    throw new ValidationError(`Post '${slug}' has invalid seo.keywords: must be non-empty array`);
  }

  for (const keyword of seo.keywords) {
    if (typeof keyword !== "string" || keyword.trim() === "") {
      throw new ValidationError(`Post '${slug}' has invalid seo.keyword: must be non-empty string`);
    }
  }

  // Validate author exists
  if (!(fm.author in authors)) {
    throw new ValidationError(`Post '${slug}' references unknown author: '${fm.author}'`);
  }

  // Validate cover image exists
  const coverImagePath = fm.coverImage.replace(/^\/images\//, "");
  const coverImageFullPath = path.join(imagesDir, coverImagePath);

  if (!fs.existsSync(coverImageFullPath)) {
    throw new ValidationError(`Post '${slug}' references missing cover image: ${coverImagePath}`);
  }
}

export function validateAuthors(authors: AuthorRegistry, imagesDir: string): void {
  for (const [key, author] of Object.entries(authors)) {
    if (!author.name || typeof author.name !== "string" || author.name.trim() === "") {
      throw new ValidationError(`Author '${key}' has invalid name: must be non-empty string`);
    }

    if (!author.avatar || typeof author.avatar !== "string" || author.avatar.trim() === "") {
      throw new ValidationError(`Author '${key}' has invalid avatar: must be non-empty string`);
    }

    // Validate avatar image exists
    const avatarPath = author.avatar.replace(/^\/images\//, "");
    const avatarFullPath = path.join(imagesDir, avatarPath);

    if (!fs.existsSync(avatarFullPath)) {
      throw new ValidationError(`Author '${key}' references missing avatar: ${avatarPath}`);
    }
  }
}

export function validateNoDuplicateSlugs(slugs: string[]): void {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const slug of slugs) {
    if (seen.has(slug)) {
      duplicates.add(slug);
    }
    seen.add(slug);
  }

  if (duplicates.size > 0) {
    throw new ValidationError(`Duplicate slugs detected: ${Array.from(duplicates).join(", ")}`);
  }
}
