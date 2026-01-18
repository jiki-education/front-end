import type { ExerciseDefinition } from "./types";

// Auto-generated or manually maintained registry
export const exercises = {
  "maze-solve-basic": () => import("./maze-solve-basic"),
  acronym: () => import("./acronym"),
  "after-party": () => import("./after-party"),
  anagram: () => import("./anagram"),
  "formal-dinner": () => import("./formal-dinner"),
  "driving-test": () => import("./driving-test"),
  "sprouting-flower": () => import("./sprouting-flower"),
  penguin: () => import("./penguin"),
  "scroll-and-shoot": () => import("./scroll-and-shoot"),
  "jumbled-house": () => import("./jumbled-house"),
  "build-wall": () => import("./build-wall"),
  "finish-wall": () => import("./finish-wall"),
  "fix-wall": () => import("./fix-wall"),
  "structured-house": () => import("./structured-house"),
  sunset: () => import("./sunset"),
  rainbow: () => import("./rainbow")
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
