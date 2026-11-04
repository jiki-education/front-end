import type { ProgressionMetrics, ScenarioRun } from "../types";

// Every scenario uses randomSeed, so all measurements here are structural
// (which helper functions ran, and how often) - never exact positions.
const FOUR_BUILDINGS_SLUG = "buildings-4";
const NUM_BUILDINGS = 4;

function normalize(name: string): string {
  return name.replace(/[._]/g, "").toLowerCase();
}

// The runtime function-call log is per-language (random_width vs randomWidth),
// so compare normalized names.
function runtimeCallCount(run: ScenarioRun | undefined, funcName: string): number {
  const target = normalize(funcName);
  return (run?.result?.meta.functionCallLog ?? []).filter((entry) => normalize(entry.name) === target).length;
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Headline concept: fetched both random dimensions instead of building
      // fixed-size buildings.
      name: "used_random_sizes",
      maxScore: 1,
      points: 8,
      score: (runs) => {
        const gotBoth = runs.all.some(
          (run) => runtimeCallCount(run, "random_width") > 0 && runtimeCallCount(run, "random_num_floors") > 0
        );
        return gotBoth ? 1 : 0;
      }
    },
    {
      // One width and one floor count drawn per building implies the student
      // loops over the buildings re-rolling dimensions each time (seed-agnostic:
      // counts calls, not values).
      name: "randoms_per_building",
      maxScore: NUM_BUILDINGS,
      points: 4,
      score: (runs) => {
        const run = runs.bySlug(FOUR_BUILDINGS_SLUG);
        return Math.min(runtimeCallCount(run, "random_width"), runtimeCallCount(run, "random_num_floors"));
      }
    }
  ]
};
