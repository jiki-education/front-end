import type { ProgressionMetrics } from "../types";

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // The headline concept: ACCUMULATING the sounds with concatenation and
      // separate ifs, rather than early-returning a hardcoded literal per
      // combination ("PlingPlang", ...). A literal-return solution can pass
      // every scenario, so this is the understanding-vs-grinding signal.
      // Concatenation is the + operator (JavaScript/Python) or the
      // concatenate() stdlib function (Jikiscript).
      name: "builds_up_sounds",
      maxScore: 1,
      points: 8,
      score: (runs) => {
        const result = runs.anyResult();
        // A parse-error result carries placeholder assertors that answer
        // true to everything, so it can't be trusted.
        if (!result || result.error) {
          return 0;
        }
        const assertors = result.assertors;
        return assertors.assertOperatorUsed("+") || assertors.numFunctionCallsInCode("concatenate") >= 1 ? 1 : 0;
      }
    },
    {
      // The divisibility checks run through the remainder operator.
      name: "uses_modulo",
      maxScore: 1,
      points: 2,
      score: (runs) => {
        const result = runs.anyResult();
        if (!result || result.error) {
          return 0;
        }
        return result.assertors.assertOperatorUsed("%") ? 1 : 0;
      }
    }
  ]
};
