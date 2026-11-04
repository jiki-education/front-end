import { describe, expect, it } from "vitest";
import snowmanBasicExercise from "../../src/exercises/snowman-basic";
import { progressionMetrics } from "../../src/exercises/snowman-basic/progressionMetrics";
import solutionJavascript from "../../src/exercises/snowman-basic/solution.javascript?raw";
import solutionJiki from "../../src/exercises/snowman-basic/solution.jiki?raw";
import stubJavascript from "../../src/exercises/snowman-basic/stub.javascript?raw";
import stubJiki from "../../src/exercises/snowman-basic/stub.jiki?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language = "jikiscript") {
  const results = runExerciseTests(snowmanBasicExercise, studentCode, language);
  const runs = buildScenarioRuns(results, snowmanBasicExercise);
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

// Only the base circle drawn.
const BASE_ONLY_ATTEMPT = `circle(50, 70, 20)`;

// Base and body drawn, head still missing.
const BASE_AND_BODY_ATTEMPT = `circle(50, 70, 20)
circle(50, 40, 15)`;

describe("snowman-basic progression", () => {
  const languages: Language[] = ["jikiscript", "javascript"];

  for (const language of languages) {
    it(`scores the full anchor plus full circles_in_place for the ${language} solution`, () => {
      const scores = runProgression(SOLUTIONS[language]!, language);

      expect(scores).toEqual({
        score: 15,
        metrics: { scenarios: 10, circles_in_place: 5 }
      });
    });

    it(`scores 0 for the ${language} stub`, () => {
      const scores = runProgression(STUBS[language]!, language);

      expect(scores).toEqual({
        score: 0,
        metrics: { scenarios: 0, circles_in_place: 0 }
      });
    });
  }

  it("scores partial circles_in_place for the base circle alone", () => {
    const scores = runProgression(BASE_ONLY_ATTEMPT);

    expect(scores).toEqual({
      score: 2,
      metrics: { scenarios: 0, circles_in_place: 2 }
    });
  });

  it("scores more partial credit as the body is added", () => {
    const scores = runProgression(BASE_AND_BODY_ATTEMPT);

    expect(scores).toEqual({
      score: 3,
      metrics: { scenarios: 0, circles_in_place: 3 }
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
