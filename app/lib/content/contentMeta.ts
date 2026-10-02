import { cache } from "react";
import { contentIndexHashes, contentStructureHash } from "@/lib/generated/content-hashes";
import { assetsUrl } from "@/lib/server/origin";
import { assetsUrl as publicAssetUrl } from "@/lib/assets";
import { readArtifactJson } from "@/lib/server/artifacts";
import {
  contentStructurePath,
  contentCopyPath,
  contentCopyPointerPath,
  testimonialsCopyPath,
  testimonialsCopyPointerPath
} from "@/lib/assets-paths";
import { createHashResolver } from "@/lib/i18n/catalogPointer";
import type { ArticleMeta, BlogPostMeta, GuideMeta, Testimonial, TestimonialsData } from "./types";

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
  testimonials: TestimonialsData | null;
}

const EMPTY: ContentMeta = {
  blog: [],
  articles: [],
  guides: [],
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

const resolveTestimonialsHash = createHashResolver({
  label: "testimonial copy catalog",
  compiledHashes: () => contentIndexHashes.testimonials,
  pointerPath: (locale) => testimonialsCopyPointerPath(locale),
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
    .map((slug) => withAssetHost({ slug, locale, ...structural[slug], ...translated[slug] }));
}

/**
 * Point a published `/static/...` path at the host that actually serves it.
 *
 * The content cache stores cover images and author avatars as root-relative
 * paths, because the path is what both publishers agree on (see
 * `postImageUrl` in the renderer package). Left as-is they resolve against the
 * app origin, so the Worker serves a file that is sitting on R2 already,
 * fingerprinted and immutable. Resolving it here — once, where the artifact is
 * read — keeps every render site free of asset-host knowledge.
 *
 * `publicAssetUrl` is the SYNC client-side resolver, not the async server one:
 * this URL lands in HTML rather than being fetched, and in development the
 * relative path it returns is exactly what an `<img src>` wants.
 */
function onAssetHost(path: string): string {
  return path.startsWith("/static/") ? publicAssetUrl(path) : path;
}

/**
 * An assembled entry with its asset paths resolved to the asset host.
 *
 * Applied INSIDE the assembler rather than to its results, so no entry can
 * reach a caller with an unresolved path.
 *
 * Every field is read defensively: these come off a FETCHED artifact, possibly
 * written by a different publisher or an older deploy, so an entry with no
 * cover image, or an author with no avatar, is an ordinary runtime state. A
 * field that is absent stays absent rather than becoming undefined, and
 * anything that is not a `/static/` path is left exactly as authored.
 */
function withAssetHost(entry: Entry): Entry {
  const author = entry.author as { avatar?: string } | undefined;
  const avatar = typeof author?.avatar === "string" ? onAssetHost(author.avatar) : undefined;

  return {
    ...entry,
    ...(typeof entry.coverImage === "string" ? { coverImage: onAssetHost(entry.coverImage) } : {}),
    ...(avatar === undefined ? {} : { author: { ...author, avatar } })
  };
}

/** The locale-invariant half of the testimonials, as the front-end publishes it. */
interface TestimonialsStructure {
  // `Partial` rather than a plain Record throughout: these are FETCHED
  // artifacts, possibly written by a different publisher or an older deploy, so
  // a key being absent is an ordinary runtime state and the types say so.
  people?: Partial<Record<string, { name?: string; image?: string }>>;
  quotes?: Partial<Record<string, { person?: string }>>;
  landing?: { primary?: string; quotes?: string[] };
  page?: string[];
}

/** The translated half, published per locale by the i18n repo. */
interface TestimonialsCopy {
  heading?: string;
  subheading?: string;
  roles?: Partial<Record<string, string>>;
  quotes?: Partial<Record<string, string>>;
  marquee?: string[];
}

/**
 * Merge the testimonials' structure with a locale's copy.
 *
 * A quote the locale has not translated is DROPPED, exactly as a post is: the
 * grid shows fewer cards rather than one English card among
 * translated ones. If the whole catalog is missing the result is null and the
 * landing section and the /testimonials page render nothing at all. Neither
 * outcome ever reaches for English, which is the entire point.
 *
 * The join is by KEY, in the order the structure lists, so a translator moving
 * an entry in their catalog cannot reorder the page and a translation missing
 * one entry cannot silently shift every attribution by one.
 */
export function assembleTestimonials(
  structure: TestimonialsStructure | undefined,
  copy: TestimonialsCopy | null
): TestimonialsData | null {
  if (!structure || !copy || !copy.heading || !copy.subheading) {
    return null;
  }

  const people = structure.people ?? {};
  const quoteMeta = structure.quotes ?? {};
  const roles = copy.roles ?? {};
  const words = copy.quotes ?? {};

  const build = (key: string): Testimonial | null => {
    const text = words[key];
    const personSlug = quoteMeta[key]?.person ?? "";
    const person = people[personSlug];
    if (typeof text !== "string" || text === "" || !person) {
      return null;
    }
    return {
      slug: key,
      name: person.name ?? "",
      role: roles[personSlug] ?? "",
      image: person.image ?? "",
      text
    };
  };

  const primary = build(structure.landing?.primary ?? "");
  if (!primary) {
    return null;
  }

  const collect = (keys: string[] | undefined) =>
    (keys ?? []).map(build).filter((entry): entry is Testimonial => entry !== null);

  return {
    heading: copy.heading,
    subheading: copy.subheading,
    primary,
    quotes: collect(structure.landing?.quotes),
    page: collect(structure.page),
    marquee: copy.marquee ?? []
  };
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
 * locale is complete before it is served or it is not served at all. There are
 * no exceptions and no place left to add one.
 */
export const getContentMeta = cache(async (locale: string): Promise<ContentMeta> => {
  const [copyHash, testimonialsHash] = await Promise.all([
    resolveCopyHash(locale).catch(() => null),
    resolveTestimonialsHash(locale).catch(() => null)
  ]);

  // Every artifact in flight at once, so the whole set costs one round trip of
  // depth however many artifacts it grows to.
  const [structure, copy, testimonialsCopy] = await Promise.all([
    fetchJson<Structural>(contentStructurePath(contentStructureHash)),
    copyHash ? fetchJson<Copy>(contentCopyPath(locale, copyHash)) : Promise.resolve(null),
    testimonialsHash
      ? fetchJson<TestimonialsCopy>(testimonialsCopyPath(locale, testimonialsHash))
      : Promise.resolve(null)
  ]);

  if (!structure) {
    return EMPTY;
  }

  const testimonials = assembleTestimonials(
    (structure as { testimonials?: TestimonialsStructure }).testimonials,
    testimonialsCopy
  );

  if (!copy) {
    return { ...EMPTY, testimonials };
  }

  const blog = assemble(structure, copy, "blog", locale) as BlogPostMeta[];
  const articles = assemble(structure, copy, "articles", locale) as ArticleMeta[];
  const guides = assemble(structure, copy, "guides", locale) as GuideMeta[];

  return {
    blog,
    articles,
    guides,
    testimonials
  };
});
