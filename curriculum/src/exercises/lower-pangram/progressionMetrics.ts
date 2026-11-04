import {
  balancedRate,
  containsEitherWay,
  type FunctionCallLogEntry,
  helperCalls,
  locMetric,
  takesStrings
} from "../progressionStdlib";
import type { ProgressionMetrics, ScenarioRuns } from "../types";

// The scenarios grade the pangram answers, and the final one enforces "no
// nested loops". These metrics grade the decomposition underneath: whether a
// search helper exists and runs, and whether it answers correctly. Helpers
// are found by the shape of their logged calls, since students name them
// freely (includes, contains, has_letter...).

// A search call takes two strings (haystack and needle, in whichever order
// the student chose). String or number returns belong to other tools (such
// as Jikiscript's concatenate), so they are left out. A missing return comes
// back as null or undefined and counts as a wrong answer.
function searchCalls(runs: ScenarioRuns): FunctionCallLogEntry[] {
  return helperCalls(runs, "isPangram").filter(
    (entry) => takesStrings(entry, 2) && typeof entry.return !== "string" && typeof entry.return !== "number"
  );
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // The headline concept: the letter search lives in its own helper that
      // isPangram calls and gets a yes/no answer from. A nested-loop solution
      // passes every scenario but the last, so this is the decomposition signal.
      name: "uses_search_helper",
      maxScore: 1,
      points: 6,
      score: (runs) => (helperCalls(runs, "isPangram").some((entry) => typeof entry.return === "boolean") ? 1 : 0)
    },
    {
      // Partial progress inside the helper: how often it gave the right
      // answer, averaged over the found and not-found cases separately so the
      // many found-letter calls can't drown out the few misses. The classic
      // slip (no "return false" after the loop) scores half.
      name: "search_helper_correct",
      maxScore: 1,
      points: 4,
      score: (runs) => {
        const calls = searchCalls(runs);
        if (calls.length === 0) {
          return 0;
        }
        const contains = (entry: FunctionCallLogEntry) =>
          containsEitherWay(entry.args[0] as string, entry.args[1] as string);
        return balancedRate(calls, contains, (entry) => entry.return === contains(entry));
      }
    },
    // Matches the decompose-tightly bonus target (16 lines, 10 for Python).
    locMetric({ target: { javascript: 16, jikiscript: 16, python: 10 }, points: 2 })
  ]
};
