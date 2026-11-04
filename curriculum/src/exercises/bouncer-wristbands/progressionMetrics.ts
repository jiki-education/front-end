import { formatIdentifier } from "@jiki/interpreters/shared";
import type { Language } from "../../types";
import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type BouncerWristbandsExercise from "./Exercise";

function calledGetAge(runs: ScenarioRuns, language: Language): boolean {
  const name = formatIdentifier("get_age", language);
  return runs.all.some((run) => run.result?.meta.functionCallLog.some((entry) => entry.name === name) === true);
}

function primaryExercises(runs: ScenarioRuns): BouncerWristbandsExercise[] {
  return runs.all
    .filter((run) => run.isolated !== true)
    .map((run) => run.exercise as BouncerWristbandsExercise | undefined)
    .filter((ex): ex is BouncerWristbandsExercise => ex !== undefined);
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Has the student started reading the age at all?
      name: "read_the_age",
      maxScore: 1,
      points: 2,
      score: (runs, language) => (calledGetAge(runs, language) ? 1 : 0)
    },
    {
      // Acting at all vs acting correctly: the exercise records the wristband
      // even when it's the wrong one, which the scenarios fail outright.
      name: "gave_wristbands",
      maxScore: 1,
      points: 3,
      score: (runs) => {
        const exercises = primaryExercises(runs);
        if (exercises.length === 0) {
          return 0;
        }
        return exercises.filter((ex) => ex.wristband !== null).length / exercises.length;
      }
    },
    {
      // Headline concept: the else-if chain discriminating the four age
      // bands. Counts how many different wristbands the code handed out
      // across the scenarios - always giving "adult" scores 1 of 4 even
      // though two scenarios happen to pass.
      name: "distinct_wristbands",
      maxScore: 4,
      points: 8,
      score: (runs) => {
        const bands = new Set<string>();
        for (const ex of primaryExercises(runs)) {
          if (ex.wristband !== null) {
            bands.add(ex.wristband);
          }
        }
        return bands.size;
      }
    }
  ]
};
