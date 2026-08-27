import type { RegisteredExerciseSlug } from "./exercises";

// The slugs the curriculum owns, materialised so the front end can classify a
// slug without asking the API.
//
// Every student-facing thing has exactly one slug, and the three sets below are
// disjoint. Together they are the whole namespace the curriculum copy catalog is
// keyed by, so a slug that resolves in one of these lists has copy, and a slug in
// none of them is a bug.
//
// Exercise lessons and challenges both run a curriculum exercise. The two differ
// in how a student reaches them, not in what they are: a lesson sits in the course
// path, a challenge is standalone and premium-gated.

// Exercises that appear as lessons in the course path.
export const exerciseLessonSlugs = [
  "maze-solve-basic",
  "space-invaders-solve-basic",
  "maze-solve-walk",
  "fix-wall",
  "snowman-basic",
  "foxy-face",
  "penguin",
  "cloud-rain-sun",
  "jumbled-house",
  "golf-rolling-ball-loop",
  "maze-solve-repeat",
  "space-invaders-repeat",
  "snowman",
  "traffic-lights",
  "relational-sun",
  "relational-snowman",
  "relational-traffic-lights",
  "plant-the-flowers",
  "golf-rolling-ball-state",
  "finish-wall",
  "dnd-roll",
  "gold-panning",
  "rainbow",
  "sunset",
  "random-salad",
  "rainbow-splodges",
  "stock-market",
  "golf-scenarios",
  "owners-bouquets",
  "cityscape-skyscraper",
  "space-invaders-nested-repeat",
  "bouncer",
  "space-invaders-conditional",
  "bouncer-wristbands",
  "digital-clock",
  "rock-paper-scissors",
  "bouncer-dress-code",
  "golf-shot-checker",
  "stripey-fabric",
  "annalyns-infiltration",
  "maze-automated-solve",
  "build-wall",
  "scroll-and-shoot",
  "maze-turn-around",
  "battle-procedures",
  "maze-walk",
  "even-or-odd",
  "triangle",
  "leap",
  "collatz-conjecture",
  "look-around",
  "hello",
  "two-fer",
  "raindrops",
  "three-letter-acronym",
  "tile-search",
  "tile-rack",
  "sign-price",
  "reverse-string",
  "driving-test",
  "hamming",
  "niche-named-party",
  "lower-pangram",
  "pangram",
  "methodic-pangram",
  "nucleotide",
  "alphanumeric",
  "isbn-verifier",
  "luhn",
  "digital-root",
  "weather-symbols",
  "guest-list",
  "after-party",
  "formal-dinner",
  "meal-prep",
  "sign-words",
  "stars",
  "wordle-process-guess",
  "chop-shop",
  "lunchbox",
  "wordle-process-game",
  "lookup-time",
  "scrabble-score",
  "rna-transcription",
  "protein-translation",
  "spotify",
  "word-count",
  "llm-response",
  "nucleotide-count"
] as const;

// Lessons that play a video rather than running an exercise.
export const videoLessonSlugs = [
  "welcome-to-coding-fundamentals",
  "using-functions",
  "function-inputs",
  "strings",
  "repeat-loop",
  "creating-variables",
  "variables-together",
  "updating-variables",
  "functions-that-return-things",
  "colors",
  "animation",
  "random-numbers",
  "scope",
  "scenarios",
  "nested-loops",
  "if-statements",
  "else-statements",
  "logic-gates",
  "remainder",
  "repeat-without-count",
  "state",
  "making-functions",
  "making-functions-with-inputs",
  "making-functions-with-return-values",
  "string-concatenation",
  "string-indexing",
  "string-iteration",
  "using-multiple-functions-together",
  "methods-and-strings",
  "for-while-loops",
  "arrays",
  "building-arrays",
  "dictionaries",
  "updating-dictionaries"
] as const;

// Exercises surfaced as standalone challenges.
export const challengeSlugs = [
  "structured-house",
  "sprouting-flower",
  "rainbow-ball",
  "checkerboard",
  "acronym",
  "caesar-cipher",
  "run-length-encoding",
  "alien-detector",
  "matching-socks",
  "tic-tac-toe",
  "sieve",
  "cityscape-skyline",
  "wordle-solver"
] as const;

export type ExerciseLessonSlug = (typeof exerciseLessonSlugs)[number];
export type VideoLessonSlug = (typeof videoLessonSlugs)[number];
export type ChallengeSlug = (typeof challengeSlugs)[number];

// A lesson is whatever a student opens from the course path.
export type LessonSlug = ExerciseLessonSlug | VideoLessonSlug;

// An exercise is whatever loads and runs curriculum exercise code, reached either
// as a lesson in the course path or as a standalone challenge.
export type ExerciseSlug = ExerciseLessonSlug | ChallengeSlug;

// Every lesson exercise and every challenge must be a registered exercise, so it
// can actually be loaded and run. These assignments are the check: they only
// compile while both lists are subsets of the exercise registry. (The reverse
// doesn't hold — the registry also carries exercises not yet placed anywhere.)
// Every exercise a student can reach must have a module to load. This assignment
// is the check: it only compiles while ExerciseSlug is a subset of the registry.
const _everyExerciseIsRegistered: readonly RegisteredExerciseSlug[] = [...exerciseLessonSlugs, ...challengeSlugs];
void _everyExerciseIsRegistered;

const challengeSlugSet: ReadonlySet<string> = new Set(challengeSlugs);
const videoLessonSlugSet: ReadonlySet<string> = new Set(videoLessonSlugs);

export function isChallengeSlug(slug: string): slug is ChallengeSlug {
  return challengeSlugSet.has(slug);
}

export function isVideoLessonSlug(slug: string): slug is VideoLessonSlug {
  return videoLessonSlugSet.has(slug);
}
