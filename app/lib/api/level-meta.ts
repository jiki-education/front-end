import { levelMessageHashes } from "@/lib/generated/level-message-hashes";
import { assetsUrl } from "@/lib/assets";
import { levelMessagesPath, levelMessagesPointerPath } from "@/lib/assets-paths";
import { createHashResolver } from "@/lib/i18n/catalogPointer";

export interface LevelMessages {
  title: string;
}

export type LevelMessageCatalog = Record<string, LevelMessages>;

// Module-level cache, keyed `${locale}:${hash}`: the persistent app fetches each
// catalog once and hands the same reference to every consumer. Keying on the hash
// rather than the locale is what lets a republished locale be picked up without a
// reload — the new hash is simply a new key.
const levelMessagesCache = new Map<string, Promise<LevelMessageCatalog>>();

// English's hash is compiled in; every other locale's is read at runtime from
// its pointer, so a level catalog published by the i18n repo goes live without a
// front-end rebuild. See lib/i18n/catalogPointer.ts.
const resolveHash = createHashResolver({
  label: "level catalog",
  compiledHashes: () => levelMessageHashes,
  pointerPath: levelMessagesPointerPath,
  resolveUrl: assetsUrl
});

/**
 * Fetch the curriculum-owned level display strings for one locale.
 *
 * On any miss (no catalog for this locale, no pointer, or a failed fetch) this
 * resolves to `{}` — no en-fallback — matching the exercise and interpreter
 * catalogs: an unresolved level surfaces as its id, the intended loud canary
 * rather than a silent English render.
 */
export async function fetchLevelMessages(locale: string): Promise<LevelMessageCatalog> {
  let hash: string;
  try {
    hash = await resolveHash(locale);
  } catch {
    return {};
  }

  const key = `${locale}:${hash}`;
  const cached = levelMessagesCache.get(key);
  if (cached !== undefined) {
    return cached;
  }

  const promise = (async () => {
    try {
      const res = await fetch(assetsUrl(levelMessagesPath(locale, hash)));
      if (!res.ok) {
        return {};
      }
      return (await res.json()) as LevelMessageCatalog;
    } catch {
      return {};
    }
  })();
  levelMessagesCache.set(key, promise);
  return promise;
}

/** Resolve one level's display title, falling back to the level id on a miss. */
export function resolveLevelTitle(catalog: LevelMessageCatalog, levelId: string): string {
  // The Record's index signature claims every key is present; a level absent from
  // the catalog (or a locale that has none) is genuinely undefined at runtime.
  const entry = catalog[levelId] as LevelMessages | undefined;
  return entry ? entry.title : levelId;
}
