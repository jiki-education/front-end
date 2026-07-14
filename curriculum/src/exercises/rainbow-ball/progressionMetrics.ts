import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type { RainbowBallExercise } from "./Exercise";

const SCENARIO_SLUG = "rainbow-ball";

// The scenario uses a random seed, so both metrics measure seed-agnostic
// properties (coverage bands, variety thresholds), never exact positions.
function ballExercise(runs: ScenarioRuns): RainbowBallExercise | undefined {
  return runs.bySlug(SCENARIO_SLUG)?.exercise as RainbowBallExercise | undefined;
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // The stub already draws a static circle in a loop; the headline work is
      // updating the position and hue variables each iteration so the trail
      // actually moves and changes colour. Thresholds are deliberately lower
      // than the scenario's own (30 positions / 50 colours) to credit partial
      // state updates.
      name: "trail_variety",
      maxScore: 2,
      points: 8,
      score: (runs) => {
        const ex = ballExercise(runs);
        if (!ex) {
          return 0;
        }
        return (ex.checkUniquePositionedCircles(10) ? 1 : 0) + (ex.checkUniqueColoredCircles(10) ? 1 : 0);
      }
    },
    {
      // Bounce progress: how much of the canvas the ball has painted. The
      // scenario only checks the final 80% bar; this grades the climb to it.
      name: "canvas_coverage",
      maxScore: 4,
      points: 4,
      score: (runs) => {
        const ex = ballExercise(runs);
        if (!ex) {
          return 0;
        }
        return [20, 40, 60, 80].filter((percentage) => ex.checkCanvasCoverage(percentage)).length;
      }
    }
  ]
};
