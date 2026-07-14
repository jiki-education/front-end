import { describe, expect, it } from "vitest";
import triangleExercise from "../../src/exercises/triangle";
import { progressionMetrics } from "../../src/exercises/triangle/progressionMetrics";
import solutionJavascript from "../../src/exercises/triangle/solution.javascript?raw";
import solutionJiki from "../../src/exercises/triangle/solution.jiki?raw";
import solutionPy from "../../src/exercises/triangle/solution.py?raw";
import stubJavascript from "../../src/exercises/triangle/stub.javascript?raw";
import stubJiki from "../../src/exercises/triangle/stub.jiki?raw";
import stubPy from "../../src/exercises/triangle/stub.py?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(triangleExercise, studentCode, language);
  const runs = buildScenarioRuns(results, triangleExercise);
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

// Returns a valid classification string without combining any conditions.
const CONSTANT_ATTEMPT = `function determineTriangleType(side1, side2, side3) {
  return "invalid"
}`;

// Combines conditions but only knows about equilateral triangles.
const EQUILATERAL_ONLY_ATTEMPT = `function determineTriangleType(side1, side2, side3) {
  if (side1 === side2 && side2 === side3) {
    return "equilateral"
  }
  return "scalene"
}`;

describe("triangle progression", () => {
  const languages: Language[] = ["jikiscript", "javascript", "python"];

  for (const language of languages) {
    it(`scores the full anchor plus both metrics for the ${language} solution`, () => {
      const scores = runProgression(SOLUTIONS[language], language);

      expect(scores).toEqual({
        score: 15,
        metrics: { scenarios: 10, combines_conditions: 3, returns_string: 2 }
      });
    });

    it(`scores 0 for the ${language} stub`, () => {
      const scores = runProgression(STUBS[language], language);

      expect(scores).toEqual({
        score: 0,
        metrics: { scenarios: 0, combines_conditions: 0, returns_string: 0 }
      });
    });
  }

  it('scores returns_string plus the anchor share for a constant "invalid"', () => {
    const scores = runProgression(CONSTANT_ATTEMPT, "javascript");

    // The five invalid scenarios pass: 5 of 10.
    expect(scores).toEqual({
      score: 7,
      metrics: { scenarios: 5, combines_conditions: 0, returns_string: 2 }
    });
  });

  it("scores combines_conditions for an equilateral-only attempt", () => {
    const scores = runProgression(EQUILATERAL_ONLY_ATTEMPT, "javascript");

    // valid-equilateral and valid-scalene pass: 2 of 10.
    expect(scores).toEqual({
      score: 7,
      metrics: { scenarios: 2, combines_conditions: 3, returns_string: 2 }
    });
  });
});
