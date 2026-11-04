import { formatIdentifier } from "@jiki/interpreters/shared";
import type { Language } from "../../types";
import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type AnnalynsInfiltrationExercise from "./Exercise";

const INFO_FUNCTIONS = ["knight_is_awake", "archer_is_awake", "prisoner_is_awake", "dog_is_behaving"];

// Each headline operator, with its lexeme in every language.
const OPERATOR_GROUPS: string[][] = [
  ["and", "&&"],
  ["or", "||"],
  ["not", "!"]
];

function calledFunction(runs: ScenarioRuns, language: Language, name: string): boolean {
  const formatted = formatIdentifier(name, language);
  return runs.all.some((run) => run.result?.meta.functionCallLog.some((entry) => entry.name === formatted) === true);
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // How much of the camp is the student consulting? One point per
      // distinct information function called across all the scenarios
      // (short-circuiting means no single run needs all four).
      name: "checked_the_camp",
      maxScore: 4,
      points: 3,
      score: (runs, language) => INFO_FUNCTIONS.filter((name) => calledFunction(runs, language, name)).length
    },
    {
      // Headline concepts: and, or, and not - one point per operator used.
      name: "logic_operators",
      maxScore: 3,
      points: 9,
      score: (runs) => {
        const assertors = runs.anyResult()?.assertors;
        if (assertors === undefined) {
          return 0;
        }
        return OPERATOR_GROUPS.filter((group) => group.some((op) => assertors.assertOperatorUsed(op))).length;
      }
    },
    {
      // Acting at all vs acting correctly: Annalyn did something in the camp,
      // even if her conditions are still wrong.
      name: "took_action",
      maxScore: 1,
      points: 2,
      score: (runs) => {
        const exercises = runs.all
          .filter((run) => run.isolated !== true)
          .map((run) => run.exercise as AnnalynsInfiltrationExercise | undefined)
          .filter((ex): ex is AnnalynsInfiltrationExercise => ex !== undefined);
        if (exercises.length === 0) {
          return 0;
        }
        const acted = exercises.filter(
          (ex) => ex.fastAttackCount + ex.spyCount + ex.signalCount + ex.freeCount > 0
        ).length;
        return acted / exercises.length;
      }
    }
  ]
};
