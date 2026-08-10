import { cache } from "react";
import { contentIndexHashes, contentStructureHash } from "@/lib/generated/content-hashes";
import { assetsUrl } from "@/lib/server/origin";
import { readArtifactJson } from "@/lib/server/artifacts";
import {
  contentStructurePath,
  contentCopyPath,
  contentCopyPointerPath,
  contentMetaPath,
  contentMetaPointerPath,
  projectCopyPath,
  projectCopyPointerPath
} from "@/lib/assets-paths";
import { createHashResolver } from "@/lib/i18n/catalogPointer";
import { DEFAULT_LOCALE } from "@/lib/locales";
import type { ArticleMeta, BlogPostMeta, GuideMeta, ProjectMeta, TestimonialsData } from "./types";

/**
 * One locale's content metadata: everything the listing pages, the landing page
 * and every piece of SEO metadata need in order to render that locale.
 *
 * ## Why this is fetched rather than imported
 *
 * A single cross-locale blob bundled into the worker and read synchronously
 * would put every listing, every `generateMetadata` and the whole landing page
 * on data fixed at BUILD time. A locale the i18n repo publishes after that
 * build could then serve its post bodies perfectly from R2 and still be
 * invisible in every listing and every sitemap, because the thing that knows
 * the posts exist would ship with the deploy.
 *
 * So it is one content-hashed artifact per locale, resolved through the same
 * pointer every other translated artifact uses, on exactly the same footing as
 * the prose it describes.
 *
 * These accessors are all SERVER side, so they resolve URLs through
 * `lib/server/origin`. Being async is not a reason for an exception: server
 * components fetch.
 */
export interface ContentMeta {
  blog: BlogPostMeta[];
  articles: ArticleMeta[];
  guides: GuideMeta[];
  projects: ProjectMeta[];
  testimonials: TestimonialsData | null;
}

const EMPTY: ContentMeta = {
  blog: [],
  articles: [],
  guides: [],
  projects: [],
  testimonials: null
};

type Entry = Record<string, unknown>;
type Structural = Record<string, Record<string, Entry>>;
type Copy = Record<string, Record<string, Entry>>;

// English's hashes are compiled in; every other locale's are read at runtime
// from their pointers. See lib/i18n/catalogPointer.ts.
const resolveCopyHash = createHashResolver({
  label: "content copy catalog",
  compiledHashes: () => contentIndexHashes.copy,
  pointerPath: (locale) => contentCopyPointerPath(locale),
  resolveUrl: assetsUrl,
  readPointer: readArtifactJson
});

const resolveLocalHash = createHashResolver({
  label: "content metadata index",
  compiledHashes: () => contentIndexHashes.meta,
  pointerPath: (locale) => contentMetaPointerPath(locale),
  resolveUrl: assetsUrl,
  readPointer: readArtifactJson
});

const resolveProjectCopyHash = createHashResolver({
  label: "project copy catalog",
  compiledHashes: () => contentIndexHashes.projects,
  pointerPath: (locale) => projectCopyPointerPath(locale),
  resolveUrl: assetsUrl,
  readPointer: readArtifactJson
});

const fetchJson = readArtifactJson;

/**
 * Merge one type's structure with a locale's copy.
 *
 * A post the locale has no copy for is DROPPED rather than filled in from
 * English: a listing mixing translated and English entries looks like a working
 * page, and that is the failure this split removes. `slug` and `locale` are
 * added back because every consumer expects the flat shape.
 */
function assemble(structure: Structural, copy: Copy, type: string, locale: string): unknown[] {
  const structural = structure[type] ?? {};
  const translated = copy[type] ?? {};
  return Object.keys(translated)
    .filter((slug) => Object.prototype.hasOwnProperty.call(structural, slug))
    .map((slug) => ({ slug, locale, ...structural[slug], ...translated[slug] }));
}

/**
 * The structural half of one project, as the front-end publishes it.
 *
 * Every field is optional because this is a FETCHED artifact: it may have been
 * written by an older deploy than the code reading it, and a listing is not the
 * place to throw over a missing field.
 */
interface ProjectStructure {
  order?: number;
  image?: string;
  livestream?: boolean;
  upcomingStreams?: string[];
  /** Per locale, the episode index the front-end BUILT for that locale. */
  episodes?: Record<string, { count: number; hash: string } | undefined>;
}

/** The translated half, published per locale by the i18n repo. */
interface ProjectCopy {
  title?: string;
  description?: string;
  tags?: string[];
}

