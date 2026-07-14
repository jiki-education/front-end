import type { InterpretResult } from "@jiki/interpreters";
import type { Progression, ScenarioRuns } from "../types";

// The visible non-bonus scenarios. Correctness itself is the framework's
// "scenarios" baseline; these slugs only feed the loc gauge's "solved" check.
const INPUT_SCENARIO_SLUGS = ["number-14", "number-28", "number--1", "number-17", "number-0"];

// Code-shape metrics can read any run's InterpretResult - the assertors
// reflect the parsed code, not the arguments of the particular run.
function anyResult(runs: ScenarioRuns): InterpretResult | undefined {
  return runs.all.find((run) => run.result)?.result ?? undefined;
}

function allInputScenariosPass(runs: ScenarioRuns): boolean {
  return INPUT_SCENARIO_SLUGS.every((slug) => runs.bySlug(slug)?.passed === true);
}

export const progression: Progression = {
  version: 1,

  metrics: [
    {
      name: "uses_modulo",
      maxScore: 1,
      points: 3,
      score: (runs) => (anyResult(runs)?.assertors.assertOperatorUsed("%") === true ? 1 : 0)
    }
  ],

  gauges: [
    {
      // The exercise has a "solve in 6 lines" bonus scenario, so record the
      // line count on solving runs and let analysis watch it trend toward
      // the bonus target. Unsolved runs emit nothing.
      name: "loc",
      value: (runs) => {
        if (!allInputScenariosPass(runs)) {
          return undefined;
        }
        return anyResult(runs)?.assertors.countLinesOfCode();
      }
    }
  ]
};
