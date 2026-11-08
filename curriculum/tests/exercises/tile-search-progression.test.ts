import { describe, expect, it } from "vitest";
import tileSearchExercise from "../../src/exercises/tile-search";
import { progressionMetrics } from "../../src/exercises/tile-search/progressionMetrics";
import solutionJavascript from "../../src/exercises/tile-search/solution.javascript?raw";
import stubJavascript from "../../src/exercises/tile-search/stub.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(tileSearchExercise, studentCode, language);
  const runs = buildScenarioRuns(results, tileSearchExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// Guesses a constant answer without looking at the rack.
const ALWAYS_TRUE_ATTEMPT = `function contains(haystack, needle) {
  return true
}`;

// The classic trap: returns false inside the loop, so only the first tile is
// ever checked.
const EARLY_FALSE_ATTEMPT = `function contains(haystack, needle) {
  for (const letter of haystack) {
    if (letter === needle) {
      return true
    } else {
      return false
    }
  }
  return false
}`;

// Searches the whole rack but never returns false after the loop.
const NO_FINAL_RETURN_ATTEMPT = `function contains(haystack, needle) {
  for (const letter of haystack) {
    if (letter === needle) {
      return true
    }
  }
}`;

describe("tile-search progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 20,
      metrics: { scenarios: 10, loops_through_rack: 3, checks_every_tile: 5, loc: 2 }
    });
  });

  it("scores 0 for the javascript stub", () => {
    expect(runProgression(stubJavascript, "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, loops_through_rack: 0, checks_every_tile: 0, loc: 0 }
    });
  });

  it("scores only the scenarios a constant true happens to pass", () => {
    // Five of the eight scenarios expect true.
    expect(runProgression(ALWAYS_TRUE_ATTEMPT, "javascript")).toEqual({
      score: 6,
      metrics: { scenarios: 6, loops_through_rack: 0, checks_every_tile: 0, loc: 0 }
    });
  });

  it("credits the loop but only one tile of coverage when it returns false inside the loop", () => {
    // Passes the same five scenarios as a constant true, but the loop is
    // there and checks one of the five tiles in the not-found search.
    expect(runProgression(EARLY_FALSE_ATTEMPT, "javascript")).toEqual({
      score: 10,
      metrics: { scenarios: 6, loops_through_rack: 3, checks_every_tile: 1, loc: 0 }
    });
  });

  it("credits full coverage when only the final return false is missing", () => {
    // The three not-found scenarios return nothing: 5 of 8.
    expect(runProgression(NO_FINAL_RETURN_ATTEMPT, "javascript")).toEqual({
      score: 14,
      metrics: { scenarios: 6, loops_through_rack: 3, checks_every_tile: 5, loc: 0 }
    });
  });
});
