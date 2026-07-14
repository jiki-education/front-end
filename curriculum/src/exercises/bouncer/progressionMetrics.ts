import { formatIdentifier } from "@jiki/interpreters/shared";
import type { Language } from "../../types";
import type { ProgressionMetrics, ScenarioRuns } from "../types";

// Comparison operator lexemes across all three languages.
const COMPARISON_OPERATORS = [">", ">=", "<", "<=", "==", "===", "!=", "!=="];

function calledAskAge(runs: ScenarioRuns, language: Language): boolean {
  const name = formatIdentifier("ask_age", language);
  return runs.all.some((run) => run.result?.meta.functionCallLog.some((entry) => entry.name === name) === true);
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // The scenarios only see whether the person was let in (doing nothing
      // already passes half of them); this sees whether the student has
      // started reading the age at all.
      name: "read_the_age",
      maxScore: 1,
      points: 3,
      score: (runs, language) => (calledAskAge(runs, language) ? 1 : 0)
    },
    {
      // Headline concept: making the decision with a comparison. Scores even
      // when the boundary is wrong (e.g. >= 20), which the scenarios fail.
      name: "used_comparison",
      maxScore: 1,
      points: 8,
      score: (runs) => {
        const assertors = runs.anyResult()?.assertors;
        if (assertors === undefined) {
          return 0;
        }
        return COMPARISON_OPERATORS.some((op) => assertors.assertOperatorUsed(op)) ? 1 : 0;
      }
    }
  ]
};
