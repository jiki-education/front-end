import { describe, expect, it } from "vitest";
import lowerPangramExercise from "../../src/exercises/lower-pangram";
import { progressionMetrics } from "../../src/exercises/lower-pangram/progressionMetrics";
import solutionJavascript from "../../src/exercises/lower-pangram/solution.javascript?raw";
import stubJavascript from "../../src/exercises/lower-pangram/stub.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(lowerPangramExercise, studentCode, language);
  const runs = buildScenarioRuns(results, lowerPangramExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// Correct logic with the search inlined as a nested loop (the route the
// instructions suggest trying first).
const NESTED_LOOPS_ATTEMPT = `function isPangram(sentence) {
  for (const letter of "abcdefghijklmnopqrstuvwxyz") {
    let found = false
    for (const character of sentence) {
      if (character === letter) {
        found = true
      }
    }
    if (!found) {
      return false
    }
  }
  return true
}`;

// A working helper, but isPangram walks the sentence instead of the
// alphabet, so spaces and digits count as "missing letters".
const WRONG_LOOP_ATTEMPT = `function includes(haystack, needle) {
  for (const character of haystack) {
    if (needle === character) {
      return true
    }
  }
  return false
}

function isPangram(sentence) {
  for (const character of sentence) {
    if (!includes("abcdefghijklmnopqrstuvwxyz", character)) {
      return false
    }
  }
  return true
}`;

// The helper never returns false, so a missing letter comes back undefined.
// In JavaScript !undefined is true, so every scenario still passes.
const MISSING_RETURN_FALSE_ATTEMPT = `function includes(haystack, needle) {
  for (const character of haystack) {
    if (needle === character) {
      return true
    }
  }
}

function isPangram(sentence) {
  for (const letter of "abcdefghijklmnopqrstuvwxyz") {
    if (!includes(sentence, letter)) {
      return false
    }
  }
  return true
}`;

describe("lower-pangram progression", () => {
  it("scores full marks for the javascript solution", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 22,
      metrics: { scenarios: 10, uses_search_helper: 6, search_helper_correct: 4, loc: 2 }
    });
  });

  it("scores 0 for the javascript stub", () => {
    expect(runProgression(stubJavascript, "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, uses_search_helper: 0, search_helper_correct: 0, loc: 0 }
    });
  });

  it("scores no helper credit for a nested-loop solution", () => {
    // Only the final scenario (which carries the no-nested-loops check) fails.
    expect(runProgression(NESTED_LOOPS_ATTEMPT, "javascript")).toEqual({
      score: 9,
      metrics: { scenarios: 9, uses_search_helper: 0, search_helper_correct: 0, loc: 0 }
    });
  });

  it("scores the helper metrics when the helper works but isPangram loops over the wrong string", () => {
    // Half the scenarios fail: spaces, digits and underscores read as missing
    // letters, and the empty sentence returns true.
    expect(runProgression(WRONG_LOOP_ATTEMPT, "javascript")).toEqual({
      score: 15,
      metrics: { scenarios: 5, uses_search_helper: 6, search_helper_correct: 4, loc: 0 }
    });
  });

  it("scores partial helper correctness when the helper never returns false", () => {
    expect(runProgression(MISSING_RETURN_FALSE_ATTEMPT, "javascript")).toEqual({
      score: 20,
      metrics: { scenarios: 10, uses_search_helper: 6, search_helper_correct: 2, loc: 2 }
    });
  });

  it("scores every metric 0 when no scenario runs are available", () => {
    expect(runProgressionMirror(progressionMetrics, buildScenarioRuns([]), "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, uses_search_helper: 0, search_helper_correct: 0, loc: 0 }
    });
  });
});
