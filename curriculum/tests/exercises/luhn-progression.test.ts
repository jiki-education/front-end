import { describe, expect, it } from "vitest";
import luhnExercise from "../../src/exercises/luhn";
import { progressionMetrics } from "../../src/exercises/luhn/progressionMetrics";
import solutionJavascript from "../../src/exercises/luhn/solution.javascript?raw";
import stubJavascript from "../../src/exercises/luhn/stub.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(luhnExercise, studentCode, language);
  const runs = buildScenarioRuns(results, luhnExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// Always returns false.
const ALWAYS_FALSE_ATTEMPT = `function valid(value) {
  return false
}`;

// Counted loop, but doubles from the left and never subtracts 9.
const DOUBLES_FROM_LEFT_ATTEMPT = `function valid(value) {
  let digits = ""
  for (const char of value) {
    if (char !== " ") {
      digits = digits + char
    }
  }
  let sum = 0
  for (let i = 0; i < digits.length; i++) {
    let digit = Number(digits[i])
    if (i % 2 === 1) {
      digit = digit * 2
    }
    sum = sum + digit
  }
  return sum % 10 === 0
}`;

// The full checksum, but no rejection of bad characters or short inputs.
const CHECKSUM_NO_GUARDS_ATTEMPT = `function valid(value) {
  let digits = ""
  for (const char of value) {
    if (char !== " ") {
      digits = digits + char
    }
  }
  let sum = 0
  for (let i = 0; i < digits.length; i++) {
    let digit = Number(digits[i])
    if ((digits.length - 1 - i) % 2 === 1) {
      digit = digit * 2
      if (digit > 9) {
        digit = digit - 9
      }
    }
    sum = sum + digit
  }
  return sum % 10 === 0
}`;

describe("luhn progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 20,
      metrics: { scenarios: 10, checksum_sensitive: 5, uses_counted_for: 3, uses_modulo: 2 }
    });
  });

  it("scores 0 for the javascript stub", () => {
    expect(runProgression(stubJavascript, "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, checksum_sensitive: 0, uses_counted_for: 0, uses_modulo: 0 }
    });
  });

  it("credits only the anchor for a constant false", () => {
    // Most scenarios expect false, but no metric can be faked by a constant answer.
    expect(runProgression(ALWAYS_FALSE_ATTEMPT, "javascript")).toEqual({
      score: 5,
      metrics: { scenarios: 5, checksum_sensitive: 0, uses_counted_for: 0, uses_modulo: 0 }
    });
  });

  it("credits the loop shape when the doubling is wrong", () => {
    // The checksum doesn't separate the two Canadian SINs yet.
    expect(runProgression(DOUBLES_FROM_LEFT_ATTEMPT, "javascript")).toEqual({
      score: 8,
      metrics: { scenarios: 3, checksum_sensitive: 0, uses_counted_for: 3, uses_modulo: 2 }
    });
  });

  it("credits the checksum before the input guards exist", () => {
    // Only the reject-bad-input scenarios fail.
    expect(runProgression(CHECKSUM_NO_GUARDS_ATTEMPT, "javascript")).toEqual({
      score: 17,
      metrics: { scenarios: 7, checksum_sensitive: 5, uses_counted_for: 3, uses_modulo: 2 }
    });
  });
});
