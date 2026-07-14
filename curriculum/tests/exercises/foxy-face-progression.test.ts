import { describe, expect, it } from "vitest";
import foxyFaceExercise from "../../src/exercises/foxy-face";
import { progressionMetrics } from "../../src/exercises/foxy-face/progressionMetrics";
import solutionJavascript from "../../src/exercises/foxy-face/solution.javascript?raw";
import solutionJiki from "../../src/exercises/foxy-face/solution.jiki?raw";
import stubJavascript from "../../src/exercises/foxy-face/stub.javascript?raw";
import stubJiki from "../../src/exercises/foxy-face/stub.jiki?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language = "jikiscript") {
  const results = runExerciseTests(foxyFaceExercise, studentCode, language);
  const runs = buildScenarioRuns(results, foxyFaceExercise);
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

// The left half of the fox: ear, face, and cheek (3 of 7 components).
const LEFT_HALF_ATTEMPT = `triangle(10, 40, 10, 5, 50, 40, "brown")
triangle(50, 30, 50, 95, 10, 40, "orange")
triangle(10, 40, 5, 60, 50, 95, "white")`;

// Every component present, but the ears are drawn after the faces so the
// layering expectations fail. Scenarios see failure; the component counter
// still sees a complete fox.
const WRONG_ORDER_ATTEMPT = `triangle(50, 30, 50, 95, 10, 40, "orange")
triangle(50, 30, 50, 95, 90, 40, "orange")
triangle(10, 40, 10, 5, 50, 40, "brown")
triangle(90, 40, 90, 5, 50, 40, "brown")
triangle(10, 40, 5, 60, 50, 95, "white")
triangle(90, 40, 95, 60, 50, 95, "white")
triangle(40, 90, 50, 85, 60, 90, "charcoal")
triangle(50, 95, 40, 90, 60, 90, "charcoal")`;

describe("foxy-face progression", () => {
  const languages: Language[] = ["jikiscript", "javascript"];

  for (const language of languages) {
    it(`scores the full anchor plus full components_in_place for the ${language} solution`, () => {
      const scores = runProgression(SOLUTIONS[language]!, language);

      expect(scores).toEqual({
        score: 15,
        metrics: { scenarios: 10, components_in_place: 5 }
      });
    });

    it(`scores 0 for the ${language} stub`, () => {
      const scores = runProgression(STUBS[language]!, language);

      expect(scores).toEqual({
        score: 0,
        metrics: { scenarios: 0, components_in_place: 0 }
      });
    });
  }

  it("scores partial components_in_place for the left half of the fox", () => {
    const scores = runProgression(LEFT_HALF_ATTEMPT);

    // 3 of 7 components in place.
    expect(scores).toEqual({
      score: 2,
      metrics: { scenarios: 0, components_in_place: 2 }
    });
  });

  it("scores full components_in_place but no anchor when the layering is wrong", () => {
    const scores = runProgression(WRONG_ORDER_ATTEMPT);

    expect(scores).toEqual({
      score: 5,
      metrics: { scenarios: 0, components_in_place: 5 }
    });
  });

  it("scores every metric 0 when no scenario runs are available", () => {
    const scores = runProgressionMirror(progressionMetrics, buildScenarioRuns([]), "jikiscript");

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, components_in_place: 0 }
    });
  });
});
