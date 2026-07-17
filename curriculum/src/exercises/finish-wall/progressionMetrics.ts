import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type { FinishWallExercise } from "./Exercise";

const SCENARIO_SLUG = "finish-wall";
const BRICK_WIDTH = 20;
const BRICK_HEIGHT = 10;
const BRICK_COUNT = 5;

function wallExercise(runs: ScenarioRuns): FinishWallExercise | undefined {
  return runs.bySlug(SCENARIO_SLUG)?.exercise as FinishWallExercise | undefined;
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Partial progress: how many of the five top-layer bricks are in place,
      // scored even when the scenario fails (wrong positions or unrolled code).
      name: "bricks_placed",
      maxScore: BRICK_COUNT,
      points: 5,
      score: (runs) => {
        const exercise = wallExercise(runs);
        if (!exercise) {
          return 0;
        }
        let placed = 0;
        for (let i = 0; i < BRICK_COUNT; i++) {
          if (exercise.hasRectangleAt(i * BRICK_WIDTH, 0, BRICK_WIDTH, BRICK_HEIGHT)) {
            placed += 1;
          }
        }
        return placed;
      }
    },
    {
      // Many runtime rectangles produced by few static calls implies a loop -
      // the concept this exercise teaches, vs pasting five rectangle lines.
      name: "used_loop",
      maxScore: 1,
      points: 8,
      score: (runs) => {
        const run = runs.bySlug(SCENARIO_SLUG);
        const exercise = wallExercise(runs);
        if (!run?.result || !exercise) {
          return 0;
        }
        const manyRuntimeBricks = exercise.numElements() >= 4;
        const fewStaticCalls = run.result.assertors.numFunctionCallsInCode("rectangle") <= 2;
        return manyRuntimeBricks && fewStaticCalls ? 1 : 0;
      }
    }
  ]
};
