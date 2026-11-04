import { locMetric } from "../progressionStdlib";
import type { ProgressionMetrics, ScenarioRun, ScenarioRuns } from "../types";
import { scenarios } from "./scenarios";

// Which queues produce which counts is the scenarios' job. These grade the
// steps underneath: returning a count at all, and then counting past the
// first chancer. Returning from inside the loop (the classic slip carried
// over from earlier "is X on the list?" exercises) can only ever produce 0 or
// 1, so a count of 2 or more shows the student keeps walking to the back of
// the queue before answering. Requiring the count to be below the queue's
// length as well means some people were filtered out, so returning the
// queue's length outright doesn't earn it.

// The length of the queue a run was given, read from the scenario it ran.
// Only the arguments are used here, never the expected values.
function queueLength(run: ScenarioRun): number {
  const queue = scenarios.find((scenario) => scenario.slug === run.scenarioSlug)?.args[0];
  return Array.isArray(queue) ? queue.length : 0;
}

function countedPastFirstChancer(run: ScenarioRun): boolean {
  return typeof run.actual === "number" && run.actual >= 2 && run.actual < queueLength(run);
}

function numericRuns(runs: ScenarioRuns): ScenarioRun[] {
  return runs.all.filter((run) => run.isolated !== true && typeof run.actual === "number");
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // The headline concept: accumulating a filtered count across the whole
      // queue. Some run returned a count of two or more that is still below
      // the queue's length, which neither an early return nor the raw length
      // can reach.
      name: "counts_whole_queue",
      maxScore: 1,
      points: 5,
      score: (runs) => (numericRuns(runs).some(countedPastFirstChancer) ? 1 : 0)
    },
    {
      // The stepping stone: the function returns a count (a number), even a
      // wrong one, rather than nothing or a boolean.
      name: "returns_number",
      maxScore: 1,
      points: 2,
      score: (runs) => (numericRuns(runs).length > 0 ? 1 : 0)
    },
    // Matches the exercise's solve-tightly bonus budget, which differs per
    // language (it matches each language's canonical solution).
    locMetric({ target: { javascript: 9, jikiscript: 17, python: 6 }, points: 3 })
  ]
};
