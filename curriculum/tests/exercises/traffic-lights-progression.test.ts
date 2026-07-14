import { describe, expect, it } from "vitest";
import trafficLightsExercise from "../../src/exercises/traffic-lights";
import { progressionMetrics } from "../../src/exercises/traffic-lights/progressionMetrics";
import solutionJavascript from "../../src/exercises/traffic-lights/solution.javascript?raw";
import solutionJiki from "../../src/exercises/traffic-lights/solution.jiki?raw";
import stubJavascript from "../../src/exercises/traffic-lights/stub.javascript?raw";
import stubJiki from "../../src/exercises/traffic-lights/stub.jiki?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language = "jikiscript") {
  const results = runExerciseTests(trafficLightsExercise, studentCode, language);
  const runs = buildScenarioRuns(results, trafficLightsExercise);
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

// Only the red light drawn (using the variables).
const RED_ONLY_ATTEMPT = `set radius to 8
set center_x to 50
set top_y to 16
set middle_y to 39
set bottom_y to 62
circle(center_x, top_y, radius, "red")`;

// All three lights drawn correctly, but with hardcoded numbers: the scenario
// fails its "use the variables" code check, yet all the lights are in place.
const HARDCODED_ATTEMPT = `circle(50, 16, 8, "red")
circle(50, 39, 8, "amber")
circle(50, 62, 8, "green")`;

describe("traffic-lights progression", () => {
  const languages: Language[] = ["jikiscript", "javascript"];

  for (const language of languages) {
    it(`scores the full anchor plus full lights_in_place for the ${language} solution`, () => {
      const scores = runProgression(SOLUTIONS[language]!, language);

      expect(scores).toEqual({
        score: 15,
        metrics: { scenarios: 10, lights_in_place: 5 }
      });
    });

    it(`scores 0 for the ${language} stub`, () => {
      const scores = runProgression(STUBS[language]!, language);

      expect(scores).toEqual({
        score: 0,
        metrics: { scenarios: 0, lights_in_place: 0 }
      });
    });
  }

  it("scores partial lights_in_place for the red light alone", () => {
    const scores = runProgression(RED_ONLY_ATTEMPT);

    // 1 of 3 lights: round(5 * 1 / 3) = 2.
    expect(scores).toEqual({
      score: 2,
      metrics: { scenarios: 0, lights_in_place: 2 }
    });
  });

  it("scores full lights_in_place but no anchor for hardcoded numbers", () => {
    const scores = runProgression(HARDCODED_ATTEMPT);

    expect(scores).toEqual({
      score: 5,
      metrics: { scenarios: 0, lights_in_place: 5 }
    });
  });

  it("scores every metric 0 when no scenario runs are available", () => {
    const scores = runProgressionMirror(progressionMetrics, buildScenarioRuns([]), "jikiscript");

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, lights_in_place: 0 }
    });
  });
});
