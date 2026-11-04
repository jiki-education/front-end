import { describe, expect, it } from "vitest";
import drivingTestExercise from "../../src/exercises/driving-test";
import { progressionMetrics } from "../../src/exercises/driving-test/progressionMetrics";
import solutionJavascript from "../../src/exercises/driving-test/solution.javascript?raw";
import stubJavascript from "../../src/exercises/driving-test/stub.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(drivingTestExercise, studentCode, language);
  const runs = buildScenarioRuns(results, drivingTestExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// Guesses a constant answer without reading the marks.
const ALWAYS_FALSE_ATTEMPT = `function didTheyPass(marks) {
  return false
}`;

// Stops at a major but never counts minors.
const MAJORS_ONLY_ATTEMPT = `function didTheyPass(marks) {
  for (const mark of marks) {
    if (mark === "💥") {
      return false
    }
  }
  return true
}`;

// Solves it by tallying majors and checking at the end, missing the early
// return the exercise is built around.
const TALLY_AT_END_ATTEMPT = `function didTheyPass(marks) {
  let minors = 0
  let majors = 0
  for (const mark of marks) {
    if (mark === "💥") {
      majors = majors + 1
    }
    if (mark === "❌") {
      minors = minors + 1
    }
  }
  return majors === 0 && minors < 5
}`;

describe("driving-test progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 18,
      metrics: { scenarios: 10, reads_every_mark: 3, returns_early_on_major: 3, loc: 2 }
    });
  });

  it("scores 0 for the javascript stub", () => {
    expect(runProgression(stubJavascript, "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, reads_every_mark: 0, returns_early_on_major: 0, loc: 0 }
    });
  });

  it("scores only the scenarios a constant false happens to pass", () => {
    // Three of the five scenarios expect false.
    expect(runProgression(ALWAYS_FALSE_ATTEMPT, "javascript")).toEqual({
      score: 6,
      metrics: { scenarios: 6, reads_every_mark: 0, returns_early_on_major: 0, loc: 0 }
    });
  });

  it("credits the loop and the early return before minors are counted", () => {
    // Only one-mistake-too-many fails: 4 of 5.
    expect(runProgression(MAJORS_ONLY_ATTEMPT, "javascript")).toEqual({
      score: 14,
      metrics: { scenarios: 8, reads_every_mark: 3, returns_early_on_major: 3, loc: 0 }
    });
  });

  it("withholds the early-return credit from a tally-at-the-end solution", () => {
    // Solved in 13 lines, so the line-count metric rounds to full points.
    expect(runProgression(TALLY_AT_END_ATTEMPT, "javascript")).toEqual({
      score: 15,
      metrics: { scenarios: 10, reads_every_mark: 3, returns_early_on_major: 0, loc: 2 }
    });
  });
});
