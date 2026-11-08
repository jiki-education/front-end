import { describe, expect, it } from "vitest";
import digitalRootExercise from "../../src/exercises/digital-root";
import { progressionMetrics } from "../../src/exercises/digital-root/progressionMetrics";
import solutionJavascript from "../../src/exercises/digital-root/solution.javascript?raw";
import stubJavascript from "../../src/exercises/digital-root/stub.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(digitalRootExercise, studentCode, language);
  const runs = buildScenarioRuns(results, digitalRootExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// Sums the digits a single time, with no outer loop.
const SUM_ONCE_ATTEMPT = `function digitalRoot(number) {
  let sum = 0
  for (const char of String(number)) {
    sum = sum + Number(char)
  }
  return sum
}`;

// Has the while loop, but never replaces the number with the sum, so it loops forever.
const WHILE_NEVER_UPDATES_ATTEMPT = `function digitalRoot(number) {
  let sum = 0
  while (number >= 10) {
    sum = 0
    for (const char of String(number)) {
      sum = sum + Number(char)
    }
  }
  return number
}`;

describe("digital-root progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 18,
      metrics: { scenarios: 10, sums_digits: 4, uses_while: 4 }
    });
  });

  it("scores 0 for the javascript stub", () => {
    expect(runProgression(stubJavascript, "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, sums_digits: 0, uses_while: 0 }
    });
  });

  it("credits a single pass of digit-summing", () => {
    // Every multi-digit answer is a valid digit sum, so the summing step is credited on the collapse scenarios it fails.
    expect(runProgression(SUM_ONCE_ATTEMPT, "javascript")).toEqual({
      score: 9,
      metrics: { scenarios: 5, sums_digits: 4, uses_while: 0 }
    });
  });

  it("credits the while loop when the number is never updated", () => {
    // Only the single-digit scenarios pass; the rest hit the loop limit.
    expect(runProgression(WHILE_NEVER_UPDATES_ATTEMPT, "javascript")).toEqual({
      score: 7,
      metrics: { scenarios: 3, sums_digits: 0, uses_while: 4 }
    });
  });
});
