import { curriculumCopyHashes, badgeCopyHashes } from "@/lib/generated/curriculum-copy-hashes";
import { assetsUrl } from "@/lib/assets";
import { curriculumCopyPath, curriculumCopyPointerPath, badgeCopyPath, badgeCopyPointerPath } from "@/lib/assets-paths";
import { createHashResolver } from "@/lib/i18n/catalogPointer";

/**
 * Display copy for one curriculum item.
 *
 * No video, deliberately. The i18n repo republishes this catalog for every
 * non-English locale and builds each entry as a closed literal, so a video field
 * here would be present in English and silently absent everywhere else. Videos
 * come from the front-end-owned index in `lib/api/videos.ts`.
 */
export interface CurriculumCopy {
  title: string;
  description: string;
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

const resolveCurriculumHash = createHashResolver({
  label: "curriculum copy catalog",
  compiledHashes: () => curriculumCopyHashes,
  pointerPath: (locale) => curriculumCopyPointerPath(locale),
  resolveUrl: assetsUrl
});

const resolveBadgeHash = createHashResolver({
  label: "badge copy catalog",
  compiledHashes: () => badgeCopyHashes,
  pointerPath: (locale) => badgeCopyPointerPath(locale),
  resolveUrl: assetsUrl
});
const badgeCache = new Map<string, Promise<BadgeCopyCatalog>>();

/**
 * On any miss (no catalog for this locale, or a failed fetch) these resolve to
 * `{}` — no en-fallback — matching the concept and exercise catalogs: an
 * unresolved slug surfaces as the slug itself, the intended loud canary rather
 * than a silent English render.
 */
async function fetchCatalog<T>(
  locale: string,
  cache: Map<string, Promise<T>>,
  resolveHash: (locale: string) => Promise<string>,
  buildPath: (locale: string, hash: string) => string
): Promise<T> {
  // English's hash is compiled in; every other locale's comes from its pointer,
  // so a catalog the i18n repo republishes is picked up without a deploy.
  let hash: string;
  try {
    hash = await resolveHash(locale);
  } catch {
    return {} as T;
  }

  // Keyed by hash as well as locale, so a republished catalog is a new key
  // rather than one pinned for the isolate's lifetime.
  const key = `${locale}:${hash}`;
  const cached = cache.get(key);
  if (cached !== undefined) {
    return cached;
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
  cache.set(key, promise);
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
  return fetchCatalog(locale, copyCache, resolveCurriculumHash, curriculumCopyPath);
}

/** Badge display copy, keyed by badge slug. Same loading rule as above. */
export function fetchBadgeCopy(locale: string): Promise<BadgeCopyCatalog> {
  return fetchCatalog(locale, badgeCache, resolveBadgeHash, badgeCopyPath);
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
