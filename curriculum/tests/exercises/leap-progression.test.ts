import { describe, expect, it } from "vitest";
import leapExercise from "../../src/exercises/leap";
import { progressionMetrics } from "../../src/exercises/leap/progressionMetrics";
import solutionJavascript from "../../src/exercises/leap/solution.javascript?raw";
import solutionJiki from "../../src/exercises/leap/solution.jiki?raw";
import solutionPy from "../../src/exercises/leap/solution.py?raw";
import stubJavascript from "../../src/exercises/leap/stub.javascript?raw";
import stubJiki from "../../src/exercises/leap/stub.jiki?raw";
import stubPy from "../../src/exercises/leap/stub.py?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(leapExercise, studentCode, language);
  // The one-line bonus scenario is excluded from the anchor and allPassed().
  const runs = buildScenarioRuns(results, leapExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

const SOLUTIONS: Record<Language, string> = {
  jikiscript: solutionJiki,
  javascript: solutionJavascript,
  python: solutionPy
};

const STUBS: Record<Language, string> = {
  jikiscript: stubJiki,
  javascript: stubJavascript,
  python: stubPy
};

// Stops at the divisible-by-4 rule, missing the century exception.
const DIVISIBLE_BY_FOUR_ATTEMPT = `function isLeapYear(year) {
  return year % 4 === 0
}`;

describe("leap progression", () => {
  const languages: Language[] = ["jikiscript", "javascript", "python"];

  for (const language of languages) {
    it(`scores the full anchor, uses_modulo, and full loc for the ${language} solution`, () => {
      const scores = runProgression(SOLUTIONS[language], language);

      // Every solution is at or under the 3-line one-liner target.
      expect(scores).toEqual({
        score: 16,
        metrics: { scenarios: 10, uses_modulo: 3, loc: 3 }
      });
    });

    it(`scores 0 for the ${language} stub`, () => {
      const scores = runProgression(STUBS[language], language);

      expect(scores).toEqual({
        score: 0,
        metrics: { scenarios: 0, uses_modulo: 0, loc: 0 }
      });
    });
  }

  it("scores uses_modulo plus a partial anchor for divisible-by-4 only, with no loc points", () => {
    const scores = runProgression(DIVISIBLE_BY_FOUR_ATTEMPT, "javascript");

    // The three century years fail: 6 of 9 scenarios. loc stays 0 until solved.
    expect(scores).toEqual({
      score: 10,
      metrics: { scenarios: 7, uses_modulo: 3, loc: 0 }
    });
  });
});
