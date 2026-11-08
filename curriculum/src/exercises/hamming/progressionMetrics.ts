import { locMetric, loopIterations, trustedResult } from "../progressionStdlib";
import type { ProgressionMetrics } from "../types";
import { scenarios } from "./scenarios";

// Three of the five scenarios expect 0, so a function that returns 0 without
// looking at the strands already earns six anchor points. These metrics grade
// the real work underneath: walking the strand and comparing letters.

// The longest differing pair, so a working loop visits every position.
const LONG_STRANDS_SLUG = "hamming-long-different-strands";
const longStrand = String(scenarios.find((scenario) => scenario.slug === LONG_STRANDS_SLUG)?.args[0] ?? "");

// The position-by-position comparison, in either polarity.
const COMPARISON_OPERATORS = ["!=", "!==", "==", "==="];

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Partial progress: how much of the long strand the loop walked.
      name: "walks_strand",
      maxScore: 1,
      points: 4,
      score: (runs, language) => {
        if (longStrand.length === 0) {
          return 0;
        }
        return loopIterations(runs.bySlug(LONG_STRANDS_SLUG), language) / longStrand.length;
      }
    },
    {
      // The letters at each position are compared. This is the step a
      // return-0 shortcut or a count-every-letter loop is missing.
      name: "compares_letters",
      maxScore: 1,
      points: 3,
      score: (runs) => {
        const result = trustedResult(runs);
        if (!result) {
          return 0;
        }
        return COMPARISON_OPERATORS.some((operator) => result.assertors.assertOperatorUsed(operator)) ? 1 : 0;
      }
    },
    // Matches the "solve in 11 lines (8 for Python)" bonus scenario.
    locMetric({ target: { javascript: 11, jikiscript: 11, python: 8 }, points: 2 })
  ]
};
