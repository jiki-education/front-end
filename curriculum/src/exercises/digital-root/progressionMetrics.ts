import { averageOverRuns, trustedResult } from "../progressionStdlib";
import type { ProgressionMetrics } from "../types";
import { scenarios } from "./scenarios";

// The first task's scenarios pass with a single pass of digit-summing, and the
// second task's pass only once that pass repeats inside a while loop. These
// separate "sums the digits correctly but only once" from "isn't summing
// digits at all", which look the same on the collapse scenarios.
export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // For every multi-digit input, the returned number is a plausible digit
      // sum of it: smaller than the input, no bigger than 9 per digit, and
      // with the same remainder mod 9 (summing digits, once or repeatedly,
      // always preserves it). A single pass earns this in full, so it
      // credits the summing step on the collapse scenarios it still fails.
      name: "sums_digits",
      maxScore: 1,
      points: 4,
      score: (runs) =>
        averageOverRuns(runs, (run) => {
          const input = inputFor(run.scenarioSlug);
          if (input === undefined || input < 10) {
            return undefined;
          }
          return isDigitSumOf(run.actual, input) ? 1 : 0;
        })
    },
    {
      // The unknown-length "keep collapsing" loop is the headline concept.
      name: "uses_while",
      maxScore: 1,
      points: 4,
      score: (runs) => (trustedResult(runs)?.assertors.assertStatement("WhileStatement") === true ? 1 : 0)
    }
  ]
};

function inputFor(slug: string): number | undefined {
  const input = scenarios.find((scenario) => scenario.slug === slug)?.args[0];
  return typeof input === "number" ? input : undefined;
}

function isDigitSumOf(actual: unknown, input: number): boolean {
  if (typeof actual !== "number" || !Number.isInteger(actual) || actual < 1 || actual >= input) {
    return false;
  }
  return actual <= 9 * String(input).length && (input - actual) % 9 === 0;
}
