import type { ExerciseDefinition } from "./types";

// Auto-generated or manually maintained registry
export const exercises = {
  "maze-solve-basic": () => import("./maze-solve-basic"),
  acronym: () => import("./acronym"),
  "after-party": () => import("./after-party"),
  anagram: () => import("./anagram"),
  "chop-shop": () => import("./chop-shop"),
  "guest-list": () => import("./guest-list"),
  hamming: () => import("./hamming"),
  "formal-dinner": () => import("./formal-dinner"),
  "driving-test": () => import("./driving-test"),
  "sprouting-flower": () => import("./sprouting-flower"),
  penguin: () => import("./penguin"),
  "scroll-and-shoot": () => import("./scroll-and-shoot"),
  "space-invaders-solve-basic": () => import("./space-invaders-solve-basic"),
  "space-invaders-repeat": () => import("./space-invaders-repeat"),
  "jumbled-house": () => import("./jumbled-house"),
  "build-wall": () => import("./build-wall"),
  "finish-wall": () => import("./finish-wall"),
  "fix-wall": () => import("./fix-wall"),
  "structured-house": () => import("./structured-house"),
  "nucleotide-count": () => import("./nucleotide-count"),
  "meal-prep": () => import("./meal-prep"),
  "matching-socks": () => import("./matching-socks"),
  "reverse-string": () => import("./reverse-string"),
  "protein-translation": () => import("./protein-translation"),
  pangram: () => import("./pangram"),
  sunset: () => import("./sunset"),
  rainbow: () => import("./rainbow"),
  "rna-transcription": () => import("./rna-transcription"),
  "scrabble-score": () => import("./scrabble-score"),
  "two-fer": () => import("./two-fer"),
  sunshine: () => import("./sunshine"),
  "foxy-face": () => import("./foxy-face"),
  "cloud-rain-sun": () => import("./cloud-rain-sun"),
  "golf-rolling-ball-loop": () => import("./golf-rolling-ball-loop"),
  "golf-rolling-ball-state": () => import("./golf-rolling-ball-state"),
  "golf-shot-checker": () => import("./golf-shot-checker"),
  "plant-the-flowers": () => import("./plant-the-flowers"),
  "process-guess": () => import("./process-guess"),
  "process-game": () => import("./process-game"),
  "wordle-solver": () => import("./wordle-solver"),
  snowman: () => import("./snowman"),
  "traffic-lights": () => import("./traffic-lights"),
  "relational-snowman": () => import("./relational-snowman"),
  "relational-sun": () => import("./relational-sun"),
  "relational-traffic-lights": () => import("./relational-traffic-lights")
} as const;

export type ExerciseSlug = keyof typeof exercises;

/**
 * Retrieves an exercise definition by its slug.
 * Used by the LLM chat proxy to get exercise context for prompt building.
 *
 * @param slug - The exercise slug (e.g., "maze-solve-basic")
 * @returns The exercise definition or null if not found
 */
export async function getExercise(slug: string): Promise<ExerciseDefinition | null> {
  const loader = exercises[slug as ExerciseSlug];
  if (loader === undefined) {
    return null;
  }

  const module = await loader();
  return module.default;
}
