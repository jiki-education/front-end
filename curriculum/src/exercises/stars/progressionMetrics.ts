import { methodCalls, PUSH_METHODS } from "../progressionStdlib";
import type { ProgressionMetrics, ScenarioRun } from "../types";
import type StarsExercise from "./Exercise";

// Whether each pyramid is exactly right is the scenarios' job. These metrics
// see partial progress inside the biggest pyramid: how much of it is drawn in
// place, and how many different row strings the student has built up with
// push (which shows before drawStars is ever called).
const LARGEST_SCENARIO_SLUG = "count-10";
const LARGEST_COUNT = 10;
const LARGEST_TOTAL = (LARGEST_COUNT * (LARGEST_COUNT + 1)) / 2;

// Stars that land in the outline, minus stars drawn outside it, as a fraction
// of the full pyramid. Counting down from one too few rows still scores
// highly, while an upside-down (ascending) pyramid or a solid block scores low.
function starsInPlace(run: ScenarioRun | undefined): number {
  const exercise = run?.exercise as StarsExercise | undefined;
  if (!exercise) {
    return 0;
  }
  let inPlace = 0;
  for (let rowFromBottom = 0; rowFromBottom < LARGEST_COUNT; rowFromBottom++) {
    inPlace += Math.min(exercise.countStarsInRow(rowFromBottom), LARGEST_COUNT - rowFromBottom);
  }
  const outside = exercise.totalStars() - inPlace;
  return (inPlace - outside) / LARGEST_TOTAL;
}

// Distinct non-empty all-star strings pushed onto an array. The pushed value
// is the last argument in every language (Jikiscript passes the array first).
function rowLengthsPushed(run: ScenarioRun | undefined): number {
  const lengths = new Set<number>();
  for (const entry of methodCalls(run, PUSH_METHODS)) {
    const pushed: unknown = entry.args[entry.args.length - 1];
    if (typeof pushed === "string" && /^\*+$/.test(pushed)) {
      lengths.add(pushed.length);
    }
  }
  return lengths.size;
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Partial progress: how much of the ten-row pyramid is drawn in place.
      name: "stars_in_place",
      maxScore: 1,
      points: 5,
      score: (runs) => starsInPlace(runs.bySlug(LARGEST_SCENARIO_SLUG))
    },
    {
      // The headline concept: the rows array is built up with push, one
      // string per row length. Counts even when nothing has been drawn yet.
      name: "rows_built",
      maxScore: LARGEST_COUNT,
      points: 5,
      score: (runs) => rowLengthsPushed(runs.bySlug(LARGEST_SCENARIO_SLUG))
    }
  ]
};
