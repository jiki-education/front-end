import type { ProgressionMetrics } from "../types";

// Case coverage is the scenarios' job (the 1000000 case makes hand-unrolling
// impractical, so the loop itself is scenario-measured too). These grade the
// stepping stones before any case passes.
export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // The even/odd branch is driven by the remainder operator.
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
    {
      // The function exists and returns a step count (a number), even a wrong one.
      name: "returns_number",
      maxScore: 1,
      points: 2,
      score: (runs) => (runs.all.some((run) => typeof run.actual === "number") ? 1 : 0)
    }
  ]
};
