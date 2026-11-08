import { describe, expect, it } from "vitest";
import cloudRainSunExercise from "../../src/exercises/cloud-rain-sun";
import { progressionMetrics } from "../../src/exercises/cloud-rain-sun/progressionMetrics";
import solutionJavascript from "../../src/exercises/cloud-rain-sun/solution.javascript?raw";
import solutionJiki from "../../src/exercises/cloud-rain-sun/solution.jiki?raw";
import stubJavascript from "../../src/exercises/cloud-rain-sun/stub.javascript?raw";
import stubJiki from "../../src/exercises/cloud-rain-sun/stub.jiki?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language = "jikiscript") {
  const results = runExerciseTests(cloudRainSunExercise, studentCode, language);
  const runs = buildScenarioRuns(results, cloudRainSunExercise);
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

// The complete cloud (given body + four puffs) and the sun: 6 of 11 shapes.
const CLOUD_AND_SUN_ATTEMPT = `rectangle(25, 50, 50, 10, "white")
circle(25, 50, 10, "white")
circle(40, 40, 15, "white")
circle(55, 40, 20, "white")
circle(75, 50, 10, "white")
circle(75, 30, 15, "yellow")`;

describe("cloud-rain-sun progression", () => {
  const languages: Language[] = ["jikiscript", "javascript"];

  for (const language of languages) {
    it(`scores the full anchor plus full shapes_in_place for the ${language} solution`, () => {
      const scores = runProgression(SOLUTIONS[language]!, language);

      expect(scores).toEqual({
        score: 15,
        metrics: { scenarios: 10, shapes_in_place: 5 }
      });
    });

    it(`scores 0 for the ${language} stub (the given cloud body rounds to 0)`, () => {
      const scores = runProgression(STUBS[language]!, language);

      expect(scores).toEqual({
        score: 0,
        metrics: { scenarios: 0, shapes_in_place: 0 }
      });
    });
  }

  it("scores partial shapes_in_place for the cloud and sun without rain", () => {
    const scores = runProgression(CLOUD_AND_SUN_ATTEMPT);

    // 6 of 11 shapes in place.
    expect(scores).toEqual({
      score: 3,
      metrics: { scenarios: 0, shapes_in_place: 3 }
    });
  });

  it("scores every metric 0 when no scenario runs are available", () => {
    const scores = runProgressionMirror(progressionMetrics, buildScenarioRuns([]), "jikiscript");

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, shapes_in_place: 0 }
    });
  });
});
