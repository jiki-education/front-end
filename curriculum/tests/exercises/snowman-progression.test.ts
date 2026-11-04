import { describe, expect, it } from "vitest";
import snowmanExercise from "../../src/exercises/snowman";
import { progressionMetrics } from "../../src/exercises/snowman/progressionMetrics";
import solutionJavascript from "../../src/exercises/snowman/solution.javascript?raw";
import solutionJiki from "../../src/exercises/snowman/solution.jiki?raw";
import stubJavascript from "../../src/exercises/snowman/stub.javascript?raw";
import stubJiki from "../../src/exercises/snowman/stub.jiki?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language = "jikiscript") {
  const results = runExerciseTests(snowmanExercise, studentCode, language);
  const runs = buildScenarioRuns(results, snowmanExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// Python is excluded: the python interpreter currently fails the DrawExercise
// isNumber guards ("inputs must be numbers"), so draw solutions cannot pass
// (the repo-wide solution-validation test also only runs javascript).
const SOLUTIONS: Partial<Record<Language, string>> = {
  jikiscript: solutionJiki,
  javascript: solutionJavascript
};

const STUBS: Partial<Record<Language, string>> = {
  jikiscript: stubJiki,
  javascript: stubJavascript
};

// The base variables fixed, body and head calls removed while working.
const BASE_FIXED_ATTEMPT = `set snowman_center_x to 50
set base_center_y to 70
set base_radius to 20
circle(snowman_center_x, base_center_y, base_radius, "white")`;

// The base fixed but the body variables still missing: the run errors at
// runtime, yet the halted exercise still carries the correctly-drawn base.
const RUNTIME_ERROR_ATTEMPT = `set snowman_center_x to 50
set base_center_y to 70
set base_radius to 20
circle(snowman_center_x, base_center_y, base_radius, "white")
circle(snowman_center_x, body_center_y, body_radius, "white")`;

describe("snowman progression", () => {
  const languages: Language[] = ["jikiscript", "javascript"];

  for (const language of languages) {
    it(`scores the full anchor plus full circles_in_place for the ${language} solution`, () => {
      const scores = runProgression(SOLUTIONS[language]!, language);

      expect(scores).toEqual({
        score: 15,
        metrics: { scenarios: 10, circles_in_place: 5 }
      });
    });

    it(`scores 0 for the ${language} stub (wrong values, then a runtime error)`, () => {
      const scores = runProgression(STUBS[language]!, language);

      expect(scores).toEqual({
        score: 0,
        metrics: { scenarios: 0, circles_in_place: 0 }
      });
    });
  }

  it("scores partial circles_in_place once the base variables are fixed", () => {
    const scores = runProgression(BASE_FIXED_ATTEMPT);

    // 1 of 3 circles: round(5 * 1 / 3) = 2.
    expect(scores).toEqual({
      score: 2,
      metrics: { scenarios: 0, circles_in_place: 2 }
    });
  });

  it("still credits the base circle when a later line errors at runtime", () => {
    const scores = runProgression(RUNTIME_ERROR_ATTEMPT);

    expect(scores).toEqual({
      score: 2,
      metrics: { scenarios: 0, circles_in_place: 2 }
    });
  });

  it("scores every metric 0 when no scenario runs are available", () => {
    const scores = runProgressionMirror(progressionMetrics, buildScenarioRuns([]), "jikiscript");

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, circles_in_place: 0 }
    });
  });
});
