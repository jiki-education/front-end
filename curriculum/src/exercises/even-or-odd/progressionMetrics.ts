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
    // Matches the exercise's "solve in 6 lines (4 for Python)" bonus target.
    locMetric({ target: { javascript: 6, jikiscript: 6, python: 4 }, points: 3 })
  ]
};
