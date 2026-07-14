import { describe, expect, it } from "vitest";
import penguinExercise from "../../src/exercises/penguin";
import { progressionMetrics } from "../../src/exercises/penguin/progressionMetrics";
import solutionJavascript from "../../src/exercises/penguin/solution.javascript?raw";
import solutionJiki from "../../src/exercises/penguin/solution.jiki?raw";
import stubJavascript from "../../src/exercises/penguin/stub.javascript?raw";
import stubJiki from "../../src/exercises/penguin/stub.jiki?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language = "jikiscript") {
  const results = runExerciseTests(penguinExercise, studentCode, language);
  const runs = buildScenarioRuns(results, penguinExercise);
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

// Three of the six mirrored parts added (wing, face, foot); the eye pair and
// nose still todo.
const THREE_PARTS_ATTEMPT = `ellipse(72, 55, 10, 25, "black")
ellipse(59, 32, 11, 14, "white")
ellipse(60, 93, 7, 4, "orange")`;

describe("penguin progression", () => {
  const languages: Language[] = ["jikiscript", "javascript"];

  for (const language of languages) {
    it(`scores the full anchor plus full mirrored_parts for the ${language} solution`, () => {
      const scores = runProgression(SOLUTIONS[language]!, language);

      expect(scores).toEqual({
        score: 15,
        metrics: { scenarios: 10, mirrored_parts: 5 }
      });
    });

    it(`scores 0 for the ${language} stub (the given left side doesn't count)`, () => {
      const scores = runProgression(STUBS[language]!, language);

      expect(scores).toEqual({
        score: 0,
        metrics: { scenarios: 0, mirrored_parts: 0 }
      });
    });
  }

  it("scores partial mirrored_parts for three of the six mirrored parts", () => {
    const scores = runProgression(THREE_PARTS_ATTEMPT);

    // 3 of 6 parts: round(5 * 3 / 6) = 3.
    expect(scores).toEqual({
      score: 3,
      metrics: { scenarios: 0, mirrored_parts: 3 }
    });
  });

  it("scores every metric 0 when no scenario runs are available", () => {
    const scores = runProgressionMirror(progressionMetrics, buildScenarioRuns([]), "jikiscript");

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, mirrored_parts: 0 }
    });
  });
});
