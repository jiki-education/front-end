// Single source of truth for the content-hashed cache-tree PATHS (the
// `/static/...` portion of every generated asset). Every runtime fetch of a
// cache-tree file builds its path here — nowhere else — so the layout lives in
// exactly one place.
//
// Callers resolve the host separately with `assetsUrl()` (client: lib/assets.ts;
// Server Components: lib/server/origin.ts): prod -> assets.jiki.io, dev -> local.
//
// The build-time generators (scripts/generate-*-cache.js) WRITE these files and
// must emit this exact layout. Scheme: every dimension (locale, language, slug,
// uuid) is a directory, and the leaf is `{kind}-{hash}.{ext}` where kind is
// `index` | `content` | `messages`. Keep the two sides in lockstep.

export type ContentType = "blog" | "articles" | "guides";
export type SearchType = "articles" | "guides";

/**
 * An exercise's cached content is TWO artifacts, split along the axis each one
 * actually varies on: prose by locale, code by programming language. They were
 * one artifact keyed by (slug, locale, language), which duplicated identical
 * code into every locale and, more to the point, made translated instructions
 * impossible to publish without also republishing code the i18n repo does not
 * hold. `code` is a reserved path segment and is never a locale.
 */

/** Prose index for one locale: [{ slug, title, description, proseHash }]. */
export function exerciseIndexPath(locale: string, hash: string): string {
  return `/static/exercises/${locale}/index-${hash}.json`;
}

/** The mutable pointer for a locale's exercise prose index. See `appMessagesPointerPath`. */
export function exerciseIndexPointerPath(locale: string): string {
  return `/static/exercises/${locale}/current.json`;
}

/** One exercise's translated prose for one locale: { instructions }. */
export function exerciseProsePath(slug: string, locale: string, hash: string): string {
  return `/static/exercises/${slug}/${locale}/prose-${hash}.json`;
}

/** Code index for one programming language: { [slug]: hash }. */
export function exerciseCodeIndexPath(language: string, hash: string): string {
  return `/static/exercises/code/${language}/index-${hash}.json`;
}

/** One exercise's code for one programming language: { stub, solution }. */
export function exerciseCodePath(slug: string, language: string, hash: string): string {
  return `/static/exercises/${slug}/code/${language}/code-${hash}.json`;
}

export function exerciseMessagesPath(slug: string, locale: string, hash: string): string {
  return `/static/i18n/exercises/${slug}/${locale}/messages-${hash}.json`;
}

export function levelMessagesPath(locale: string, hash: string): string {
  return `/static/i18n/levels/${locale}/messages-${hash}.json`;
}

/** The mutable pointer for a locale's level catalog. See `appMessagesPointerPath`. */
export function levelMessagesPointerPath(locale: string): string {
  return `/static/i18n/levels/${locale}/current.json`;
}

export function appMessagesPath(locale: string, hash: string): string {
  return `/static/i18n/app/${locale}/messages-${hash}.json`;
}

/**
 * The MUTABLE pointer that names the current hash for a locale's app catalog.
 * Unlike every other path here this one is not content-hashed: it is a stable
 * URL rewritten in place whenever the i18n repo publishes that locale, which is
 * what lets a translation go live without a worker redeploy. See
 * lib/i18n/catalogPointer.ts.
 *
 * Only non-default locales have one. English's hash is compiled into the worker
 * (lib/generated/messages-hashes.ts) and published atomically with the deploy,
 * so the English path performs no runtime lookup at all.
 */
export function appMessagesPointerPath(locale: string): string {
  return `/static/i18n/app/${locale}/current.json`;
}

export function curriculumCopyPath(locale: string, hash: string): string {
  return `/static/i18n/curriculum/${locale}/messages-${hash}.json`;
}

export function badgeCopyPath(locale: string, hash: string): string {
  return `/static/i18n/badges/${locale}/messages-${hash}.json`;
}

export function interpreterMessagesPath(language: string, locale: string, hash: string): string {
  return `/static/i18n/interpreter/${language}/${locale}/messages-${hash}.json`;
}

/**
 * A concept index is TWO artifacts, split along what actually varies.
 *
 * Structure (hierarchy, order, icon, exercise links) comes from English config
 * and is identical in every language, so one object serves them all and the
 * front-end publishes it. Copy (title, description, that locale's content hash)
 * is translated, so it is per-locale and the i18n repo publishes it. The client
 * merges them, which is what lets a locale that exists only in i18n appear in
 * listings and carry SEO metadata without a front-end build.
 */
export function conceptStructurePath(hash: string): string {
  return `/static/concepts/structure-${hash}.json`;
}

