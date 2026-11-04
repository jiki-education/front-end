import { describe, expect, it } from "vitest";
import bouncerWristbandsExercise from "../../src/exercises/bouncer-wristbands";
import { progressionMetrics } from "../../src/exercises/bouncer-wristbands/progressionMetrics";
import solutionJavascript from "../../src/exercises/bouncer-wristbands/solution.javascript?raw";
import solutionJiki from "../../src/exercises/bouncer-wristbands/solution.jiki?raw";
import solutionPy from "../../src/exercises/bouncer-wristbands/solution.py?raw";
import stubJiki from "../../src/exercises/bouncer-wristbands/stub.jiki?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language = "jikiscript") {
  const results = runExerciseTests(bouncerWristbandsExercise, studentCode, language);
  const runs = buildScenarioRuns(results, bouncerWristbandsExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

const SOLUTIONS: Partial<Record<Language, string>> = {
  jikiscript: solutionJiki,
  javascript: solutionJavascript,
  python: solutionPy
};

// Reads the age but hands everyone the same wristband.
const ALWAYS_ADULT_ATTEMPT = `set age to get_age()
give_adult_wristband()`;

// A two-branch start: children spotted, everyone else treated as an adult.
const TWO_BANDS_ATTEMPT = `set age to get_age()

if age < 13 do
  give_child_wristband()
else do
  give_adult_wristband()
end`;

describe("bouncer-wristbands progression", () => {
  for (const [language, solution] of Object.entries(SOLUTIONS)) {
    it(`scores the full anchor plus all metrics for the ${language} solution`, () => {
      const scores = runProgression(solution, language as Language);

      expect(scores).toEqual({
        score: 23,
        metrics: { scenarios: 10, read_the_age: 2, gave_wristbands: 3, distinct_wristbands: 8 }
      });
    });
  }

  it("scores 0 for the stub", () => {
    const scores = runProgression(stubJiki);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, read_the_age: 0, gave_wristbands: 0, distinct_wristbands: 0 }
    });
  });

  it("credits reading and acting, but barely any branching, for a one-band attempt", () => {
    const scores = runProgression(ALWAYS_ADULT_ATTEMPT);

    // Only adult-30 and boundary-18 happen to pass (2 of 7); one band of 4.
    expect(scores).toEqual({
      score: 10,
      metrics: { scenarios: 3, read_the_age: 2, gave_wristbands: 3, distinct_wristbands: 2 }
    });
  });

  it("scores half the branching for a two-band attempt", () => {
    const scores = runProgression(TWO_BANDS_ATTEMPT);

    // child-8, adult-30 and boundary-18 pass (3 of 7); two bands of 4.
    expect(scores).toEqual({
      score: 13,
      metrics: { scenarios: 4, read_the_age: 2, gave_wristbands: 3, distinct_wristbands: 4 }
    });
  });
});
