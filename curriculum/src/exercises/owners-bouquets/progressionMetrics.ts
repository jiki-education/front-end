import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type PlantTheFlowersScenariosExercise from "./Exercise";

// The fraction of owner requests handled is the scenarios baseline's job.
// These metrics see what it can't: whether the flower count was actually
// asked for, and planting progress inside the largest failing scenario.
const LARGEST_SCENARIO_SLUG = "9-flowers";
const LARGEST_FLOWER_COUNT = 9;

function normalize(name: string): string {
  return name.replace(/[._]/g, "").toLowerCase();
}

// The runtime function-call log is per-language (ask_number_of_flowers vs
// askNumberOfFlowers), so compare normalized names.
function calledInAnyRun(runs: ScenarioRuns, funcName: string): boolean {
  const target = normalize(funcName);
  return runs.all.some((run) =>
    (run.result?.meta.functionCallLog ?? []).some((entry) => normalize(entry.name) === target)
  );
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Headline concept: asked the owner how many flowers they wanted
      // instead of hardcoding a count.
      name: "used_flower_count",
      maxScore: 1,
      points: 8,
      score: (runs) => (calledInAnyRun(runs, "ask_number_of_flowers") ? 1 : 0)
    },
    {
      // Partial progress: flowers planted (of any placement) in the
      // 9-flower scenario.
      name: "planted",
      maxScore: LARGEST_FLOWER_COUNT,
      points: 3,
      score: (runs) => {
        const ex = runs.bySlug(LARGEST_SCENARIO_SLUG)?.exercise as PlantTheFlowersScenariosExercise | undefined;
        return ex?.flowers.length ?? 0;
      }
    }
  ]
};
