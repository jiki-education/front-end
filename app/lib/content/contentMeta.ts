import { cache } from "react";
import { contentIndexHashes } from "@/lib/generated/content-hashes";
import { assetsUrl } from "@/lib/server/origin";
import { contentMetaPath, contentMetaPointerPath } from "@/lib/assets-paths";
import { createHashResolver } from "@/lib/i18n/catalogPointer";
import type { ArticleMeta, BlogPostMeta, GuideMeta, ProjectMeta, TestimonialsData } from "./types";

/**
 * One locale's content metadata: everything the listing pages, the landing page
 * and every piece of SEO metadata need in order to render that locale.
 *
 * ## Why this is fetched rather than imported
 *
 * It used to be `lib/generated/content-meta-server.json`, a single cross-locale
 * blob bundled into the worker and read synchronously. That put every listing,
 * every `generateMetadata` and the whole landing page on data fixed at BUILD
 * time. A locale the i18n repo published afterwards could serve its post bodies
 * perfectly from R2 and still be invisible in every listing and every sitemap,
 * because the thing that knew the posts existed shipped with the deploy.
 *
 * It is now one content-hashed artifact per locale, resolved through the same
 * pointer every other translated artifact uses, so it is on exactly the same
 * footing as the prose it describes.
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
  /** What the listing routes 404 on. A per-locale fact, kept in the locale's own artifact. */
  hasContent: { blog: boolean; articles: boolean; guides: boolean };
}

const EMPTY: ContentMeta = {
  blog: [],
  articles: [],
  guides: [],
  projects: [],
  testimonials: null,
  hasContent: { blog: false, articles: false, guides: false }
};

// English's hash is compiled in; every other locale's is read at runtime from
// its pointer. See lib/i18n/catalogPointer.ts.
const resolveHash = createHashResolver({
  label: "content metadata index",
  compiledHashes: () => contentIndexHashes.meta,
  pointerPath: (locale) => contentMetaPointerPath(locale),
  resolveUrl: assetsUrl
});

/**
 * One locale's metadata, or an empty set when the locale has none.
 *
 * Wrapped in React's `cache()` so the several accessors a single page calls
 * share one fetch and one parse per request.
 *
 * A miss resolves to empty rather than to English. No accessor here has ever
 * had an English fallback (`getTestimonials` is the single deliberate
 * exception, and says so), because silently showing English to a reader who
 * asked for another language is the failure this whole split exists to make
 * impossible.
 */
export const getContentMeta = cache(async (locale: string): Promise<ContentMeta> => {
  let hash: string;
  try {
    hash = await resolveHash(locale);
  } catch {
    return EMPTY;
  }

  try {
    const url = await assetsUrl(contentMetaPath(locale, hash));
    const res = await fetch(url);
    if (!res.ok) {
      return EMPTY;
    }
    return { ...EMPTY, ...((await res.json()) as Partial<ContentMeta>) };
  } catch {
    return EMPTY;
  }
});

/**
 * Whether a locale has any content of one type.
 *
 * Replaces the old `getAvailableLocales`, which answered a cross-locale question
 * ("which locales have blog posts") that only ever had one caller shape: a
 * listing route asking whether to 404. A cross-locale index would need both
 * repos to write one object, breaking the single-writer rule that keeps the two
 * publishers from losing each other's updates. The per-locale question needs no
 * such thing.
 */
export async function hasContent(type: "blog" | "articles" | "guides", locale: string): Promise<boolean> {
  return (await getContentMeta(locale)).hasContent[type];
}
