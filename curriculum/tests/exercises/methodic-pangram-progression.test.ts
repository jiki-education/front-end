import { describe, expect, it } from "vitest";
import methodicPangramExercise from "../../src/exercises/methodic-pangram";
import { progressionMetrics } from "../../src/exercises/methodic-pangram/progressionMetrics";
import solutionJavascript from "../../src/exercises/methodic-pangram/solution.javascript?raw";
import pangramSolutionJavascript from "../../src/exercises/pangram/solution.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(methodicPangramExercise, studentCode, language);
  const runs = buildScenarioRuns(results, methodicPangramExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// Halfway: the built-in toLowerCase is in, but the hand-written includes is
// still doing the searching.
const KEEPS_OWN_INCLUDES_ATTEMPT = `function includes(haystack, needle) {
  for (const character of haystack) {
    if (needle === character) {
      return true
    }
  }
  return false
}

function isPangram(sentence) {
  sentence = sentence.toLowerCase()
  for (const letter of "abcdefghijklmnopqrstuvwxyz") {
    if (!includes(sentence, letter)) {
      return false
    }
  }
  return true
}`;

// Both built-ins, but toLowerCase's result is never kept (it returns a new
// string rather than changing the original).
const RESULT_DISCARDED_ATTEMPT = `function isPangram(sentence) {
  sentence.toLowerCase()
  for (const letter of "abcdefghijklmnopqrstuvwxyz") {
    if (!sentence.includes(letter)) {
      return false
    }
  }
  return true
}`;

describe("methodic-pangram progression", () => {
  it("scores full marks for the javascript refactor", () => {
    expect(runProgression(solutionJavascript, "javascript")).toEqual({
      score: 22,
      metrics: { scenarios: 10, uses_case_method: 6, drops_manual_helpers: 6 }
    });
  });

  it("scores 0 for the stub", () => {
    // The raw stub is a {{LESSON:...}} placeholder, which never parses.
    expect(runProgression("{{LESSON:pangram}}", "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, uses_case_method: 0, drops_manual_helpers: 0 }
    });
  });

  it("scores only the baseline for the carried-in javascript pangram code", () => {
    // The hand-written code already passes every scenario.
    expect(runProgression(pangramSolutionJavascript, "javascript")).toEqual({
      score: 10,
      metrics: { scenarios: 10, uses_case_method: 0, drops_manual_helpers: 0 }
    });
  });

  it("scores the case method and part of drops_manual_helpers when the own includes stays", () => {
    // The case-conversion and indexOf helpers are gone, includes is not: 2 of 3.
    expect(runProgression(KEEPS_OWN_INCLUDES_ATTEMPT, "javascript")).toEqual({
      score: 20,
      metrics: { scenarios: 10, uses_case_method: 6, drops_manual_helpers: 4 }
    });
  });

  it("scores both metrics when the built-ins are in but toLowerCase's result is discarded", () => {
    // Only the mixed-case scenario fails: 10 of 11.
    expect(runProgression(RESULT_DISCARDED_ATTEMPT, "javascript")).toEqual({
      score: 21,
      metrics: { scenarios: 9, uses_case_method: 6, drops_manual_helpers: 6 }
    });
  });

  it("scores every metric 0 when no scenario runs are available", () => {
    expect(runProgressionMirror(progressionMetrics, buildScenarioRuns([]), "javascript")).toEqual({
      score: 0,
      metrics: { scenarios: 0, uses_case_method: 0, drops_manual_helpers: 0 }
    });
  });
});
