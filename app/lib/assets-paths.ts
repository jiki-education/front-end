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

export function exerciseIndexPath(locale: string, hash: string): string {
  return `/static/exercises/${locale}/index-${hash}.json`;
}

export function exerciseContentPath(slug: string, locale: string, language: string, hash: string): string {
  return `/static/exercises/${slug}/${locale}/${language}/content-${hash}.json`;
}

export function exerciseMessagesPath(slug: string, locale: string, hash: string): string {
  return `/static/i18n/exercises/${slug}/${locale}/messages-${hash}.json`;
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
