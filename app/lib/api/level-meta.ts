import { levelMessageHashes } from "@/lib/generated/level-message-hashes";
import { assetsUrl } from "@/lib/assets";
import { levelMessagesPath } from "@/lib/assets-paths";

export interface LevelMessages {
  title: string;
}

export type LevelMessageCatalog = Record<string, LevelMessages>;

// Module-level cache, keyed by locale: the persistent app fetches each locale's
// level catalog once and hands the same reference to every consumer.
const levelMessagesCache = new Map<string, Promise<LevelMessageCatalog>>();

/**
 * Fetch the curriculum-owned level display strings for one locale.
 *
 * On any miss (no catalog for this locale, or a failed fetch) this resolves to
 * `{}` — no en-fallback — matching the exercise and interpreter catalogs: an
 * unresolved level surfaces as its id, the intended loud canary rather than a
 * silent English render.
 */
export function fetchLevelMessages(locale: string): Promise<LevelMessageCatalog> {
  const cached = levelMessagesCache.get(locale);
  if (cached !== undefined) {
    return cached;
  }

  // The manifest's index signature claims every key is present, but a locale
  // with no catalog is genuinely absent at runtime.
  const hash = (levelMessageHashes as Record<string, string | undefined>)[locale];
  if (!hash) {
    const empty = Promise.resolve<LevelMessageCatalog>({});
    levelMessagesCache.set(locale, empty);
    return empty;
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
  levelMessagesCache.set(locale, promise);
  return promise;
}

/** Resolve one level's display title, falling back to the level id on a miss. */
export function resolveLevelTitle(catalog: LevelMessageCatalog, levelId: string): string {
  // The Record's index signature claims every key is present; a level absent from
  // the catalog (or a locale that has none) is genuinely undefined at runtime.
  const entry = catalog[levelId] as LevelMessages | undefined;
  return entry ? entry.title : levelId;
}
