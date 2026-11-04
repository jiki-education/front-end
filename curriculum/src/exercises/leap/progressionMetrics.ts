import { locMetric } from "../progressionStdlib";
import type { ProgressionMetrics } from "../types";

// The nine year scenarios grade the divisibility rules themselves; these
// grade the stepping stones around them.
export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Every divisibility check runs through the remainder operator.
      name: "uses_modulo",
      maxScore: 1,
      points: 3,
      score: (runs) => {
        const result = runs.anyResult();
        if (!result || result.error) {
          return 0;
        }
        return result.assertors.assertOperatorUsed("%") ? 1 : 0;
      }
    },
    // Matches the "solve in one line" bonus scenario (3 lines including the
    // function wrapper in Jikiscript/JavaScript, 2 in Python).
    locMetric({ target: { javascript: 3, jikiscript: 3, python: 2 }, points: 3 })
  ]
};
