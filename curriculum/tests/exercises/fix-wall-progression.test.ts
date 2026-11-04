import { describe, expect, it } from "vitest";
import fixWallExercise from "../../src/exercises/fix-wall";
import { progressionMetrics } from "../../src/exercises/fix-wall/progressionMetrics";
import solutionJavascript from "../../src/exercises/fix-wall/solution.javascript?raw";
import solutionJiki from "../../src/exercises/fix-wall/solution.jiki?raw";
import stubJavascript from "../../src/exercises/fix-wall/stub.javascript?raw";
import stubJiki from "../../src/exercises/fix-wall/stub.jiki?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language = "jikiscript") {
  const results = runExerciseTests(fixWallExercise, studentCode, language);
  const runs = buildScenarioRuns(results, fixWallExercise);
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

// Two of the three holes covered.
const TWO_HOLES_ATTEMPT = `rectangle(10, 10, 20, 10)
rectangle(70, 30, 20, 10)`;

describe("fix-wall progression", () => {
  const languages: Language[] = ["jikiscript", "javascript"];

  for (const language of languages) {
    it(`scores the full anchor plus full holes_filled for the ${language} solution`, () => {
      const scores = runProgression(SOLUTIONS[language]!, language);

      expect(scores).toEqual({
        score: 15,
        metrics: { scenarios: 10, holes_filled: 5 }
      });
    });

    it(`scores 0 for the ${language} stub`, () => {
      const scores = runProgression(STUBS[language]!, language);

      expect(scores).toEqual({
        score: 0,
        metrics: { scenarios: 0, holes_filled: 0 }
      });
    });
  }

  it("scores partial holes_filled for two of the three holes", () => {
    const scores = runProgression(TWO_HOLES_ATTEMPT);

    expect(scores).toEqual({
      score: 3,
      metrics: { scenarios: 0, holes_filled: 3 }
    });
  });

  it("scores every metric 0 when no scenario runs are available", () => {
    const scores = runProgressionMirror(progressionMetrics, buildScenarioRuns([]), "jikiscript");

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, holes_filled: 0 }
    });
  });
});
