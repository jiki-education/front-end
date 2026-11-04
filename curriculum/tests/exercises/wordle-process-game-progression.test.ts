import { describe, expect, it } from "vitest";
import processGameExercise from "../../src/exercises/wordle-process-game";
import { progressionMetrics } from "../../src/exercises/wordle-process-game/progressionMetrics";
import solutionJavascript from "../../src/exercises/wordle-process-game/solution.javascript?raw";
import stubJavascript from "../../src/exercises/wordle-process-game/stub.javascript?raw";
import guessSolutionJavascript from "../../src/exercises/wordle-process-guess/solution.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(processGameExercise, studentCode, language);
  const runs = buildScenarioRuns(results, processGameExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// The stubs splice in the student's previous-exercise code. With no prior
// submission the placeholder resolves to an empty string.
function withoutPriorCode(stub: string): string {
  return stub.replace("{{LESSON:wordle-process-guess}}", "");
}

const ZERO = {
  score: 0,
  metrics: { scenarios: 0, rows_colored: 0, squares_correct: 0, handles_duplicates: 0 }
};

// The previous exercise's code plus a loop that calls it per guess. Every
// guess still colors row 1, so only the last guess survives on the board.
const STILL_ROW_ONE_ATTEMPT = `${guessSolutionJavascript}

function processGame(target, guesses) {
  for (const guess of guesses) {
    processGuess(target, guess)
  }
}`;

// The simplified rules from the previous exercise, generalised per row.
// Solves the main task but not the duplicate-letter bonus.
const SIMPLE_RULES_SOLUTION = `function processGuess(target, guess) {
  let states = []
  for (let idx = 0; idx < guess.length; idx++) {
    if (target[idx] === guess[idx]) {
      states.push("correct")
    } else if (target.includes(guess[idx])) {
      states.push("present")
    } else {
      states.push("absent")
    }
  }
  return states
}

function processGame(target, guesses) {
  for (let idx = 0; idx < guesses.length; idx++) {
    colorRow(idx + 1, processGuess(target, guesses[idx]))
  }
}`;

// The common wrong bonus answer: a letter is only yellow while the guess so
// far (greens included) hasn't used up the target's supply of it. Right for
// "colly", wrong for "swiss", where the later green "s" isn't seen yet.
const LEFT_TO_RIGHT_ONLY_SOLUTION = `function countLetter(letters, letter, upTo) {
  let count = 0
  for (let idx = 0; idx < upTo; idx++) {
    if (letters[idx] === letter) {
      count = count + 1
    }
  }
  return count
}

function processGuess(target, guess) {
  let states = []
  for (let idx = 0; idx < guess.length; idx++) {
    let letter = guess[idx]
    if (target[idx] === letter) {
      states.push("correct")
    } else if (countLetter(guess, letter, idx + 1) <= countLetter(target, letter, target.length)) {
      states.push("present")
    } else {
      states.push("absent")
    }
  }
  return states
}

function processGame(target, guesses) {
  for (let idx = 0; idx < guesses.length; idx++) {
    colorRow(idx + 1, processGuess(target, guesses[idx]))
  }
}`;

describe("wordle-process-game progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 22,
      metrics: { scenarios: 10, rows_colored: 4, squares_correct: 5, handles_duplicates: 3 }
    });
  });

  it("scores 0 for the javascript stub with no prior code", () => {
    expect(runProgression(withoutPriorCode(stubJavascript), "javascript")).toEqual(ZERO);
  });

  it("scores one row for looping the previous exercise's code unchanged", () => {
    // "hole-in-one" passes: 1 of 4. Only row 1 is ever colored.
    const { metrics } = runProgression(STILL_ROW_ONE_ATTEMPT, "javascript");

    expect(metrics.scenarios).toBe(3);
    expect(metrics.rows_colored).toBe(1);
    expect(metrics.squares_correct).toBeGreaterThan(0);
    expect(metrics.squares_correct).toBeLessThan(5);
    expect(metrics.handles_duplicates).toBe(0);
  });

  it("scores everything but handles_duplicates for the simplified rules", () => {
    expect(runProgression(SIMPLE_RULES_SOLUTION, "javascript")).toEqual({
      score: 19,
      metrics: { scenarios: 10, rows_colored: 4, squares_correct: 5, handles_duplicates: 0 }
    });
  });

  it("scores half of handles_duplicates for the left-to-right-only duplicate rule", () => {
    // Gets the "colly" square right and the "swiss" square wrong: 1 of 2.
    expect(runProgression(LEFT_TO_RIGHT_ONLY_SOLUTION, "javascript")).toEqual({
      score: 21,
      metrics: { scenarios: 10, rows_colored: 4, squares_correct: 5, handles_duplicates: 2 }
    });
  });
});
