import type { ProgressionMetrics } from "../types";

// The ten scenarios grade the triangle rules case-by-case; these grade the
// concept signals underneath them.
export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Combining comparisons with and/or is the headline concept (equality
      // of all three sides, the "any two equal" isosceles check).
      name: "combines_conditions",
      maxScore: 1,
      points: 3,
      score: (runs, language) => {
        const result = runs.anyResult();
        // A parse-error result carries placeholder assertors that answer
        // true to everything, so it can't be trusted.
        if (!result || result.error) {
          return 0;
        }
        const operators = language === "javascript" ? ["&&", "||"] : ["and", "or"];
        return operators.some((operator) => result.assertors.assertOperatorUsed(operator)) ? 1 : 0;
      }
    },
    {
      // The function exists and returns a classification (a string), even a wrong one.
      name: "returns_string",
      maxScore: 1,
      points: 2,
      score: (runs) => (runs.all.some((run) => typeof run.actual === "string") ? 1 : 0)
    }
  ]
};
