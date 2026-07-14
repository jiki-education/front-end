import type { ProgressionMetrics, ScenarioRun } from "../types";
import type { RainbowSplodgesExercise } from "./Exercise";

// The scenario uses randomSeed and is a single all-or-nothing run, so these
// metrics track structural progress: how many circles appeared, whether a
// loop produced them, and whether randomness fed the drawing at all.
const SCENARIO_SLUG = "rainbow-splodges";
const REQUIRED_CIRCLES = 200;

function runtimeCallCount(run: ScenarioRun | undefined, predicate: (name: string) => boolean): number {
  return (run?.result?.meta.functionCallLog ?? []).filter((entry) => predicate(entry.name)).length;
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Many runtime circles from few static circle() calls implies a loop.
      name: "used_loop",
      maxScore: 1,
      points: 8,
      score: (runs) => {
        const run = runs.bySlug(SCENARIO_SLUG);
        if (!run?.result) {
          return 0;
        }
        const manyRuntimeCircles = runtimeCallCount(run, (name) => name === "circle") >= 50;
        const fewStaticCalls = run.result.assertors.numFunctionCallsInCode("circle") <= 2;
        return manyRuntimeCircles && fewStaticCalls ? 1 : 0;
      }
    },
    {
      // Partial progress: circles drawn toward the 200 target.
      name: "circles_drawn",
      maxScore: REQUIRED_CIRCLES,
      points: 4,
      score: (runs) => {
        const ex = runs.bySlug(SCENARIO_SLUG)?.exercise as RainbowSplodgesExercise | undefined;
        return ex?.numElements() ?? 0;
      }
    },
    {
      // Randomness feeds the drawing (random_number / Math.randomInt / randint
      // depending on language - hence the loose name match).
      name: "used_random",
      maxScore: 1,
      points: 3,
      score: (runs) => {
        const run = runs.bySlug(SCENARIO_SLUG);
        return runtimeCallCount(run, (name) => /rand/.test(name.toLowerCase())) >= 4 ? 1 : 0;
      }
    }
  ]
};
