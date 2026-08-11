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

/**
 * Validate that a content item has its English source file.
 *
 * English is the only locale authored in this repo; translations live in the
 * i18n repo. `existingLocales` is the set of locales the item's md files
 * provide, with source.md counting as "en".
 */
export function validateEnglishSource(
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
  if (!existingLocales.includes("en")) {
    const expectedFile = path.join(slugDir, "source.md");
    throw new ValidationError(`${typeLabels[type]} '${slug}' is missing its English source file: ${expectedFile}`);
  }
}

// A project's learner-facing copy: the fields projects/messages.json carries and
// the i18n repo translates. `tags` is an ARRAY of strings; everything else is a
// string.
export const PROJECT_COPY_FIELDS = ["title", "description", "tags"] as const;

/**
 * Validate a project's config.json holds structure ONLY.
 *
 * The copy fields do not belong here, and are not merely absent: they are
 * rejected. A locale-keyed `title` map in a project's config.json would make
 * this repo a second home for translated content, and it would be read by
 * nothing while quietly looking like the place to translate.
 */
export function validateProjectConfigIsStructural(slug: string, config: unknown): void {
  if (config === null || typeof config !== "object" || Array.isArray(config)) {
    throw new ValidationError(`Project '${slug}' has invalid config.json: not an object`);
  }

  const cfg = config as Record<string, unknown>;

  for (const field of PROJECT_COPY_FIELDS) {
    if (field in cfg) {
      throw new ValidationError(
        `Project '${slug}' config.json must not contain '${field}': learner-facing copy lives in projects/messages.json`
      );
    }
  }
}

/**
 * Validate the English project copy catalog (posts/projects/messages.json).
 *
 * English is the only locale authored in this repo; every translation of this
 * catalog is published by the i18n repo. `slugs` is the project list from
 * projects/config.json, so an entry either side of it is an error: a project
 * with no copy renders a slug, and copy for no project is dead weight nothing
 * will ever validate against.
 */
export function validateProjectCopyCatalog(catalog: unknown, slugs: string[]): void {
  if (catalog === null || typeof catalog !== "object" || Array.isArray(catalog)) {
    throw new ValidationError(`Invalid projects/messages.json: not an object`);
  }

  const entries = catalog as Record<string, unknown>;

  for (const slug of slugs) {
    const entry = entries[slug];
    if (entry === null || typeof entry !== "object" || Array.isArray(entry)) {
      throw new ValidationError(`projects/messages.json is missing an entry for project '${slug}'`);
    }

    const copy = entry as Record<string, unknown>;

    for (const field of ["title", "description"] as const) {
      const value = copy[field];
      if (typeof value !== "string" || value.trim() === "") {
        throw new ValidationError(`Project '${slug}' messages.json field '${field}' must be a non-empty string`);
      }
    }

    const tags = copy.tags;
    if (!Array.isArray(tags) || tags.some((tag) => typeof tag !== "string" || tag.trim() === "")) {
      throw new ValidationError(`Project '${slug}' messages.json field 'tags' must be an array of non-empty strings`);
    }
  }

  const unknown = Object.keys(entries).filter((slug) => !slugs.includes(slug));
  if (unknown.length > 0) {
    throw new ValidationError(`projects/messages.json has entries for unknown projects: ${unknown.join(", ")}`);
  }
}

/**
 * Validate an episode's summary block.
 *
 * The `summary` frontmatter block (from/to/keyConcepts) is optional, but when
 * source.md defines one it must be well formed. `summary` is the parsed
 * frontmatter value, or undefined when absent.
 */
export function validateEpisodeSummary(slug: string, summary: unknown): void {
  if (summary === undefined) {
    return;
  }

  if (summary === null || typeof summary !== "object" || Array.isArray(summary)) {
    throw new ValidationError(`Episode '${slug}' has invalid summary: must be an object`);
  }

  const s = summary as Record<string, unknown>;

  if (typeof s.from !== "string" || s.from.trim() === "") {
    throw new ValidationError(`Episode '${slug}' has invalid summary.from: must be non-empty string`);
  }

  if (typeof s.to !== "string" || s.to.trim() === "") {
    throw new ValidationError(`Episode '${slug}' has invalid summary.to: must be non-empty string`);
  }

  if (!Array.isArray(s.keyConcepts) || s.keyConcepts.length === 0) {
    throw new ValidationError(`Episode '${slug}' has invalid summary.keyConcepts: must be non-empty array`);
  }
}

