import type { ProgressionMetrics } from "../types";
import type { BuildWallExercise } from "./Exercise";

const SCENARIO_SLUG = "build-wall";
const FULL_WALL_BRICKS = 55;

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Partial construction: bricks laid toward the 55-brick wall.
      // Overshooting (laying far too many bricks) is penalised symmetrically.
      name: "bricks_built",
      maxScore: FULL_WALL_BRICKS,
      points: 4,
      score: (runs) => {
        const ex = runs.bySlug(SCENARIO_SLUG)?.exercise as BuildWallExercise | undefined;
        if (!ex) {
          return 0;
        }
        return Math.max(0, FULL_WALL_BRICKS - Math.abs(FULL_WALL_BRICKS - ex.numElements()));
      }
    },
    {
      // Many runtime bricks from very few static rectangle calls implies the
      // wall is built with loops rather than pasted brick-by-brick.
      name: "used_loops",
      maxScore: 1,
      points: 8,
      score: (runs) => {
        const run = runs.bySlug(SCENARIO_SLUG);
        if (!run?.result || !run.exercise) {
          return 0;
        }
        const ex = run.exercise as BuildWallExercise;
        const staticCalls = run.result.assertors.numFunctionCallsInCode("rectangle");
        return ex.numElements() >= 10 && staticCalls <= 2 ? 1 : 0;
      }
    }
  ]
};
