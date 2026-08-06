import { curriculumCopyHashes, badgeCopyHashes } from "@/lib/generated/curriculum-copy-hashes";
import { assetsUrl } from "@/lib/assets";
import { curriculumCopyPath, badgeCopyPath } from "@/lib/assets-paths";
import type { VideoSource } from "@/types/lesson";

export interface CurriculumCopy {
  title: string;
  description: string;
  // Present only on video lessons: the video the lesson plays.
  video?: VideoSource;
  // Present only on exercises that have a recorded walkthrough solve.
  walkthroughVideo?: VideoSource;
}

export interface BadgeCopy {
  name: string;
  description: string;
  funFact: string;
}

export type CurriculumCopyCatalog = Record<string, CurriculumCopy>;
export type BadgeCopyCatalog = Record<string, BadgeCopy>;

// Module-level caches, keyed by locale: each catalog is fetched once per locale
// and the same reference is handed to every consumer.
const copyCache = new Map<string, Promise<CurriculumCopyCatalog>>();
const badgeCache = new Map<string, Promise<BadgeCopyCatalog>>();

/**
 * On any miss (no catalog for this locale, or a failed fetch) these resolve to
 * `{}` — no en-fallback — matching the concept and exercise catalogs: an
 * unresolved slug surfaces as the slug itself, the intended loud canary rather
 * than a silent English render.
 */
function fetchCatalog<T>(
  locale: string,
  cache: Map<string, Promise<T>>,
  hashes: Record<string, string>,
  buildPath: (locale: string, hash: string) => string
): Promise<T> {
  const cached = cache.get(locale);
  if (cached !== undefined) {
    return cached;
  }

  // The manifest's index signature claims every key is present, but a locale
  // with no catalog is genuinely absent at runtime.
  const hash = (hashes as Record<string, string | undefined>)[locale];
  if (!hash) {
    const empty = Promise.resolve({} as T);
    cache.set(locale, empty);
    return empty;
  }

  const promise = (async () => {
    try {
      const res = await fetch(assetsUrl(buildPath(locale, hash)));
      if (!res.ok) {
        return {} as T;
      }
      return (await res.json()) as T;
    } catch {
      return {} as T;
    }
  })();
  cache.set(locale, promise);
  return promise;
}

/**
 * Display copy for lessons, exercises and challenges, keyed by slug.
 *
 * They share one collision-free slug namespace, so consumers resolve by slug and
 * never branch on the kind of thing they're rendering.
 *
 * Fetch this as part of a page's existing load phase (alongside its other data),
 * so copy is present on first paint rather than swapping in afterwards.
 */
export function fetchCurriculumCopy(locale: string): Promise<CurriculumCopyCatalog> {
  return fetchCatalog(locale, copyCache, curriculumCopyHashes, curriculumCopyPath);
}

/** Badge display copy, keyed by badge slug. Same loading rule as above. */
export function fetchBadgeCopy(locale: string): Promise<BadgeCopyCatalog> {
  return fetchCatalog(locale, badgeCache, badgeCopyHashes, badgeCopyPath);
}

// The Record's index signature claims every key is present, but a slug absent
// from the catalog (or a locale that has none) is undefined at runtime. Look the
// key up as an own property: these catalogs are parsed JSON, so a plain index
// would reach Object.prototype and resolve a slug like "constructor" to a
// function rather than missing.
function ownEntry<T>(catalog: Record<string, T>, slug: string): T | undefined {
  return Object.prototype.hasOwnProperty.call(catalog, slug) ? catalog[slug] : undefined;
}

/** Resolve one slug's copy, falling back to the slug itself on a miss. */
export function resolveCopy(catalog: CurriculumCopyCatalog, slug: string): CurriculumCopy {
  return ownEntry(catalog, slug) ?? { title: slug, description: "" };
}

/** Resolve one badge's copy, falling back to the slug itself on a miss. */
export function resolveBadgeCopy(catalog: BadgeCopyCatalog, slug: string): BadgeCopy {
  return ownEntry(catalog, slug) ?? { name: slug, description: "", funFact: "" };
}
