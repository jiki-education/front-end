import { averageOverRuns, methodCalls, PUSH_METHODS } from "../progressionStdlib";
import type { ProgressionMetrics, ScenarioRun } from "../types";
import { scenarios } from "./scenarios";

// Whether each business name comes back exactly right is the scenarios' job.
// These metrics see partial progress inside a failing scenario (how many of
// the words were found, which catches a missing final word on the manual
// route) and whether the array was built up with push.

// The fraction of a scenario's expected words that appear in the returned
// array. Stray empty strings are not
// penalised here (the double-space scenario covers them).
function wordsFound(run: ScenarioRun): number {
  const scenario = scenarios.find((candidate) => candidate.slug === run.scenarioSlug);
  const expected = scenario?.expected;
  if (!Array.isArray(expected) || expected.length === 0 || !Array.isArray(run.actual)) {
    return 0;
  }
  const remaining = [...run.actual];
  let found = 0;
  for (const word of expected) {
    const index = remaining.indexOf(word);
    if (index !== -1) {
      found++;
      remaining.splice(index, 1);
    }
  }
  return found / expected.length;
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Partial progress: how many of the words made it into the array.
      name: "words_found",
      maxScore: 1,
      points: 5,
      score: (runs) => averageOverRuns(runs, wordsFound)
    },
    {
      // The headline concept of the level: the array is built up with push
      // rather than returning split()'s result directly (which leaves the
      // empty pieces from double spaces in place).
      name: "builds_with_push",
      maxScore: 1,
      points: 4,
      score: (runs) => (runs.all.some((run) => methodCalls(run, PUSH_METHODS).length > 0) ? 1 : 0)
    }
  ]
};
