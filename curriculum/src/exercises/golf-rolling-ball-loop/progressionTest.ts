import type { ProgressionTest } from "../types";
import type GolfRollingBallLoopExercise from "./Exercise";

const HOLE_X = 88;
const START_TO_HOLE_STEPS = 60;

export const progressionTest: ProgressionTest = {
  version: 1,

  setup(exercise) {
    const ex = exercise as GolfRollingBallLoopExercise;
    ex.setupBallPosition(28, 75);
    ex.setupBackground("/static/images/exercise-assets/golf-rolling-ball-loop/background.webp");
  },

  metrics: [
    {
      // Progress toward the hole; overshoot is penalised symmetrically.
      name: "distance",
      maxScore: START_TO_HOLE_STEPS,
      points: 5,
      score: (exercise) => {
        const ex = exercise as GolfRollingBallLoopExercise;
        return Math.max(0, START_TO_HOLE_STEPS - Math.abs(HOLE_X - ex.ballX));
      }
    },
    {
      // Many runtime rolls produced by few static calls to roll() implies a loop.
      name: "used-loop",
      maxScore: 1,
      points: 10,
      score: (exercise, result) => {
        const ex = exercise as GolfRollingBallLoopExercise;
        const manyRuntimeRolls = ex.visitedPositions.length >= 5;
        const fewStaticCalls = result.assertors.numFunctionCallsInCode("roll") <= 2;
        return manyRuntimeRolls && fewStaticCalls ? 1 : 0;
      }
    },
    {
      // The ball passed through the intermediate positions one step at a time.
      name: "precision",
      maxScore: 1,
      points: 2,
      score: (exercise) => {
        const ex = exercise as GolfRollingBallLoopExercise;
        const requiredPositions = [29, 40, 60, 88];
        return requiredPositions.every((p) => ex.visitedPositions.includes(p)) ? 1 : 0;
      }
    }
  ]
};
