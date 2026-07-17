import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type { JumbledHouseExercise } from "./Exercise";

const SCENARIO_SLUG = "draw-the-house";

// The six house pieces the scenario checks. The sky and grass are already
// correct in the stub, so they don't measure progress and aren't counted.
const PIECE_CHECKS: ((ex: JumbledHouseExercise) => boolean)[] = [
  (ex) => ex.hasRectangleAt(20, 50, 60, 40), // frame
  (ex) => ex.hasTriangleAt(16, 50, 50, 30, 84, 50), // roof
  (ex) => ex.hasRectangleAt(30, 55, 12, 13), // left window
  (ex) => ex.hasRectangleAt(58, 55, 12, 13), // right window
  (ex) => ex.hasRectangleAt(43, 72, 14, 18), // door
  (ex) => ex.hasCircleAt(55, 81, 1) // door knob
];

function houseExercise(runs: ScenarioRuns): JumbledHouseExercise | undefined {
  return runs.bySlug(SCENARIO_SLUG)?.exercise as JumbledHouseExercise | undefined;
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Count of jumbled pieces moved to their correct position - partial credit
      // inside the failing scenario.
      name: "pieces_in_place",
      maxScore: PIECE_CHECKS.length,
      points: 5,
      score: (runs) => {
        const ex = houseExercise(runs);
        if (!ex) {
          return 0;
        }
        return PIECE_CHECKS.filter((check) => check(ex)).length;
      }
    }
  ]
};