/**
 * Validate the testimonials' two halves against each other.
 *
 * `structure` is content/src/testimonials/structure.json, which is
 * locale-invariant: who said each quote, which avatar file is theirs, and the
 * order the landing section and the /testimonials page show them in. `copy` is
 * content/src/testimonials/messages.json, the ENGLISH catalog; every other
 * locale's is published by the i18n repo and validated over there.
 *
 * The checks that matter are the JOIN: every key an ordered list names must be a
 * real quote, every quote must belong to a real person, and English must have
 * words for all of them. A dangling key is the failure this split can introduce
 * and the one thing neither half can catch alone. Roles are deliberately NOT
 * required: two people genuinely have none.
 */
export function validateTestimonials(structure: unknown, copy: unknown): void {
  if (structure === null || typeof structure !== "object" || Array.isArray(structure)) {
    throw new ValidationError("Testimonials structure.json must be an object");
  }
  if (copy === null || typeof copy !== "object" || Array.isArray(copy)) {
    throw new ValidationError("Testimonials messages.json must be an object");
  }

  const s = structure as Record<string, unknown>;
  const c = copy as Record<string, unknown>;

  for (const field of ["heading", "subheading"] as const) {
    const value = c[field];
    if (typeof value !== "string" || value.trim() === "") {
      throw new ValidationError(`Testimonials messages.json has invalid ${field}: must be a non-empty string`);
    }
  }

  const subheading = c.subheading as string;
  if (!subheading.includes("<link>") || !subheading.includes("</link>")) {
    throw new ValidationError("Testimonials messages.json subheading must contain a <link>…</link> span");
  }

  const asRecord = (value: unknown, what: string): Record<string, unknown> => {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError(`Testimonials ${what} must be an object`);
    }
    return value as Record<string, unknown>;
  };

  const people = asRecord(s.people, "structure.json people");
  for (const [slug, person] of Object.entries(people)) {
    const p = asRecord(person, `structure.json people.${slug}`);
    for (const field of ["name", "image"] as const) {
      const value = p[field];
      if (typeof value !== "string" || value.trim() === "") {
        throw new ValidationError(`Testimonials person '${slug}' has an invalid ${field}`);
      }
    }
  }

  const quotes = asRecord(s.quotes, "structure.json quotes");
  const words = asRecord(c.quotes, "messages.json quotes");

  for (const [key, meta] of Object.entries(quotes)) {
    const person = asRecord(meta, `structure.json quotes.${key}`).person;
    if (typeof person !== "string" || !(person in people)) {
      throw new ValidationError(`Testimonials quote '${key}' names an unknown person: '${String(person)}'`);
    }
    const text: unknown = words[key];
    if (typeof text !== "string" || text.trim() === "") {
      throw new ValidationError(`Testimonials quote '${key}' has no English text in messages.json`);
    }
  }

  for (const key of Object.keys(words)) {
    if (!(key in quotes)) {
      throw new ValidationError(
        `Testimonials messages.json has text for '${key}', which structure.json does not define`
      );
    }
  }

  const roles = asRecord(c.roles ?? {}, "messages.json roles");
  for (const slug of Object.keys(roles)) {
    if (!(slug in people)) {
      throw new ValidationError(`Testimonials messages.json has a role for unknown person '${slug}'`);
    }
  }

  const landing = asRecord(s.landing, "structure.json landing");
  const named = (key: unknown, where: string) => {
    if (typeof key !== "string" || !(key in quotes)) {
      throw new ValidationError(`Testimonials ${where} names an unknown quote: '${String(key)}'`);
    }
  };

  named(landing.primary, "landing.primary");

  for (const [where, list] of [
    ["landing.quotes", landing.quotes],
    ["page", s.page]
  ] as const) {
    if (!Array.isArray(list) || list.length === 0) {
      throw new ValidationError(`Testimonials structure.json ${where} must be a non-empty array`);
    }
    const seen = new Set<string>();
    for (const key of list) {
      named(key, where);
      if (seen.has(key as string)) {
        throw new ValidationError(`Testimonials structure.json ${where} lists '${String(key)}' twice`);
      }
      seen.add(key as string);
    }
  }

  if (!Array.isArray(c.marquee) || c.marquee.length === 0) {
    throw new ValidationError("Testimonials messages.json marquee must be a non-empty array");
  }
  for (const blurb of c.marquee) {
    if (typeof blurb !== "string" || blurb.trim() === "") {
      throw new ValidationError("Testimonials messages.json marquee entries must be non-empty strings");
    }
  }
}