export function conceptCopyPath(locale: string, hash: string): string {
  return `/static/concepts/${locale}/copy-${hash}.json`;
}

export function conceptContentPath(slug: string, locale: string, hash: string): string {
  return `/static/concepts/${slug}/${locale}/content-${hash}.html`;
}

export function contentBodyPath(type: ContentType, slug: string, locale: string, hash: string): string {
  return `/static/content/${type}/${slug}/${locale}/content-${hash}.html`;
}

export function projectEpisodesIndexPath(slug: string, locale: string, hash: string): string {
  return `/static/content/projects/${slug}/${locale}/index-${hash}.json`;
}

export function projectEpisodeContentPath(slug: string, uuid: string, locale: string, hash: string): string {
  return `/static/content/projects/${slug}/${uuid}/${locale}/content-${hash}.html`;
}

/**
 * One locale's project copy catalog: `{ [projectSlug]: { title, description, tags } }`.
 *
 * A project's learner-facing copy used to be authored as locale maps inside each
 * project's config.json, which made this repo a second home for translated
 * content. It is now a catalog like any other: English in
 * content/src/posts/projects/messages.json, every other locale published here by
 * the i18n repo. Note the locale sits where a project SLUG sits in the two paths
 * above, so a locale code can never also be a project slug.
 */
export function projectCopyPath(locale: string, hash: string): string {
  return `/static/content/projects/${locale}/meta-${hash}.json`;
}

/** The mutable pointer for a locale's project copy catalog. The i18n repo owns it. */
export function projectCopyPointerPath(locale: string): string {
  return `/static/content/projects/${locale}/current.json`;
}

export function searchIndexPath(type: SearchType, locale: string, hash: string): string {
  return `/static/content/search/${type}/${locale}/index-${hash}.json`;
}

/**
 * Pointers for every remaining per-locale namespace.
 *
 * The rule this file encodes: anything that varies by locale is a
 * content-hashed artifact whose non-English hash is resolved at RUNTIME through
 * a pointer, so publishing a translation never needs a front-end deploy. A
 * namespace with an artifact but no pointer path is a namespace still pinned to
 * the build, which is the whole failure mode this design removes.
 */

/** The mutable pointer for a locale's concept index. */
export function conceptIndexPointerPath(locale: string): string {
  return `/static/concepts/${locale}/current.json`;
}

/** The mutable pointer for a locale's search index of one content type. */
export function searchIndexPointerPath(type: SearchType, locale: string): string {
  return `/static/content/search/${type}/${locale}/current.json`;
}

/** The mutable pointer for a locale's merged curriculum copy catalog. */
export function curriculumCopyPointerPath(locale: string): string {
  return `/static/i18n/curriculum/${locale}/current.json`;
}

/** The mutable pointer for a locale's badge copy catalog. */
export function badgeCopyPointerPath(locale: string): string {
  return `/static/i18n/badges/${locale}/current.json`;
}

/** The mutable pointer for one exercise's message catalog in a locale. */
export function exerciseMessagesPointerPath(slug: string, locale: string): string {
  return `/static/i18n/exercises/${slug}/${locale}/current.json`;
}

/** The mutable pointer for one interpreter's message catalog in a locale. */
export function interpreterMessagesPointerPath(language: string, locale: string): string {
  return `/static/i18n/interpreter/${language}/${locale}/current.json`;
}

/**
 * Post metadata is THREE artifacts, split by what each part is.
 *
 * Structure is locale-invariant (date, author, cover image, flags, all from
 * English config, plus the projects' structure), so the front-end publishes one
 * object for every language. Copy is translated (title, excerpt, seo, tags,
 * reading time, content hash), so the i18n repo publishes it per locale. The
 * third holds testimonials, which are per-locale but authored as JSON rather
 * than as Markdown, so they are not in the corpus i18n mirrors and stay
 * front-end published. Project copy is a fourth, at `projectCopyPath` above.
 */
export function contentStructurePath(hash: string): string {
  return `/static/content/structure-${hash}.json`;
}

export function contentCopyPath(locale: string, hash: string): string {
  return `/static/content/copy/${locale}/copy-${hash}.json`;
}

export function contentCopyPointerPath(locale: string): string {
  return `/static/content/copy/${locale}/current.json`;
}

/** Per-locale testimonials. Front-end published; see above. */
export function contentMetaPath(locale: string, hash: string): string {
  return `/static/content/meta/${locale}/index-${hash}.json`;
}

/** The mutable pointer for a locale's content metadata index. */
export function contentMetaPointerPath(locale: string): string {
  return `/static/content/meta/${locale}/current.json`;
}
