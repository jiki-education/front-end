import type { ProgressionMetrics, ScenarioRun } from "../types";

// The pan values are random each run, so everything here is structural:
// how many times pan() ran, and whether sell() was fed a computed value.
const SCENARIO_SLUG = "random-pans";
const REQUIRED_PANS = 5;

function runtimeCallCount(run: ScenarioRun | undefined, funcName: string): number {
  return (run?.result?.meta.functionCallLog ?? []).filter((entry) => entry.name === funcName).length;
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Headline concept: the amount sold is a computed value (variable or
      // expression built from pan()'s returns), not a typed-in literal.
      name: "sold_computed_total",
      maxScore: 1,
      points: 8,
      score: (runs) => {
        const run = runs.bySlug(SCENARIO_SLUG);
        if (!run?.result || runtimeCallCount(run, "sell") === 0) {
          return 0;
        }
        return run.result.assertors.assertSomeArgumentsAreVariablesForFunction("sell", [true]) ? 1 : 0;
      }
    },
    {
      // Partial progress: how many of the five pans happened.
      name: "pans",
      maxScore: REQUIRED_PANS,
      points: 4,
      score: (runs) => runtimeCallCount(runs.bySlug(SCENARIO_SLUG), "pan")
    },
    {
      // Many runtime pans from few static pan() calls implies a loop with a
      // running total rather than five pasted lines.
      name: "used_loop",
      maxScore: 1,
      points: 3,
      score: (runs) => {
        const run = runs.bySlug(SCENARIO_SLUG);
        if (!run?.result) {
          return 0;
        }
        const manyRuntimePans = runtimeCallCount(run, "pan") >= 4;
        const fewStaticCalls = run.result.assertors.numFunctionCallsInCode("pan") <= 2;
        return manyRuntimePans && fewStaticCalls ? 1 : 0;
      }
    }
  ]
};
