import { describe, expect, it } from "vitest";
import processGuessExercise from "../../src/exercises/wordle-process-guess";
import { progressionMetrics } from "../../src/exercises/wordle-process-guess/progressionMetrics";
import solutionJavascript from "../../src/exercises/wordle-process-guess/solution.javascript?raw";
import stubJavascript from "../../src/exercises/wordle-process-guess/stub.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(processGuessExercise, studentCode, language);
  const runs = buildScenarioRuns(results, processGuessExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// Paints every row fully green without looking at the letters.
const ALL_GREEN_ATTEMPT = `function processGuess(target, guess) {
  colorRow(1, ["correct", "correct", "correct", "correct", "correct"])
}`;

// Greens and grays are right, but there is no check for letters elsewhere
// in the word, so every yellow comes out gray.
const NO_PRESENT_ATTEMPT = `function processGuess(target, guess) {
  let states = []
  for (let idx = 0; idx < guess.length; idx++) {
    if (target[idx] === guess[idx]) {
      states.push("correct")
    } else {
      states.push("absent")
    }
  }
  colorRow(1, states)
}`;

describe("wordle-process-guess progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 19,
      metrics: { scenarios: 10, squares_correct: 6, builds_with_push: 3 }
    });
  });

  it("scores 0 for the javascript stub", () => {
    expect(runProgression(stubJavascript, "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, squares_correct: 0, builds_with_push: 0 }
    });
  });

  it("scores only the greens that happen to be right for an all-green row", () => {
    // "all-correct" passes: 1 of 5. 11 of 25 squares are truly green.
    expect(runProgression(ALL_GREEN_ATTEMPT, "javascript")).toEqual({
      score: 5,
      metrics: { scenarios: 2, squares_correct: 3, builds_with_push: 0 }
    });
  });

  it("scores most squares when only the yellow check is missing", () => {
    // "all-correct" and "absent" pass: 2 of 5. 17 of 25 squares are right.
    expect(runProgression(NO_PRESENT_ATTEMPT, "javascript")).toEqual({
      score: 11,
      metrics: { scenarios: 4, squares_correct: 4, builds_with_push: 3 }
    });
  });
});
