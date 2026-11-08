import { answersDiffer, trustedResult } from "../progressionStdlib";
import type { ProgressionMetrics } from "../types";

// Eight of the thirteen scenarios expect false, so a function that always
// returns false already earns most of the scenarios anchor. These metrics
// look for the checksum itself and the counted loop the exercise teaches.
export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // "055 444 285" and "055 444 286" differ only in the last digit, so
      // telling them apart means the doubled-digit sum is being computed. No
      // expected values are restated, only that the answers differ.
      name: "checksum_sensitive",
      maxScore: 1,
      points: 5,
      score: (runs) => answersDiffer(runs, "luhn-valid-canadian-sin", "luhn-invalid-canadian-sin")
    },
    {
      // A counted for loop is how each digit's position (and so which ones
      // to double) is known. Only the last scenario checks for it, and only
      // once everything else there is right.
      name: "uses_counted_for",
      maxScore: 1,
      points: 3,
      score: (runs) => (trustedResult(runs)?.assertors.assertStatement("ForStatement") === true ? 1 : 0)
    },
    {
      // Both "every second digit" and "divisible by 10" run through the
      // remainder operator.
      name: "uses_modulo",
      maxScore: 1,
      points: 2,
      score: (runs) => (trustedResult(runs)?.assertors.assertOperatorUsed("%") === true ? 1 : 0)
    }
  ]
};
