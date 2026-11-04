import { helperCalls, takesStrings, trustedResult } from "../progressionStdlib";
import type { ProgressionMetrics } from "../types";

// The scenarios grade counting and both -1 validation gates. What they can't
// see is how the validation is done: a chain of `=== "A" || === "C" ...`
// comparisons passes every scenario, but the exercise is about reaching for
// a membership check instead.

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // The headline concept: validating with a membership check. JavaScript
      // uses the .includes() method. Jikiscript has no contains built-in and
      // Python's interpreter does not yet support the `in` operator, so there
      // a hand-written contains helper that ran (two strings in, a boolean
      // out) counts, as in the Jikiscript solution.
      name: "uses_membership_check",
      maxScore: 1,
      points: 6,
      score: (runs, language) => {
        const result = trustedResult(runs);
        if (!result) {
          return 0;
        }
        if (language === "javascript") {
          return result.assertors.assertMethodCalled("includes") ? 1 : 0;
        }
        if (
          language === "python" &&
          (result.assertors.assertOperatorUsed("in") || result.assertors.assertOperatorUsed("not in"))
        ) {
          return 1;
        }
        const ranContainsHelper = helperCalls(runs, "countNucleotide").some(
          (entry) => takesStrings(entry, 2) && typeof entry.return === "boolean"
        );
        return ranContainsHelper ? 1 : 0;
      }
    },
    {
      // The function exists and returns a count (a number), even a wrong one.
      name: "returns_number",
      maxScore: 1,
      points: 2,
      score: (runs) => (runs.all.some((run) => typeof run.actual === "number") ? 1 : 0)
    }
  ]
};
