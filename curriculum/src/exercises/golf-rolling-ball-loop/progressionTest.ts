import type { ProgressionTest, ScenarioRuns } from "../types";
import type GolfRollingBallLoopExercise from "./Exercise";

const SCENARIO_SLUG = "roll-ball";
const HOLE_X = 88;
const START_TO_HOLE_STEPS = 60;

function golfExercise(runs: ScenarioRuns): GolfRollingBallLoopExercise | undefined {
  return runs.bySlug(SCENARIO_SLUG)?.exercise as GolfRollingBallLoopExercise | undefined;
}

export const progressionTest: ProgressionTest = {
  version: 1,

  metrics: [
    {
      // Progress toward the hole; overshoot is penalised symmetrically.
      name: "distance",
      maxScore: START_TO_HOLE_STEPS,
      points: 5,
      score: (runs) => {
        const ex = golfExercise(runs);
        if (!ex) {
          return 0;
        }
        return Math.max(0, START_TO_HOLE_STEPS - Math.abs(HOLE_X - ex.ballX));
      }
    },
    {
      // Many runtime rolls produced by few static calls to roll() implies a loop.
      name: "used-loop",
      maxScore: 1,
      points: 10,
      score: (runs) => {
        const run = runs.bySlug(SCENARIO_SLUG);
        const ex = golfExercise(runs);
        if (!run?.result || !ex) {
          return 0;
        }
        const manyRuntimeRolls = ex.visitedPositions.length >= 5;
        const fewStaticCalls = run.result.assertors.numFunctionCallsInCode("roll") <= 2;
        return manyRuntimeRolls && fewStaticCalls ? 1 : 0;
      }
    },
    {
      // The ball passed through the intermediate positions one step at a time.
      name: "precision",
      maxScore: 1,
      points: 2,
      score: (runs) => {
        const ex = golfExercise(runs);
        if (!ex) {
          return 0;
        }
        const requiredPositions = [29, 40, 60, 88];
        return requiredPositions.every((p) => ex.visitedPositions.includes(p)) ? 1 : 0;
      }
    }
  ]
};
