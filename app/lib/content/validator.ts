import fs from "fs";
import path from "path";
import type { Frontmatter, AuthorRegistry } from "./types.js";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export interface BlogConfig {
  date: string;
  author: string;
  featured: boolean;
  coverImage: string;
}

export interface ArticleConfig {
  date: string;
  author: string;
  listed: boolean;
}

export interface GuideConfig {
  date: string;
  coverImage: string;
  premium: boolean;
}

/**
 * Validate common config fields (date, author, featured)
 */
function validateCommonConfigFields(slug: string, cfg: Record<string, unknown>, authors: AuthorRegistry): void {
  // Validate date format (YYYY-MM-DD)
  if (typeof cfg.date !== "string") {
    throw new ValidationError(`Post '${slug}' config.json has invalid date: must be string`);
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(cfg.date)) {
    throw new ValidationError(
      `Post '${slug}' config.json has invalid date format: '${cfg.date}' (expected YYYY-MM-DD)`
    );
  }

  // Validate it's an actual date
  const dateObj = new Date(cfg.date);
  if (isNaN(dateObj.getTime())) {
    throw new ValidationError(`Post '${slug}' config.json has invalid date: '${cfg.date}' is not a valid date`);
  }

  // Validate author
  if (typeof cfg.author !== "string" || cfg.author.trim() === "") {
    throw new ValidationError(`Post '${slug}' config.json has invalid author: must be non-empty string`);
  }

  // Validate author exists
  if (!(cfg.author in authors)) {
    throw new ValidationError(`Post '${slug}' config.json references unknown author: '${cfg.author}'`);
  }

  // Validate featured
  if (typeof cfg.featured !== "boolean") {
    throw new ValidationError(`Post '${slug}' config.json has invalid featured: must be boolean`);
  }
}

/**
 * Validate blog post config.json
 */
