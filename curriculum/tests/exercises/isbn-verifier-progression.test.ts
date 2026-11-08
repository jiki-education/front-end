import { describe, expect, it } from "vitest";
import isbnVerifierExercise from "../../src/exercises/isbn-verifier";
import { progressionMetrics } from "../../src/exercises/isbn-verifier/progressionMetrics";
import solutionJavascript from "../../src/exercises/isbn-verifier/solution.javascript?raw";
import stubJavascript from "../../src/exercises/isbn-verifier/stub.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(isbnVerifierExercise, studentCode, language);
  const runs = buildScenarioRuns(results, isbnVerifierExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// Always returns false.
const ALWAYS_FALSE_ATTEMPT = `function isValidIsbn(isbn) {
  return false
}`;

// Computes the weighted sum over the digits, ignoring everything else.
const CHECKSUM_ONLY_ATTEMPT = `function isValidIsbn(isbn) {
  let total = 0
  let multiplier = 10
  for (const char of isbn) {
    if ("0123456789".includes(char)) {
      total = total + Number(char) * multiplier
      multiplier = multiplier - 1
    }
  }
  return total % 11 === 0
}`;

// Validates everything except an X check digit.
const NO_X_ATTEMPT = `function isValidIsbn(isbn) {
  let total = 0
  let multiplier = 10
  for (const char of isbn) {
    if (char === "-") {
      continue
    }
    if (!"0123456789".includes(char)) {
      return false
    }
    total = total + Number(char) * multiplier
    multiplier = multiplier - 1
  }
  if (multiplier !== 0) {
    return false
  }
  return total % 11 === 0
}`;

describe("isbn-verifier progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 20,
      metrics: { scenarios: 10, checksum_sensitive: 5, handles_x: 3, uses_continue: 2 }
    });
  });

  it("scores 0 for the javascript stub", () => {
    expect(runProgression(stubJavascript, "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, checksum_sensitive: 0, handles_x: 0, uses_continue: 0 }
    });
  });

  it("credits only the anchor for a constant false", () => {
    // Twelve of sixteen scenarios expect false, but no metric can be faked by a constant answer.
    expect(runProgression(ALWAYS_FALSE_ATTEMPT, "javascript")).toEqual({
      score: 8,
      metrics: { scenarios: 8, checksum_sensitive: 0, handles_x: 0, uses_continue: 0 }
    });
  });

  it("credits the checksum even with no validation", () => {
    // The anchor drops below the constant-false attempt, but the checksum metric lifts it above.
    expect(runProgression(CHECKSUM_ONLY_ATTEMPT, "javascript")).toEqual({
      score: 10,
      metrics: { scenarios: 5, checksum_sensitive: 5, handles_x: 0, uses_continue: 0 }
    });
  });

  it("credits everything but X handling", () => {
    // The two X scenarios fail, and the X/A pair get the same answer.
    expect(runProgression(NO_X_ATTEMPT, "javascript")).toEqual({
      score: 16,
      metrics: { scenarios: 9, checksum_sensitive: 5, handles_x: 0, uses_continue: 2 }
    });
  });
});
