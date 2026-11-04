import { describe, expect, it } from "vitest";
import starsExercise from "../../src/exercises/stars";
import { progressionMetrics } from "../../src/exercises/stars/progressionMetrics";
import solutionJavascript from "../../src/exercises/stars/solution.javascript?raw";
import stubJavascript from "../../src/exercises/stars/stub.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(starsExercise, studentCode, language);
  const runs = buildScenarioRuns(results, starsExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

const ZERO = { score: 0, metrics: { scenarios: 0, stars_in_place: 0, rows_built: 0 } };

// Builds the rows correctly but never draws them.
const NEVER_DRAWS_ATTEMPT = `function layoutStars(numRows) {
  let result = []
  for (let i = numRows; i >= 1; i--) {
    let star = ""
    repeat(i) {
      star = star + "*"
    }
    result.push(star)
  }
}`;

// Counts up instead of down, drawing an upside-down pyramid.
const ASCENDING_ATTEMPT = `function layoutStars(numRows) {
  let result = []
  for (let i = 1; i <= numRows; i++) {
    let star = ""
    repeat(i) {
      star = star + "*"
    }
    result.push(star)
  }
  drawStars(result)
}`;

// Off by one: starts at numRows - 1, so the longest row is missing.
const OFF_BY_ONE_ATTEMPT = `function layoutStars(numRows) {
  let result = []
  for (let i = numRows - 1; i >= 1; i--) {
    let star = ""
    repeat(i) {
      star = star + "*"
    }
    result.push(star)
  }
  drawStars(result)
}`;

describe("stars progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 20,
      metrics: { scenarios: 10, stars_in_place: 5, rows_built: 5 }
    });
  });

  it("scores 0 for the javascript stub", () => {
    expect(runProgression(stubJavascript, "javascript")).toEqual(ZERO);
  });

  it("scores rows_built alone for building the rows without drawing them", () => {
    // "count-0" draws nothing either way, so it passes: 1 of 5.
    expect(runProgression(NEVER_DRAWS_ATTEMPT, "javascript")).toEqual({
      score: 7,
      metrics: { scenarios: 2, stars_in_place: 0, rows_built: 5 }
    });
  });

  it("scores little stars_in_place for an upside-down pyramid", () => {
    // "count-0" and "count-1" pass. 30 stars land in the outline and 25 fall
    // outside it: 5 / 55.
    expect(runProgression(ASCENDING_ATTEMPT, "javascript")).toEqual({
      score: 9,
      metrics: { scenarios: 4, stars_in_place: 0, rows_built: 5 }
    });
  });

  it("scores most stars_in_place when the longest row is missing", () => {
    // Only "count-0" passes. 45 of 55 stars are in place, 9 of 10 rows built.
    expect(runProgression(OFF_BY_ONE_ATTEMPT, "javascript")).toEqual({
      score: 11,
      metrics: { scenarios: 2, stars_in_place: 4, rows_built: 5 }
    });
  });
});
