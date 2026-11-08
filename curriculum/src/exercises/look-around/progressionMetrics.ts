import { locMetric } from "../progressionStdlib";
import type { ProgressionMetrics } from "../types";

// The seven mazes already grade navigation progress scenario-by-scenario;
// what they can't see is how many of the sensing/turning helpers exist
// before any maze is solved (only forks-2 code-checks them, all-or-nothing).
const HELPER_FUNCTIONS = ["can_move", "can_turn_left", "can_turn_right", "turn_around"];

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      name: "helpers_defined",
      maxScore: HELPER_FUNCTIONS.length,
      points: 4,
      score: (runs) => {
        const result = runs.anyResult();
        // A parse-error result carries placeholder assertors that answer
        // true to everything, so it can't be trusted.
        if (!result || result.error) {
          return 0;
        }
        return HELPER_FUNCTIONS.filter((name) => result.assertors.assertFunctionDefined(name)).length;
      }
    },
    // Matches the bonus-2 "add only 13 lines" target (18 carried-forward + 13 = 31).
    locMetric({ target: 31, points: 3 })
  ]
};
