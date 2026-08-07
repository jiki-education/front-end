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

export function conceptIndexPath(locale: string, hash: string): string {
  return `/static/concepts/${locale}/index-${hash}.json`;
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

export function searchIndexPath(type: SearchType, locale: string, hash: string): string {
  return `/static/content/search/${type}/${locale}/index-${hash}.json`;
}
