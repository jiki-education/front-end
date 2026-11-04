import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type { CheckerboardExercise } from "./Exercise";

const SCENARIO_SLUG = "board-8";
// A finished 8x8 board: 1 border rectangle + 64 squares + 24 pieces of two
// circles each (rim + face).
const FULL_BOARD_ELEMENTS = 113;

function boardExercise(runs: ScenarioRuns): CheckerboardExercise | undefined {
  return runs.bySlug(SCENARIO_SLUG)?.exercise as CheckerboardExercise | undefined;
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Partial construction: how much of the 8x8 board (border, squares,
      // pieces) has been drawn, regardless of whether it is right yet.
      name: "board_progress",
      maxScore: FULL_BOARD_ELEMENTS,
      points: 4,
      score: (runs) => {
        const ex = boardExercise(runs);
        if (!ex) {
          return 0;
        }
        return Math.min(ex.numElements(), FULL_BOARD_ELEMENTS);
      }
    },
    {
      // Many runtime rectangles from few static calls implies the grid is
      // drawn with loops rather than pasted square-by-square.
      name: "looped_grid",
      maxScore: 1,
      points: 8,
      score: (runs) => {
        const run = runs.bySlug(SCENARIO_SLUG);
        if (!run?.result) {
          return 0;
        }
        const runtimeRectangles = run.result.meta.functionCallLog.filter((entry) => entry.name === "rectangle").length;
        const staticCalls = run.result.assertors.numFunctionCallsInCode("rectangle");
        return runtimeRectangles >= 16 && staticCalls <= 4 ? 1 : 0;
      }
    },
    {
      // Everything must derive from get_board_size() so the same code scales
      // to 6x6 and 10x10 - calling it at all is the first step.
      name: "reads_board_size",
      maxScore: 1,
      points: 3,
      score: (runs) => ((runs.anyResult()?.assertors.numFunctionCallsInCode("get_board_size") ?? 0) >= 1 ? 1 : 0)
    }
  ]
};
