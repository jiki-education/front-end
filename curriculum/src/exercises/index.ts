import type { ExerciseDefinition } from "./types";

// Auto-generated or manually maintained registry
export const exercises = {
  "basic-movement": () => import("./basic-movement"),
  "maze-solve-basic": () => import("./maze-solve-basic"),
  acronym: () => import("./acronym"),
  anagram: () => import("./anagram"),
  "sprouting-flower": () => import("./sprouting-flower")
  // Future exercises will be added here:
  // 'loop-basics': () => import('./loop-basics'),
  // 'conditionals': () => import('./conditionals'),
} as const;

export type ExerciseSlug = keyof typeof exercises;

/**
 * Retrieves an exercise definition by its slug.
 * Used by the LLM chat proxy to get exercise context for prompt building.
 *
 * @param slug - The exercise slug (e.g., "basic-movement")
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
