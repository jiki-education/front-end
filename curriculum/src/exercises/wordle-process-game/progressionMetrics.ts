import { scoreGuess, simpleState } from "../../exercise-categories/wordle/WordleExercise";
import { primaryRuns } from "../progressionStdlib";
import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type ProcessGameExercise from "./Exercise";
import { scenarios } from "./scenarios";

// Whether every row is exactly right is the scenarios' job, and the first
// wrong square hides the rest. These metrics see how many rows the game loop
// reaches, how many squares are right across the main scenarios, and (once
// the main task is solved) progress on the bonus duplicate-letter rule.
const LONGEST_GAME_SLUG = "phew";
const LONGEST_GAME_ROWS = 6;

function scenarioArgs(slug: string): { target: string; guesses: string[] } {
  const scenario = scenarios.find((candidate) => candidate.slug === slug);
  const [target, guesses] = (scenario?.functionCall?.args ?? ["", []]) as [string, string[]];
  return { target, guesses };
}

function rowsColored(runs: ScenarioRuns): number {
  const exercise = runs.bySlug(LONGEST_GAME_SLUG)?.exercise as ProcessGameExercise | undefined;
  if (!exercise) {
    return 0;
  }
  let colored = 0;
  for (let row = 0; row < LONGEST_GAME_ROWS; row++) {
    if (exercise.statesForRow(row).length > 0) {
      colored++;
    }
  }
  return colored;
}

// The fraction of the main scenarios' squares colored with the right state,
// by the main task's simplified rule.
function squaresCorrect(runs: ScenarioRuns): number {
  let squares = 0;
  let correct = 0;
  for (const run of primaryRuns(runs)) {
    const { target, guesses } = scenarioArgs(run.scenarioSlug);
    const exercise = run.exercise as ProcessGameExercise | undefined;
    guesses.forEach((guess, row) => {
      const actual = exercise?.statesForRow(row) ?? [];
      for (let idx = 0; idx < guess.length; idx++) {
        squares++;
        if (actual[idx] === simpleState(target, guess, idx)) {
          correct++;
        }
      }
    });
  }
  return squares === 0 ? 0 : correct / squares;
}

// Across the bonus scenarios, the fraction of the squares where the full
// duplicate-letter rule disagrees with the simplified one that the student
// colors by the full rule.
function duplicateSquaresHandled(runs: ScenarioRuns): number {
  let squares = 0;
  let handled = 0;
  for (const run of runs.all.filter((candidate) => candidate.isolated !== true && candidate.bonus === true)) {
    const { target, guesses } = scenarioArgs(run.scenarioSlug);
    const exercise = run.exercise as ProcessGameExercise | undefined;
    guesses.forEach((guess, row) => {
      const full = scoreGuess(target, guess);
      const actual = exercise?.statesForRow(row) ?? [];
      for (let idx = 0; idx < guess.length; idx++) {
        if (full[idx] === simpleState(target, guess, idx)) {
          continue;
        }
        squares++;
        if (actual[idx] === full[idx]) {
          handled++;
        }
      }
    });
  }
  return squares === 0 ? 0 : handled / squares;
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // The headline concept: one colorRow per guess, each on its own row.
      // Partial progress through the six-guess game.
      name: "rows_colored",
      maxScore: LONGEST_GAME_ROWS,
      points: 4,
      score: (runs) => rowsColored(runs)
    },
    {
      // Partial progress: squares colored correctly across the main scenarios.
      name: "squares_correct",
      maxScore: 1,
      points: 5,
      score: (runs) => squaresCorrect(runs)
    },
    {
      // Post-solve refinement toward the bonus: the squares that need the
      // duplicate-letter rule. Gated on the main task being solved, since
      // coloring everything gray would otherwise get these right by accident.
      name: "handles_duplicates",
      maxScore: 1,
      points: 3,
      score: (runs) => (runs.allPassed() ? duplicateSquaresHandled(runs) : 0)
    }
  ]
};
