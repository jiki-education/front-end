import type { ProgressionMetrics, ScenarioRuns } from "../types";

// Concatenation via the + operator (JavaScript/Python) or the concatenate()
// stdlib function (Jikiscript).
function usedConcatenation(runs: ScenarioRuns): boolean {
  const result = runs.anyResult();
  // A parse-error result carries placeholder assertors that answer true to
  // everything, so it can't be trusted.
  if (!result || result.error) {
    return false;
  }
  return result.assertors.assertOperatorUsed("+") || result.assertors.numFunctionCallsInCode("concatenate") >= 1;
}

// The headline concept (defaulting when no name is given) is exactly what the
// two-fer-default scenario measures, so it stays with the scenarios. These
// grade the steps underneath it.
export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Building the sentence from the name input rather than hardcoding it.
      name: "uses_concatenation",
      maxScore: 1,
      points: 4,
      score: (runs) => (usedConcatenation(runs) ? 1 : 0)
    },
    {
      // The function exists and returns a sentence (a string), even a wrong one.
      name: "returns_string",
      maxScore: 1,
      points: 2,
      score: (runs) => (runs.all.some((run) => typeof run.actual === "string") ? 1 : 0)
    }
  ]
};
