import { locMetric } from "../progressionStdlib";
import type { ProgressionMetrics } from "../types";

// Only what is unique to this exercise lives here; shared shapes (like the
// lines-of-code metric) come from the progression stdlib.
export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      name: "uses_modulo",
      maxScore: 1,
      points: 3,
      score: (runs) => (runs.anyResult()?.assertors.assertOperatorUsed("%") === true ? 1 : 0)
    },
    // Matches the exercise's "solve in 6 lines" bonus target (JavaScript).
    locMetric({ target: 6, points: 3 })
  ]
};