/**
 * Merge the projects' structure with a locale's copy, falling back to English.
 *
 * Projects deliberately behave the OPPOSITE way to posts. A post with no
 * translation is dropped, because a listing mixing languages looks like a
 * working page. There are three projects and they are the site's headline
 * feature: dropping one leaves a blank hub, so an untranslated project shows its
 * English copy instead. `english` is that fallback, and it is per FIELD, so a
 * catalog that translates the title but not the tags still renders tags.
 *
 * ## episodesIndexHash
 *
 * Episodes are Markdown this repo renders, so an episode index exists only for
 * locales the FRONT-END built. A locale with translated project copy but no
 * episode index of its own therefore reads the DEFAULT LOCALE's index, and
 * `episodesLocale` records which locale the hash belongs to so `getProject` asks
 * for a path that exists. The alternative, treating a missing index as no
 * episodes, would silently empty a project page the moment its copy was
 * translated.
 */
function assembleProjects(
  structure: Record<string, ProjectStructure>,
  copy: Record<string, ProjectCopy> | null,
  english: Record<string, ProjectCopy> | null,
  locale: string
): ProjectMeta[] {
  return Object.keys(structure).map((slug) => {
    const s = structure[slug];
    // The ONE place project copy is read. `tags` is an array here; if the i18n
    // repo ever publishes it as an ordered object, this is the single edit.
    const merged: ProjectCopy = { ...english?.[slug], ...copy?.[slug] };
    const episodes = s.episodes?.[locale] ?? s.episodes?.[DEFAULT_LOCALE];

    return {
      slug,
      locale,
      order: s.order ?? 0,
      image: s.image ?? "",
      livestream: s.livestream ?? false,
      upcomingStreams: s.upcomingStreams ?? [],
      title: merged.title ?? slug,
      description: merged.description ?? "",
      tags: merged.tags ?? [],
      episodeCount: episodes?.count ?? 0,
      episodesIndexHash: episodes?.hash ?? "",
      episodesLocale: s.episodes?.[locale] ? locale : DEFAULT_LOCALE
    };
  });
}

/**
 * One locale's metadata, or an empty set when the locale has none.
 *
 * Wrapped in React's `cache()` so the several accessors a single page calls
 * share one fetch and one parse per request.
 *
 * A miss resolves to empty rather than to English. Posts have no English
 * fallback, because silently showing English to a reader who asked for
 * another language is the failure this whole split exists to make impossible.
 * `getTestimonials` and the PROJECTS are the two deliberate exceptions, and both
 * say so where they are built: there are three projects and they are the site's
 * headline feature, so an untranslated one shows English rather than vanishing.
 */
export const getContentMeta = cache(async (locale: string): Promise<ContentMeta> => {
  const [copyHash, localHash, projectCopyHash, englishProjectCopyHash] = await Promise.all([
    resolveCopyHash(locale).catch(() => null),
    resolveLocalHash(locale).catch(() => null),
    resolveProjectCopyHash(locale).catch(() => null),
    locale === DEFAULT_LOCALE ? Promise.resolve(null) : resolveProjectCopyHash(DEFAULT_LOCALE).catch(() => null)
  ]);

  // Every artifact in flight at once, so the whole set costs one round trip of
  // depth however many artifacts it grows to.
  const [structure, copy, local, projectCopy, englishProjectCopy] = await Promise.all([
    fetchJson<Structural>(contentStructurePath(contentStructureHash)),
    copyHash ? fetchJson<Copy>(contentCopyPath(locale, copyHash)) : Promise.resolve(null),
    localHash
      ? fetchJson<{ testimonials: TestimonialsData | null }>(contentMetaPath(locale, localHash))
      : Promise.resolve(null),
    projectCopyHash
      ? fetchJson<Record<string, ProjectCopy>>(projectCopyPath(locale, projectCopyHash))
      : Promise.resolve(null),
    englishProjectCopyHash
      ? fetchJson<Record<string, ProjectCopy>>(projectCopyPath(DEFAULT_LOCALE, englishProjectCopyHash))
      : Promise.resolve(null)
  ]);

  // Projects come from the locale-invariant structure, so they survive a locale
  // with no translated posts at all.
  const projectStructure = (structure as { projects?: Record<string, ProjectStructure> } | null)?.projects ?? {};
  const projects = assembleProjects(
    projectStructure,
    projectCopy,
    locale === DEFAULT_LOCALE ? projectCopy : englishProjectCopy,
    locale
  );

  if (!structure || !copy) {
    return { ...EMPTY, projects, testimonials: local?.testimonials ?? null };
  }

  const blog = assemble(structure, copy, "blog", locale) as BlogPostMeta[];
  const articles = assemble(structure, copy, "articles", locale) as ArticleMeta[];
  const guides = assemble(structure, copy, "guides", locale) as GuideMeta[];

  return {
    blog,
    articles,
    guides,
    projects,
    testimonials: local?.testimonials ?? null
  };
});
