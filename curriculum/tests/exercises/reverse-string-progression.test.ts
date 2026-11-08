import { describe, expect, it } from "vitest";
import reverseStringExercise from "../../src/exercises/reverse-string";
import { progressionMetrics } from "../../src/exercises/reverse-string/progressionMetrics";
import solutionJavascript from "../../src/exercises/reverse-string/solution.javascript?raw";
import stubJavascript from "../../src/exercises/reverse-string/stub.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(reverseStringExercise, studentCode, language);
  const runs = buildScenarioRuns(results, reverseStringExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// Hands the input straight back without a loop.
const RETURN_INPUT_ATTEMPT = `function reverse(str) {
  return str
}`;

// Loops, but overwrites the result each time and keeps only the last letter.
const LAST_LETTER_ATTEMPT = `function reverse(str) {
  let result = ""
  for (const letter of str) {
    result = letter
  }
  return result
}`;

// The common stall: appends instead of prepends, rebuilding the input.
const APPENDING_ATTEMPT = `function reverse(str) {
  let result = ""
  for (const letter of str) {
    result = result + letter
  }
  return result
}`;

describe("reverse-string progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 17,
      metrics: { scenarios: 10, reads_every_letter: 3, uses_every_letter: 4 }
    });
  });

  it("scores 0 for the javascript stub", () => {
    expect(runProgression(stubJavascript, "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, reads_every_letter: 0, uses_every_letter: 0 }
    });
  });

  it("scores only the empty and palindrome scenarios for returning the input untouched", () => {
    expect(runProgression(RETURN_INPUT_ATTEMPT, "javascript")).toEqual({
      score: 2,
      metrics: { scenarios: 2, reads_every_letter: 0, uses_every_letter: 0 }
    });
  });

  it("credits the loop but not the letters when only the last letter is kept", () => {
    // Only the empty string passes: 1 of 9.
    expect(runProgression(LAST_LETTER_ATTEMPT, "javascript")).toEqual({
      score: 4,
      metrics: { scenarios: 1, reads_every_letter: 3, uses_every_letter: 0 }
    });
  });

  it("credits the loop and every letter when appending instead of prepending", () => {
    // The empty string and the palindrome pass: 2 of 9.
    expect(runProgression(APPENDING_ATTEMPT, "javascript")).toEqual({
      score: 9,
      metrics: { scenarios: 2, reads_every_letter: 3, uses_every_letter: 4 }
    });
  });
});
