import { describe, expect, it } from "vitest";
import bouncerExercise from "../../src/exercises/bouncer";
import { progressionMetrics } from "../../src/exercises/bouncer/progressionMetrics";
import solutionJavascript from "../../src/exercises/bouncer/solution.javascript?raw";
import solutionJiki from "../../src/exercises/bouncer/solution.jiki?raw";
import solutionPy from "../../src/exercises/bouncer/solution.py?raw";
import stubJiki from "../../src/exercises/bouncer/stub.jiki?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language = "jikiscript") {
  const results = runExerciseTests(bouncerExercise, studentCode, language);
  const runs = buildScenarioRuns(results, bouncerExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

const SOLUTIONS: Partial<Record<Language, string>> = {
  jikiscript: solutionJiki,
  javascript: solutionJavascript,
  python: solutionPy
};

// Reads the age but never decides anything with it.
const READ_ONLY_ATTEMPT = `set age to ask_age()`;

// Uses a comparison, but with the boundary wrong (20 should not get in).
const WRONG_BOUNDARY_ATTEMPT = `set age to ask_age()

if age >= 20 do
  let_in()
end`;

describe("bouncer progression", () => {
  for (const [language, solution] of Object.entries(SOLUTIONS)) {
    it(`scores the full anchor plus both metrics for the ${language} solution`, () => {
      const scores = runProgression(solution, language as Language);

      expect(scores).toEqual({
        score: 21,
        metrics: { scenarios: 10, read_the_age: 3, used_comparison: 8 }
      });
    });
  }

  it("scores only the do-nothing anchor for the stub", () => {
    const scores = runProgression(stubJiki);

    // Doing nothing passes the two "don't let them in" scenarios (2 of 4).
    expect(scores).toEqual({
      score: 5,
      metrics: { scenarios: 5, read_the_age: 0, used_comparison: 0 }
    });
  });

  it("scores read_the_age for code that only reads the age", () => {
    const scores = runProgression(READ_ONLY_ATTEMPT);

    expect(scores).toEqual({
      score: 8,
      metrics: { scenarios: 5, read_the_age: 3, used_comparison: 0 }
    });
  });

  it("scores both metrics for a comparison with the wrong boundary", () => {
    const scores = runProgression(WRONG_BOUNDARY_ATTEMPT);

    // age >= 20 wrongly lets the 20-year-old in: 3 of 4 scenarios pass.
    expect(scores).toEqual({
      score: 19,
      metrics: { scenarios: 8, read_the_age: 3, used_comparison: 8 }
    });
  });
});
