import type { ProgressionMetrics, ScenarioRun, ScenarioRuns } from "../types";
import type GolfRollingBallStateExercise from "./Exercise";

const SCENARIO_SLUG = "roll-ball";
const HOLE_X = 88;
const START_TO_HOLE_STEPS = 60;

function golfExercise(runs: ScenarioRuns): GolfRollingBallStateExercise | undefined {
  return runs.bySlug(SCENARIO_SLUG)?.exercise as GolfRollingBallStateExercise | undefined;
}

// The runtime function-call log is per-language (move_to vs moveTo), so
// compare normalized names.
function runtimeCallCount(run: ScenarioRun | undefined, funcName: string): number {
  const target = funcName.replace(/[._]/g, "").toLowerCase();
  return (run?.result?.meta.functionCallLog ?? []).filter(
    (entry) => entry.name.replace(/[._]/g, "").toLowerCase() === target
  ).length;
}

export const progressionMetrics: ProgressionMetrics = {
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
      // Many runtime moves produced by few static calls to move_to() implies a loop.
      name: "used_loop",
      maxScore: 1,
      points: 8,
      score: (runs) => {
        const run = runs.bySlug(SCENARIO_SLUG);
        const ex = golfExercise(runs);
        if (!run?.result || !ex) {
          return 0;
        }
        const manyRuntimeMoves = ex.visitedPositions.length >= 5;
        const fewStaticCalls = run.result.assertors.numFunctionCallsInCode("move_to") <= 2;
        return manyRuntimeMoves && fewStaticCalls ? 1 : 0;
      }
    },
    {
      // Headline concept for the state variant: the position lives in a
      // variable that is passed to move_to(), not typed-in literals.
      name: "position_variable",
      maxScore: 1,
      points: 3,
      score: (runs) => {
        const run = runs.bySlug(SCENARIO_SLUG);
        if (!run?.result || runtimeCallCount(run, "move_to") === 0) {
          return 0;
        }
        return run.result.assertors.assertSomeArgumentsAreVariablesForFunction("move_to", [true]) ? 1 : 0;
      }
    }
  ]
};
