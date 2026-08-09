import { cache } from "react";
import { exerciseIndexHashes } from "@/lib/generated/exercise-hashes";
import { assetsUrl } from "@/lib/server/origin";
import { readArtifact, readArtifactJson } from "@/lib/server/artifacts";
import { exerciseIndexPath, exerciseIndexPointerPath } from "@/lib/assets-paths";
import { createHashResolver } from "@/lib/i18n/catalogPointer";
import type { ExerciseMetaEntry } from "@/lib/api/exercise-meta";

/**
 * Server-side exercise index fetch — the same static file the client fetches
 * (lib/api/exercise-meta.ts), via an absolute origin URL. Wrapped in cache() so
 * repeated lookups in one request share a single fetch.
 */
// Non-English hashes resolve at runtime from the pointer, exactly as on the
// client, so a locale the i18n repo published after this build still renders
// server-side. Reading the compiled manifest by locale here would have made the
// server path silently build-bound while the client path was not.
const resolveHash = createHashResolver({
  label: "exercise prose index",
  compiledHashes: () => exerciseIndexHashes,
  pointerPath: (locale) => exerciseIndexPointerPath(locale),
  resolveUrl: assetsUrl,
  readPointer: readArtifactJson
});

const fetchExerciseIndex = cache(async (locale: string): Promise<ExerciseMetaEntry[]> => {
  let hash: string;
  try {
    hash = await resolveHash(locale);
  } catch {
    return [];
  }
  const path = exerciseIndexPath(locale, hash);
  const res = await readArtifact(path);
  if (!res.ok) {
    throw new Error(`Failed to read exercise index: ${path} (${res.status})`);
  }
  return res.json<ExerciseMetaEntry[]>();
});

export async function getExerciseMetaBySlugsServer(slugs: string[], locale: string): Promise<ExerciseMetaEntry[]> {
  const index = await fetchExerciseIndex(locale);
  const slugSet = new Set(slugs);
  return index.filter((e) => slugSet.has(e.slug));
}
