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
import type { ArticleMeta, BlogPostMeta, EpisodeMeta, GuideMeta, ProjectMeta, TestimonialsData } from "./types";

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
  /** Every project's episodes for this locale, flat and ordered. */
  episodes: EpisodeMeta[];
  testimonials: TestimonialsData | null;
}

const EMPTY: ContentMeta = {
  blog: [],
  articles: [],
  guides: [],
  projects: [],
  episodes: [],
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
}

/** The translated half, published per locale by the i18n repo. */
interface ProjectCopy {
  title?: string;
  description?: string;
  tags?: string[];
}

/**
 * Merge the projects' structure with a locale's copy.
 *
 * A project the locale has no copy for is DROPPED, exactly as a post is. A
 * locale is complete before it is served, so an untranslated project is a gap to
 * report rather than a hole to paper over, and English copy under a Hungarian
 * URL is the failure this whole split exists to make impossible.
 *
 * `episodeCount` is counted from `episodes`, the same assembled list the project
 * page renders, so a project can never advertise episodes a reader cannot read.
 */
function assembleProjects(
  structure: Record<string, ProjectStructure>,
  copy: Record<string, ProjectCopy> | null,
  episodes: EpisodeMeta[],
  locale: string
): ProjectMeta[] {
  const counts = new Map<string, number>();
  for (const episode of episodes) {
    counts.set(episode.project, (counts.get(episode.project) ?? 0) + 1);
  }

  return Object.keys(copy ?? {})
    .filter((slug) => Object.prototype.hasOwnProperty.call(structure, slug))
    .map((slug) => {
      const s = structure[slug];
      // The ONE place project copy is read. `tags` is an array here; if the i18n
      // repo ever publishes it as an ordered object, this is the single edit.
      const c = copy?.[slug] ?? {};

      return {
        slug,
        locale,
        order: s.order ?? 0,
        image: s.image ?? "",
        livestream: s.livestream ?? false,
        upcomingStreams: s.upcomingStreams ?? [],
        title: c.title ?? slug,
        description: c.description ?? "",
        tags: c.tags ?? [],
        episodeCount: counts.get(slug) ?? 0
      };
    });
}

/**
 * Merge every episode's structure with a locale's copy.
 *
 * Both halves are keyed by the two-part slug `<project>/<uuid>`, which is the
 * coordinate the i18n repo publishes an episode under. That key is a join key
 * and nothing else: `EpisodeMeta.slug` is the episode's own slug, off the
 * structure, because it is what the URL uses.
 *
 * An episode the locale has no copy for is dropped like any other post. The
 * project it belongs to then shows a smaller `episodeCount`, or none at all,
 * which is the honest reading of a locale that has not translated it.
 */
function assembleEpisodes(structure: Structural, copy: Copy, locale: string): EpisodeMeta[] {
  const structural = structure["project-episodes"] ?? {};
  const translated = copy["project-episodes"] ?? {};

  // `summary`, `tags` and `readingTime` default here rather than at every read
  // site: an artifact written by a different publisher, or by an older deploy,
  // may carry none of them, and a listing is not the place to throw.
  const episodes = Object.keys(translated)
    .filter((key) => Object.prototype.hasOwnProperty.call(structural, key))
    .map((key) => ({
      locale,
      summary: null,
      tags: [],
      readingTime: 0,
      ...structural[key],
      ...translated[key]
    })) as unknown as EpisodeMeta[];

  return episodes.sort((a, b) => a.order - b.order);
}

/**
 * One locale's metadata, or an empty set when the locale has none.
 *
 * Wrapped in React's `cache()` so the several accessors a single page calls
 * share one fetch and one parse per request.
 *
 * A miss resolves to empty rather than to English. There is no English fallback
 * anywhere here: silently showing English to a reader who asked for another
 * language is the failure this whole split exists to make impossible, and a
 * locale is complete before it is served or it is not served at all.
 * `getTestimonials` is the one remaining exception, and it says so where it is
 * built.
 */
export const getContentMeta = cache(async (locale: string): Promise<ContentMeta> => {
  const [copyHash, localHash, projectCopyHash] = await Promise.all([
    resolveCopyHash(locale).catch(() => null),
    resolveLocalHash(locale).catch(() => null),
    resolveProjectCopyHash(locale).catch(() => null)
  ]);

  // Every artifact in flight at once, so the whole set costs one round trip of
  // depth however many artifacts it grows to.
  const [structure, copy, local, projectCopy] = await Promise.all([
    fetchJson<Structural>(contentStructurePath(contentStructureHash)),
    copyHash ? fetchJson<Copy>(contentCopyPath(locale, copyHash)) : Promise.resolve(null),
    localHash
      ? fetchJson<{ testimonials: TestimonialsData | null }>(contentMetaPath(locale, localHash))
      : Promise.resolve(null),
    projectCopyHash
      ? fetchJson<Record<string, ProjectCopy>>(projectCopyPath(locale, projectCopyHash))
      : Promise.resolve(null)
  ]);

  if (!structure) {
    return { ...EMPTY, testimonials: local?.testimonials ?? null };
  }

  // Episodes are assembled before projects, because a project's episode count is
  // the length of its share of this list.
  const episodes = copy ? assembleEpisodes(structure, copy, locale) : [];

  const projectStructure = (structure as { projects?: Record<string, ProjectStructure> }).projects ?? {};
  const projects = assembleProjects(projectStructure, projectCopy, episodes, locale);

  if (!copy) {
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
    episodes,
    testimonials: local?.testimonials ?? null
  };
});
