import { cache } from "react";
import { exerciseIndexHashes } from "@/lib/generated/exercise-hashes";
import { assetsUrl } from "@/lib/server/origin";
import { exerciseIndexPath } from "@/lib/assets-paths";
import type { ExerciseMetaEntry } from "@/lib/api/exercise-meta";

/**
 * Server-side exercise index fetch — the same static file the client fetches
 * (lib/api/exercise-meta.ts), via an absolute origin URL. Wrapped in cache() so
 * repeated lookups in one request share a single fetch.
 */
const fetchExerciseIndex = cache(async (locale: string): Promise<ExerciseMetaEntry[]> => {
  const hash = exerciseIndexHashes[locale];
  if (!hash) {
    return [];
  }
  const url = await assetsUrl(exerciseIndexPath(locale, hash));
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch exercise index: ${url} (${res.status})`);
  }
  return res.json() as Promise<ExerciseMetaEntry[]>;
});

export async function getExerciseMetaBySlugsServer(
  slugs: string[],
  locale: string = "en"
): Promise<ExerciseMetaEntry[]> {
  const index = await fetchExerciseIndex(locale);
  const slugSet = new Set(slugs);
  return index.filter((e) => slugSet.has(e.slug));
}
