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

// The three name scenarios grade correctness; these grade the steps toward
// it. Building the greeting out of the name input is the headline concept -
// it is what separates concatenating from hardcoding a greeting per name.
export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      name: "uses_concatenation",
      maxScore: 1,
      points: 8,
      score: (runs) => (usedConcatenation(runs) ? 1 : 0)
    },
    {
      // The function exists and returns a greeting (a string), even a wrong one.
      name: "returns_string",
      maxScore: 1,
      points: 2,
      score: (runs) => (runs.all.some((run) => typeof run.actual === "string") ? 1 : 0)
    }
  ]
};
