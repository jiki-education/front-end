import type { ProgressionMetrics } from "../types";

// The winning game loop is carried forward from the previous lesson (it IS
// the stub), so game progress is not a signal here. The one new concept is
// extracting the shooting logic into a procedure and calling it - which the
// scenario only scores as part of an all-or-nothing pass, so grade the two
// halves separately.
export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      name: "extracted_procedure",
      maxScore: 2,
      points: 8,
      score: (runs) => {
        const result = runs.anyResult();
        // A parse-error result carries placeholder assertors that answer
        // true to everything, so it can't be trusted.
        if (!result || result.error) {
          return 0;
        }
        const assertors = result.assertors;
        if (!assertors.assertFunctionDefined("shoot_if_alien_above")) {
          return 0;
        }
        return assertors.assertFunctionCalledOutsideOwnDefinition("shoot_if_alien_above") ? 2 : 1;
      }
    }
  ]
};
