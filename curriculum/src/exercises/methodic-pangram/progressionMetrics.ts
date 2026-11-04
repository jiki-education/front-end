import { helperCalls, takesStrings, trustedResult } from "../progressionStdlib";
import type { ProgressionMetrics } from "../types";

// A refactor exercise: students arrive with their hand-written pangram code,
// which already passes every scenario, so the baseline is full from the first
// run. These metrics grade the refactor itself, adopting the built-in case
// method and retiring the hand-written helpers it replaces.
//
// The built-ins differ per language. JavaScript has .toLowerCase() and
// .includes(). Python has .lower(), but its interpreter does not yet support
// the `in` operator, so a hand-written contains helper is still needed there.
// Jikiscript has the to_upper_case() stdlib function and no contains
// built-in, so its solution keeps its own includes helper too.

// The Jikiscript stdlib case functions, which are logged like user functions.
const STDLIB_CASE_FUNCTIONS = ["to_upper_case", "to_lower_case"];

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // The headline concept: calling the built-in case conversion instead
      // of the hand-written one.
      name: "uses_case_method",
      maxScore: 1,
      points: 6,
      score: (runs, language) => {
        const result = trustedResult(runs);
        if (!result) {
          return 0;
        }
        const assertors = result.assertors;
        if (language === "javascript") {
          return assertors.assertMethodCalled("toLowerCase") || assertors.assertMethodCalled("toUpperCase") ? 1 : 0;
        }
        if (language === "python") {
          return assertors.assertMethodCalled("lower") || assertors.assertMethodCalled("upper") ? 1 : 0;
        }
        return STDLIB_CASE_FUNCTIONS.some((name) => assertors.numFunctionCallsInCode(name) >= 1) ? 1 : 0;
      }
    },
    {
      // The share of replaceable hand-written helpers that no longer do the
      // work at runtime: case conversion and indexOf everywhere, plus contains
      // in JavaScript (the only language with a built-in for it). Only counts
      // while isPangram still answers, so deleting everything earns nothing.
      name: "drops_manual_helpers",
      maxScore: 1,
      points: 6,
      score: (runs, language) => {
        if (!runs.all.some((run) => typeof run.actual === "boolean")) {
          return 0;
        }
        // The Jikiscript stdlib case functions are logged like the student's
        // own helpers, so they are left out.
        const calls = helperCalls(runs, "isPangram").filter((entry) => !STDLIB_CASE_FUNCTIONS.includes(entry.name));
        const stillRunning = [
          calls.some((entry) => takesStrings(entry, 1) && typeof entry.return === "string"),
          calls.some((entry) => takesStrings(entry, 2) && typeof entry.return === "number")
        ];
        if (language === "javascript") {
          stillRunning.push(calls.some((entry) => takesStrings(entry, 2) && typeof entry.return === "boolean"));
        }
        return stillRunning.filter((running) => !running).length / stillRunning.length;
      }
    }
  ]
};
