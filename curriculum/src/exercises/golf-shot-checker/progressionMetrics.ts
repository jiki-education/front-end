import { formatIdentifier } from "@jiki/interpreters/shared";
import type { Language } from "../../types";
import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type GolfShotCheckerExercise from "./Exercise";

function calledFunction(runs: ScenarioRuns, language: Language, name: string): boolean {
  const formatted = formatIdentifier(name, language);
  return runs.all.some((run) => run.result?.meta.functionCallLog.some((entry) => entry.name === formatted) === true);
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Has the student started reading the shot length at all?
      name: "read_shot_length",
      maxScore: 1,
      points: 2,
      score: (runs, language) => (calledFunction(runs, language, "get_shot_length") ? 1 : 0)
    },
    {
      // Many runtime moves produced by few static move_to calls implies the
      // rolling is loop-driven rather than pasted out by hand.
      name: "used_loop",
      maxScore: 1,
      points: 8,
      score: (runs) => {
        const result = runs.anyResult();
        if (result === undefined) {
          return 0;
        }
        const fewStaticCalls = result.assertors.numFunctionCallsInCode("move_to") <= 3;
        const manyRuntimeMoves = runs.all.some((run) => {
          if (run.isolated === true) {
            return false;
          }
          const ex = run.exercise as GolfShotCheckerExercise | undefined;
          return ex !== undefined && ex.visitedPositions.length >= 5;
        });
        return fewStaticCalls && manyRuntimeMoves ? 1 : 0;
      }
    },
    {
      // The hole check needs both bounds: shot long enough AND short enough.
      name: "combined_condition",
      maxScore: 1,
      points: 4,
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
