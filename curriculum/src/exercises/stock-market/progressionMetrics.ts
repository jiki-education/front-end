import type { ProgressionMetrics, ScenarioRun } from "../types";
import type StockMarketExercise from "./Exercise";

// The growth rates are random each run, so everything here is structural:
// whether the market was consulted, how many years were simulated, and
// whether a loop drove the simulation.
const SCENARIO_SLUG = "twenty-years";
const YEARS = 20;

function normalize(name: string): string {
  return name.replace(/[._]/g, "").toLowerCase();
}

// The runtime function-call log is per-language (market_growth vs
// marketGrowth), so compare normalized names.
function runtimeCallCount(run: ScenarioRun | undefined, funcName: string): number {
  const target = normalize(funcName);
  return (run?.result?.meta.functionCallLog ?? []).filter((entry) => normalize(entry.name) === target).length;
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Headline concept: consulted the market for each year's growth
      // instead of inventing numbers.
      name: "used_market_growth",
      maxScore: 1,
      points: 8,
      score: (runs) => (runtimeCallCount(runs.bySlug(SCENARIO_SLUG), "market_growth") > 0 ? 1 : 0)
    },
    {
      // Partial progress: tax reports filed toward the 20-year target
      // (count only - correctness is the scenario's job).
      name: "years_reported",
      maxScore: YEARS,
      points: 4,
      score: (runs) => {
        const ex = runs.bySlug(SCENARIO_SLUG)?.exercise as StockMarketExercise | undefined;
        return ex?.taxReports.length ?? 0;
      }
    },
    {
      // Many runtime growth checks from few static calls implies a loop
      // rather than twenty pasted lines.
      name: "used_loop",
      maxScore: 1,
      points: 3,
      score: (runs) => {
        const run = runs.bySlug(SCENARIO_SLUG);
        if (!run?.result) {
          return 0;
        }
        const manyRuntimeCalls = runtimeCallCount(run, "market_growth") >= 5;
        const fewStaticCalls = run.result.assertors.numFunctionCallsInCode("market_growth") <= 2;
        return manyRuntimeCalls && fewStaticCalls ? 1 : 0;
      }
    }
  ]
};
