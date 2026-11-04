import { type FunctionCallLogEntry, helperCalls, locMetric, takesStrings, trustedResult } from "../progressionStdlib";
import type { ProgressionMetrics, ScenarioRuns } from "../types";

// The scenarios grade the prefix answers (including the length guard the
// empty name needs). These metrics grade the decomposition underneath: a
// length-counting helper that works, reused for both the prefix and the
// name. The helper is found by the shape of its logged calls (one string in,
// a number out), since students name it freely.

// Every runtime call to a student-written length helper.
function lengthHelperCalls(runs: ScenarioRuns): FunctionCallLogEntry[] {
  return helperCalls(runs, "handleGuest").filter((entry) => takesStrings(entry, 1) && typeof entry.return === "number");
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Partial progress before the guard and comparison work: the share of
      // the helper's calls that counted the string's characters correctly.
      name: "length_helper_correct",
      maxScore: 1,
      points: 5,
      score: (runs) => {
        const calls = lengthHelperCalls(runs);
        if (calls.length === 0) {
          return 0;
        }
        const correct = calls.filter((entry) => entry.return === [...(entry.args[0] as string)].length);
        return correct.length / calls.length;
      }
    },
    {
      // Understanding over duplication: the one helper is called from at
      // least two places in the code (prefix and name) rather than the
      // counting loop being pasted twice.
      name: "reuses_length_helper",
      maxScore: 1,
      points: 3,
      score: (runs) => {
        const result = trustedResult(runs);
        if (!result) {
          return 0;
        }
        const helperNames = new Set(lengthHelperCalls(runs).map((entry) => entry.name));
        return [...helperNames].some((name) => result.assertors.numFunctionCallsInCode(name) >= 2) ? 1 : 0;
      }
    },
    // Matches the solve-tightly bonus target (20 lines, 14 for Python).
    locMetric({ target: { javascript: 20, jikiscript: 20, python: 14 }, points: 2 })
  ]
};
