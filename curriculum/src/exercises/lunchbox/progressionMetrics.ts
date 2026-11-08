import { averageOverRuns, locMetric } from "../progressionStdlib";
import type { ProgressionMetrics, ScenarioRun } from "../types";
import { scenarios } from "./scenarios";

// Exact answers (including smallest-to-largest ordering) are the scenarios'
// job. These metrics see the stepping stones underneath: returning the
// [lunchbox, backpack] shape, getting each item into the right container even
// while the ordering is still wrong, and, once solved, trimming toward the
// bonus line limit.

function isTwoArrays(value: unknown): value is [unknown[], unknown[]] {
  return Array.isArray(value) && value.length === 2 && Array.isArray(value[0]) && Array.isArray(value[1]);
}

// Pushing the [name, size] pair instead of the name is a common slip, so an
// item counts as placed by its name either way.
function itemName(entry: unknown): unknown {
  return Array.isArray(entry) ? entry[0] : entry;
}

// The fraction of a scenario's items that ended up in the right container,
// ignoring order. Undefined for scenarios with no items to place.
function placedFraction(run: ScenarioRun): number | undefined {
  const scenario = scenarios.find((candidate) => candidate.slug === run.scenarioSlug);
  const expected = scenario?.expected;
  if (!isTwoArrays(expected)) {
    return undefined;
  }
  const itemCount = expected[0].length + expected[1].length;
  if (itemCount === 0) {
    return undefined;
  }
  if (!isTwoArrays(run.actual)) {
    return 0;
  }

  const lunchbox = run.actual[0].map(itemName);
  const backpack = run.actual[1].map(itemName);
  const placed =
    expected[0].filter((name) => lunchbox.includes(name)).length +
    expected[1].filter((name) => backpack.includes(name)).length;
  return placed / itemCount;
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Partial progress: items sorted into the right container. Walking the
      // array largest-first (the main trap) still places most items
      // correctly, it just packs the wrong ones in "pack-the-most" and gets
      // the ordering wrong elsewhere.
      name: "items_placed",
      maxScore: 1,
      points: 5,
      score: (runs) => averageOverRuns(runs, placedFraction)
    },
    {
      // The function returns an array of two arrays, even with the wrong
      // contents.
      name: "returns_two_arrays",
      maxScore: 1,
      points: 2,
      score: (runs) => (runs.all.some((run) => isTwoArrays(run.actual)) ? 1 : 0)
    },
    // Post-solve refinement toward the bonus line limit, which differs by
    // language (see scenarios.ts).
    locMetric({ target: { javascript: 16, jikiscript: 16, python: 13 }, points: 3 })
  ]
};
