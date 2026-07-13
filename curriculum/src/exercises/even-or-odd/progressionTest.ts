import type { InterpretResult } from "@jiki/interpreters";
import type { ProgressionTest, ScenarioRuns } from "../types";

// The visible input scenarios and their expected returns. Capitalisation
// matters: "Even"/"Odd".
const INPUT_SCENARIOS = [
  { slug: "number-14", expected: "Even" },
  { slug: "number-28", expected: "Even" },
  { slug: "number--1", expected: "Odd" },
  { slug: "number-17", expected: "Odd" },
  { slug: "number-0", expected: "Even" }
];

// Code-shape metrics can read any run's InterpretResult - the assertors
// reflect the parsed code, not the arguments of the particular run.
function anyResult(runs: ScenarioRuns): InterpretResult | undefined {
  return runs.all.find((run) => run.result)?.result ?? undefined;
}

export const progressionTest: ProgressionTest = {
  version: 1,

  metrics: [
    {
      name: "inputs-correct",
      maxScore: INPUT_SCENARIOS.length,
      points: 8,
      score: (runs) => INPUT_SCENARIOS.filter(({ slug, expected }) => runs.bySlug(slug)?.actual === expected).length
    },
    {
      name: "uses-modulo",
      maxScore: 1,
      points: 3,
      score: (runs) => (anyResult(runs)?.assertors.assertOperatorUsed("%") === true ? 1 : 0)
    },
    {
      // Mirrors the exercise's "solve in 6 lines" bonus check. Like the real
      // bonus (which also requires a correct return), conciseness only counts
      // for a substantive attempt - the modulo guard stops the untouched stub
      // scoring points just for being short.
      name: "concise",
      maxScore: 1,
      points: 1,
      score: (runs, language) => {
        const result = anyResult(runs);
        if (!result) {
          return 0;
        }
        return result.assertors.assertOperatorUsed("%") &&
          result.assertors.assertMaxLinesOfCode(language === "python" ? 4 : 6)
          ? 1
          : 0;
      }
    }
  ]
};
