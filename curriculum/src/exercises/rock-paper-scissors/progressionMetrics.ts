import { formatIdentifier } from "@jiki/interpreters/shared";
import type { Language } from "../../types";
import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type RockPaperScissorsDetermineWinnerExercise from "./Exercise";

function calledFunction(runs: ScenarioRuns, language: Language, name: string): boolean {
  const formatted = formatIdentifier(name, language);
  return runs.all.some((run) => run.result?.meta.functionCallLog.some((entry) => entry.name === formatted) === true);
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // One point each for reading Yuki's and Ando's choices.
      name: "read_choices",
      maxScore: 2,
      points: 2,
      score: (runs, language) =>
        (calledFunction(runs, language, "get_yuki_choice") ? 1 : 0) +
        (calledFunction(runs, language, "get_ando_choice") ? 1 : 0)
    },
    {
      // Announcing at all vs announcing correctly: the exercise records the
      // result before the wrong-result expectation fails the scenario.
      name: "announced_result",
      maxScore: 1,
      points: 3,
      score: (runs) => {
        const exercises = runs.all
          .filter((run) => run.isolated !== true)
          .map((run) => run.exercise as RockPaperScissorsDetermineWinnerExercise | undefined)
          .filter((ex): ex is RockPaperScissorsDetermineWinnerExercise => ex !== undefined);
        if (exercises.length === 0) {
          return 0;
        }
        return exercises.filter((ex) => ex.result !== null).length / exercises.length;
      }
    },
    {
      // Headline concept: pairing the two choices with a compound condition.
      name: "combined_conditions",
      maxScore: 1,
      points: 8,
      score: (runs) => {
        const assertors = runs.anyResult()?.assertors;
        if (assertors === undefined) {
          return 0;
        }
        return ["and", "&&"].some((op) => assertors.assertOperatorUsed(op)) ? 1 : 0;
      }
    }
  ]
};
