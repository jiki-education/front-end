import { answersDiffer, trustedResult } from "../progressionStdlib";
import type { ProgressionMetrics } from "../types";

// Twelve of the sixteen scenarios expect false, so a function that always
// returns false already earns most of the scenarios anchor. These metrics
// look for the checksum itself, which a constant answer can't fake: pairs of
// scenarios whose inputs differ in a single character must get different
// answers. No expected values are restated, only that the answers differ.
export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // "3-598-21508-8" and "3-598-21508-9" differ only in the check digit,
      // so telling them apart means the weighted sum is being computed.
      name: "checksum_sensitive",
      maxScore: 1,
      points: 5,
      score: (runs) => answersDiffer(runs, "isbn-valid", "isbn-invalid-check-digit")
    },
    {
      // "3-598-21507-X" and "3-598-21507-A" differ only in the last
      // character, so telling them apart means X is being read as 10.
      name: "handles_x",
      maxScore: 1,
      points: 3,
      score: (runs) => answersDiffer(runs, "isbn-valid-check-digit-x", "isbn-invalid-character")
    },
    {
      // The exercise asks for dashes to be skipped with continue. The bonus
      // scenario checks it alongside a line limit, so it never shows on its
      // own there.
      name: "uses_continue",
      maxScore: 1,
      points: 2,
      score: (runs) => (trustedResult(runs)?.assertors.assertStatement("ContinueStatement") === true ? 1 : 0)
    }
  ]
};
