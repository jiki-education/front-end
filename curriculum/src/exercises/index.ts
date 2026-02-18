import type { ExerciseDefinition } from "./types";

// Auto-generated or manually maintained registry
export const exercises = {
  "maze-solve-basic": () => import("./maze-solve-basic"),
  acronym: () => import("./acronym"),
  "after-party": () => import("./after-party"),
  anagram: () => import("./anagram"),
  "chop-shop": () => import("./chop-shop"),
  "collatz-conjecture": () => import("./collatz-conjecture"),
  "guest-list": () => import("./guest-list"),
  hamming: () => import("./hamming"),
  "formal-dinner": () => import("./formal-dinner"),
  "driving-test": () => import("./driving-test"),
  "even-or-odd": () => import("./even-or-odd"),
  "sprouting-flower": () => import("./sprouting-flower"),
  penguin: () => import("./penguin"),
  "scroll-and-shoot": () => import("./scroll-and-shoot"),
  "space-invaders-solve-basic": () => import("./space-invaders-solve-basic"),
  "space-invaders-repeat": () => import("./space-invaders-repeat"),
  "space-invaders-nested-repeat": () => import("./space-invaders-nested-repeat"),
  "space-invaders-conditional": () => import("./space-invaders-conditional"),
  "jumbled-house": () => import("./jumbled-house"),
  bouncer: () => import("./bouncer"),
  "bouncer-wristbands": () => import("./bouncer-wristbands"),
  "bouncer-dress-code": () => import("./bouncer-dress-code"),
  "build-wall": () => import("./build-wall"),
  "finish-wall": () => import("./finish-wall"),
  "fix-wall": () => import("./fix-wall"),
  "structured-house": () => import("./structured-house"),
  nucleotide: () => import("./nucleotide"),
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
  "plant-the-flowers-scenarios": () => import("./plant-the-flowers-scenarios"),
  "process-guess": () => import("./process-guess"),
  "process-game": () => import("./process-game"),
  "wordle-solver": () => import("./wordle-solver"),
  snowman: () => import("./snowman"),
  "traffic-lights": () => import("./traffic-lights"),
  "relational-snowman": () => import("./relational-snowman"),
  "relational-sun": () => import("./relational-sun"),
  "relational-traffic-lights": () => import("./relational-traffic-lights"),
  "cityscape-skyscraper": () => import("./cityscape-skyscraper"),
  "cityscape-skyline": () => import("./cityscape-skyline"),
  "rainbow-splodges": () => import("./rainbow-splodges"),
  "digital-clock": () => import("./digital-clock"),
  "rock-paper-scissors-determine-winner": () => import("./rock-paper-scissors-determine-winner"),
  "maze-automated-solve": () => import("./maze-automated-solve"),
  "maze-turn-around": () => import("./maze-turn-around"),
  "rainbow-ball": () => import("./rainbow-ball"),
  triangle: () => import("./triangle"),
  raindrops: () => import("./raindrops"),
  "isbn-verifier": () => import("./isbn-verifier"),
  lunchbox: () => import("./lunchbox"),
  stars: () => import("./stars"),
  "word-count": () => import("./word-count"),
  "extract-words": () => import("./extract-words"),
  hello: () => import("./hello")
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