export function validateBlogConfig(
  slug: string,
  config: unknown,
  authors: AuthorRegistry,
  imagesDir: string
): asserts config is BlogConfig {
  if (config === null || typeof config !== "object") {
    throw new ValidationError(`Post '${slug}' has invalid config.json: not an object`);
  }

  const cfg = config as Record<string, unknown>;

  // Validate required fields
  const requiredFields = ["date", "author", "featured", "coverImage"];
  for (const field of requiredFields) {
    if (!(field in cfg)) {
      throw new ValidationError(`Post '${slug}' config.json missing required field: ${field}`);
    }
  }

  validateCommonConfigFields(slug, cfg, authors);

  // Validate coverImage
  if (typeof cfg.coverImage !== "string" || cfg.coverImage.trim() === "") {
    throw new ValidationError(`Post '${slug}' config.json has invalid coverImage: must be non-empty string`);
  }

  // Validate cover image exists
  const coverImagePath = cfg.coverImage.replace(/^\/images\//, "").replace(/^\/static\/images\//, "");
  const coverImageFullPath = path.join(imagesDir, coverImagePath);

  if (!fs.existsSync(coverImageFullPath)) {
    throw new ValidationError(`Post '${slug}' config.json references missing cover image: ${coverImagePath}`);
  }
}

/**
 * Validate article config.json
 */
export function validateArticleConfig(
  slug: string,
  config: unknown,
  authors: AuthorRegistry
): asserts config is ArticleConfig {
  if (config === null || typeof config !== "object") {
    throw new ValidationError(`Article '${slug}' has invalid config.json: not an object`);
  }

  const cfg = config as Record<string, unknown>;

  // Validate required fields (no coverImage or featured for articles)
  const requiredFields = ["date", "author", "listed"];
  for (const field of requiredFields) {
    if (!(field in cfg)) {
      throw new ValidationError(`Article '${slug}' config.json missing required field: ${field}`);
    }
  }

  // Validate date format (YYYY-MM-DD)
  if (typeof cfg.date !== "string") {
    throw new ValidationError(`Article '${slug}' config.json has invalid date: must be string`);
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(cfg.date)) {
    throw new ValidationError(
      `Article '${slug}' config.json has invalid date format: '${cfg.date}' (expected YYYY-MM-DD)`
    );
  }

  const dateObj = new Date(cfg.date);
  if (isNaN(dateObj.getTime())) {
    throw new ValidationError(`Article '${slug}' config.json has invalid date: '${cfg.date}' is not a valid date`);
  }

  // Validate author
  if (typeof cfg.author !== "string" || cfg.author.trim() === "") {
    throw new ValidationError(`Article '${slug}' config.json has invalid author: must be non-empty string`);
  }

  if (!(cfg.author in authors)) {
    throw new ValidationError(`Article '${slug}' config.json references unknown author: '${cfg.author}'`);
  }

  // Validate listed
  if (typeof cfg.listed !== "boolean") {
    throw new ValidationError(`Article '${slug}' config.json has invalid listed: must be boolean`);
  }
}

/**
 * Validate guide config.json
 *
 * Guides have a coverImage (like blog posts) and a premium flag, but no author
 * and no `listed`/`featured` fields.
 */
export function validateGuideConfig(slug: string, config: unknown, imagesDir: string): asserts config is GuideConfig {
  if (config === null || typeof config !== "object") {
    throw new ValidationError(`Guide '${slug}' has invalid config.json: not an object`);
  }

  const cfg = config as Record<string, unknown>;

  // Validate required fields (no author, no listed/featured for guides)
  const requiredFields = ["date", "coverImage", "premium"];
  for (const field of requiredFields) {
    if (!(field in cfg)) {
      throw new ValidationError(`Guide '${slug}' config.json missing required field: ${field}`);
    }
  }

  // Validate date format (YYYY-MM-DD)
  if (typeof cfg.date !== "string") {
    throw new ValidationError(`Guide '${slug}' config.json has invalid date: must be string`);
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(cfg.date)) {
    throw new ValidationError(
      `Guide '${slug}' config.json has invalid date format: '${cfg.date}' (expected YYYY-MM-DD)`
    );
  }

  const dateObj = new Date(cfg.date);
  if (isNaN(dateObj.getTime())) {
    throw new ValidationError(`Guide '${slug}' config.json has invalid date: '${cfg.date}' is not a valid date`);
  }

  // Validate premium
  if (typeof cfg.premium !== "boolean") {
    throw new ValidationError(`Guide '${slug}' config.json has invalid premium: must be boolean`);
  }

  // Validate coverImage
  if (typeof cfg.coverImage !== "string" || cfg.coverImage.trim() === "") {
    throw new ValidationError(`Guide '${slug}' config.json has invalid coverImage: must be non-empty string`);
  }

  // Validate cover image exists
  const coverImagePath = cfg.coverImage.replace(/^\/images\//, "").replace(/^\/static\/images\//, "");
  const coverImageFullPath = path.join(imagesDir, coverImagePath);

  if (!fs.existsSync(coverImageFullPath)) {
    throw new ValidationError(`Guide '${slug}' config.json references missing cover image: ${coverImagePath}`);
  }
}

/**
 * Validate markdown frontmatter (translatable fields only)
 * Structural fields (date, author, featured, coverImage) are ignored if present
 */
export function validateFrontmatter(
  slug: string,
  locale: string,
  frontmatter: unknown
): asserts frontmatter is Frontmatter {
  if (frontmatter === null || typeof frontmatter !== "object") {
    throw new ValidationError(`Post '${slug}' (${locale}) has invalid frontmatter: not an object`);
  }

  const fm = frontmatter as Record<string, unknown>;

  // Validate required translatable fields
  const requiredFields = ["title", "excerpt", "tags", "seo"];
  for (const field of requiredFields) {
    if (!(field in fm)) {
      throw new ValidationError(`Post '${slug}' (${locale}) missing required frontmatter field: ${field}`);
    }
  }

  // Validate types
  if (typeof fm.title !== "string" || fm.title.trim() === "") {
    throw new ValidationError(`Post '${slug}' (${locale}) has invalid title: must be non-empty string`);
  }

  if (typeof fm.excerpt !== "string" || fm.excerpt.trim() === "") {
    throw new ValidationError(`Post '${slug}' (${locale}) has invalid excerpt: must be non-empty string`);
  }

  // Validate tags
  if (!Array.isArray(fm.tags)) {
    throw new ValidationError(`Post '${slug}' (${locale}) has invalid tags: must be array`);
  }

  if (fm.tags.length === 0) {
    throw new ValidationError(`Post '${slug}' (${locale}) has invalid tags: array cannot be empty`);
  }

  for (const tag of fm.tags) {
    if (typeof tag !== "string" || tag.trim() === "") {
      throw new ValidationError(`Post '${slug}' (${locale}) has invalid tag: must be non-empty string`);
    }
  }

  // Validate SEO
  if (fm.seo === null || fm.seo === undefined || typeof fm.seo !== "object") {
    throw new ValidationError(`Post '${slug}' (${locale}) has invalid seo: must be object`);
  }

  const seo = fm.seo as Record<string, unknown>;

  if (typeof seo.description !== "string" || seo.description.trim() === "") {
    throw new ValidationError(`Post '${slug}' (${locale}) has invalid seo.description: must be non-empty string`);
  }

  if (!Array.isArray(seo.keywords) || seo.keywords.length === 0) {
    throw new ValidationError(`Post '${slug}' (${locale}) has invalid seo.keywords: must be non-empty array`);
  }

  for (const keyword of seo.keywords) {
    if (typeof keyword !== "string" || keyword.trim() === "") {
      throw new ValidationError(`Post '${slug}' (${locale}) has invalid seo.keyword: must be non-empty string`);
    }
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

// Required locales that must exist for all content
export const REQUIRED_LOCALES = ["en", "hu"] as const;

/**
 * Validate that all required locale files exist for a content item
 */
export function validateRequiredLocales(
  type: "blog" | "article" | "guide" | "episode",
  slug: string,
  slugDir: string,
  existingLocales: string[]
): void {
  const typeLabels: Record<typeof type, string> = {
    blog: "Blog post",
    article: "Article",
    guide: "Guide",
    episode: "Episode"
  };
  for (const locale of REQUIRED_LOCALES) {
    if (!existingLocales.includes(locale)) {
      const expectedFile = path.join(slugDir, `${locale}.md`);
      throw new ValidationError(`${typeLabels[type]} '${slug}' is missing required locale file: ${expectedFile}`);
    }
  }
}

// Project config.json fields that are localized maps (keyed by locale)
export const LOCALIZED_PROJECT_FIELDS = ["title", "description", "tags"] as const;

/**
 * Validate that a project's localized config.json maps (title, description, tags)
 * contain an entry for every required locale.
 *
 * Unlike blog/article/guide posts, a project's translatable copy lives in
 * config.json as `{ en: ..., hu: ... }` maps rather than in per-language md
 * files, so a missing translation cannot be caught by a missing-file check.
 */
export function validateProjectRequiredLocales(slug: string, config: unknown): void {
  if (config === null || typeof config !== "object") {
    throw new ValidationError(`Project '${slug}' has invalid config.json: not an object`);
  }

  const cfg = config as Record<string, unknown>;

  for (const field of LOCALIZED_PROJECT_FIELDS) {
    const map = cfg[field];
    if (map === null || typeof map !== "object" || Array.isArray(map)) {
      throw new ValidationError(
        `Project '${slug}' config.json field '${field}' must be a localized map (e.g. { "en": ..., "hu": ... })`
      );
    }

    for (const locale of REQUIRED_LOCALES) {
      if (!(locale in (map as Record<string, unknown>))) {
        throw new ValidationError(
          `Project '${slug}' config.json field '${field}' is missing required locale: '${locale}'`
        );
      }
    }
  }
}

/**
 * Validate episode summary-block parity across locales.
 *
 * The `summary` frontmatter block (from/to/keyConcepts) is optional, but if the
 * English episode defines one, every required locale must define a well-formed one
 * too, so a translation stub cannot silently drop it.
 *
 * `localeSummaries` maps each existing locale to its parsed frontmatter `summary`
 * value (or undefined when absent).
 */
export function validateEpisodeSummaryParity(slug: string, localeSummaries: Record<string, unknown>): void {
  // Nothing to enforce if the English episode has no summary block.
  if (localeSummaries["en"] === undefined) {
    return;
  }

  for (const locale of REQUIRED_LOCALES) {
    const summary = localeSummaries[locale];
    if (summary === null || summary === undefined || typeof summary !== "object") {
      throw new ValidationError(`Episode '${slug}' (${locale}) is missing required summary block (present in en.md)`);
    }

    const s = summary as Record<string, unknown>;

    if (typeof s.from !== "string" || s.from.trim() === "") {
      throw new ValidationError(`Episode '${slug}' (${locale}) has invalid summary.from: must be non-empty string`);
    }

    if (typeof s.to !== "string" || s.to.trim() === "") {
      throw new ValidationError(`Episode '${slug}' (${locale}) has invalid summary.to: must be non-empty string`);
    }

    if (!Array.isArray(s.keyConcepts) || s.keyConcepts.length === 0) {
      throw new ValidationError(
        `Episode '${slug}' (${locale}) has invalid summary.keyConcepts: must be non-empty array`
      );
    }
  }
}
