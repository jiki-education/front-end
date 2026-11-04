import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type { FixWallExercise } from "./Exercise";

const SCENARIO_SLUG = "fill-holes";

// The three holes the scenario checks, one covering rectangle each.
const HOLES: [number, number, number, number][] = [
  [10, 10, 20, 10], // top hole
  [70, 30, 20, 10], // middle hole
  [20, 60, 20, 10] // bottom hole
];

function fixWallExercise(runs: ScenarioRuns): FixWallExercise | undefined {
  return runs.bySlug(SCENARIO_SLUG)?.exercise as FixWallExercise | undefined;
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Count of holes correctly covered - partial credit inside the failing scenario.
      name: "holes_filled",
      maxScore: HOLES.length,
      points: 5,
      score: (runs) => {
        const ex = fixWallExercise(runs);
        if (!ex) {
          return 0;
        }
        return HOLES.filter((hole) => ex.hasRectangleAt(...hole)).length;
      }
    }
  ]
};
