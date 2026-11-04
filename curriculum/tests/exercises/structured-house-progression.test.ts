import { describe, expect, it } from "vitest";
import structuredHouseExercise from "../../src/exercises/structured-house";
import { progressionMetrics } from "../../src/exercises/structured-house/progressionMetrics";
import solutionJavascript from "../../src/exercises/structured-house/solution.javascript?raw";
import stubJavascript from "../../src/exercises/structured-house/stub.javascript?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language = "jikiscript") {
  const results = runExerciseTests(structuredHouseExercise, studentCode, language);
  const runs = buildScenarioRuns(results, structuredHouseExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// Only javascript is exercised for the solution/stub. Python fails the
// DrawExercise isNumber guards ("inputs must be numbers"), and jikiscript
// fails the scenario's responsiveness isolated checks: the secretConstants
// keys (houseWidth/houseHeight) don't override jikiscript's snake_case
// house_width/house_height variables. Both are pre-existing scenario or
// interpreter issues (the repo-wide solution-validation test also only runs
// javascript).
const SOLUTIONS: Partial<Record<Language, string>> = {
  javascript: solutionJavascript
};

const STUBS: Partial<Record<Language, string>> = {
  javascript: stubJavascript
};

// Early progress: sky, grass, and the frame drawn at the default anchors
// (3 of 8 parts). Correctness of derivation is scenario-owned; the counter
// only sees the drawn shapes.
const SKY_GRASS_FRAME_ATTEMPT = `set house_width to 60
set house_height to 40
rectangle(0, 0, 100, 100, "skyblue")
rectangle(0, 85, 100, 15, "green")
rectangle(20, 50, 60, 40, "brown")`;

describe("structured-house progression", () => {
  const languages: Language[] = ["javascript"];

  for (const language of languages) {
    it(`scores the full anchor plus full parts_in_place for the ${language} solution`, () => {
      const scores = runProgression(SOLUTIONS[language]!, language);

      expect(scores).toEqual({
        score: 15,
        metrics: { scenarios: 10, parts_in_place: 5 }
      });
    });

    it(`scores 0 for the ${language} stub (nothing is drawn)`, () => {
      const scores = runProgression(STUBS[language]!, language);

      expect(scores).toEqual({
        score: 0,
        metrics: { scenarios: 0, parts_in_place: 0 }
      });
    });
  }

  it("scores partial parts_in_place for the sky, grass, and frame", () => {
    const scores = runProgression(SKY_GRASS_FRAME_ATTEMPT);

    // 3 of 8 parts: round(5 * 3 / 8) = 2.
    expect(scores).toEqual({
      score: 2,
      metrics: { scenarios: 0, parts_in_place: 2 }
    });
  });

  it("scores every metric 0 when no scenario runs are available", () => {
    const scores = runProgressionMirror(progressionMetrics, buildScenarioRuns([]), "jikiscript");

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, parts_in_place: 0 }
    });
  });
});
