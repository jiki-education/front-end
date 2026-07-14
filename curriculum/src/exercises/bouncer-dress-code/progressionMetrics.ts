import { formatIdentifier } from "@jiki/interpreters/shared";
import type { Language } from "../../types";
import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type BouncerDressCodeExercise from "./Exercise";

function calledFunction(runs: ScenarioRuns, language: Language, name: string): boolean {
  const formatted = formatIdentifier(name, language);
  return runs.all.some((run) => run.result?.meta.functionCallLog.some((entry) => entry.name === formatted) === true);
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // One point each for reading the outfit and the age (the guest list is
      // legitimately only consulted on some paths, so it isn't required).
      name: "read_the_inputs",
      maxScore: 2,
      points: 2,
      score: (runs, language) =>
        (calledFunction(runs, language, "get_outfit") ? 1 : 0) + (calledFunction(runs, language, "get_age") ? 1 : 0)
    },
    {
      // Headline concept: combining conditions. Gives credit the moment
      // and/or appears, long before the codeCheck-carrying scenario passes.
      name: "combined_conditions",
      maxScore: 1,
      points: 8,
      score: (runs) => {
        const assertors = runs.anyResult()?.assertors;
        if (assertors === undefined) {
          return 0;
        }
        return ["and", "&&", "or", "||"].some((op) => assertors.assertOperatorUsed(op)) ? 1 : 0;
      }
    },
    {
      // Acting at all vs acting correctly: every guest got let in or turned
      // away, even if the champagne/canapés rules are still wrong.
      name: "made_a_decision",
      maxScore: 1,
      points: 3,
      score: (runs) => {
        const exercises = runs.all
          .filter((run) => run.isolated !== true)
          .map((run) => run.exercise as BouncerDressCodeExercise | undefined)
          .filter((ex): ex is BouncerDressCodeExercise => ex !== undefined);
        if (exercises.length === 0) {
          return 0;
        }
        return exercises.filter((ex) => ex.wasLetIn || ex.wasTurnedAway).length / exercises.length;
      }
    }
  ]
};
