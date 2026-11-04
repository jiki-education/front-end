import { simpleState } from "../../exercise-categories/wordle/WordleExercise";
import { methodCalls, PUSH_METHODS } from "../progressionStdlib";
import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type ProcessGuessExercise from "./Exercise";
import { scenarios } from "./scenarios";

// Whether each row is exactly right is the scenarios' job, and the first
// wrong square hides the rest. These metrics see partial progress across the
// whole row (e.g. greens right but yellows missing), and whether the states
// array was built up with push.

// The fraction of every scenario's squares colored with the right state, by
// the simplified rule (the instructions defer duplicate letters to the next
// exercise).
function squaresCorrect(runs: ScenarioRuns): number {
  let squares = 0;
  let correct = 0;
  for (const scenario of scenarios) {
    const [target, guess] = (scenario.functionCall?.args ?? []) as [string, string];
    const exercise = runs.bySlug(scenario.slug)?.exercise as ProcessGuessExercise | undefined;
    const actual = exercise?.statesForRow(0) ?? [];
    for (let idx = 0; idx < guess.length; idx++) {
      squares++;
      if (actual[idx] === simpleState(target, guess, idx)) {
        correct++;
      }
    }
  }
  return squares === 0 ? 0 : correct / squares;
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Partial progress: squares colored correctly across every scenario.
      name: "squares_correct",
      maxScore: 1,
      points: 6,
      score: (runs) => squaresCorrect(runs)
    },
    {
      // The level's headline concept: the states array is built up with push.
      name: "builds_with_push",
      maxScore: 1,
      points: 3,
      score: (runs) => (runs.all.some((run) => methodCalls(run, PUSH_METHODS).length > 0) ? 1 : 0)
    }
  ]
};
