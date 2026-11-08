import { describe, expect, it } from "vitest";
import jumbledHouseExercise from "../../src/exercises/jumbled-house";
import { progressionMetrics } from "../../src/exercises/jumbled-house/progressionMetrics";
import solutionJavascript from "../../src/exercises/jumbled-house/solution.javascript?raw";
import solutionJiki from "../../src/exercises/jumbled-house/solution.jiki?raw";
import stubJavascript from "../../src/exercises/jumbled-house/stub.javascript?raw";
import stubJiki from "../../src/exercises/jumbled-house/stub.jiki?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language = "jikiscript") {
  const results = runExerciseTests(jumbledHouseExercise, studentCode, language);
  const runs = buildScenarioRuns(results, jumbledHouseExercise);
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

// The stub with the frame and roof moved into place; the windows, door, and
// knob still jumbled (2 of 6 pieces).
const FRAME_AND_ROOF_ATTEMPT = `rectangle(0,0,100,100, "skyblue")
rectangle(0,80,100,100, "green")
rectangle(20,50,60,40, "brown")
triangle(16,50, 50,30, 84,50, "brick")
rectangle(10,15,6,7, "white")
rectangle(18,55,22,23, "white")
rectangle(83,12,10,16, "dark brown")
circle(91,20,1, "yellow")`;

describe("jumbled-house progression", () => {
  const languages: Language[] = ["jikiscript", "javascript"];

  for (const language of languages) {
    it(`scores the full anchor plus full pieces_in_place for the ${language} solution`, () => {
      const scores = runProgression(SOLUTIONS[language]!, language);

      expect(scores).toEqual({
        score: 15,
        metrics: { scenarios: 10, pieces_in_place: 5 }
      });
    });

    it(`scores 0 for the ${language} stub (every piece is out of place)`, () => {
      const scores = runProgression(STUBS[language]!, language);

      expect(scores).toEqual({
        score: 0,
        metrics: { scenarios: 0, pieces_in_place: 0 }
      });
    });
  }

  it("scores partial pieces_in_place once the frame and roof are placed", () => {
    const scores = runProgression(FRAME_AND_ROOF_ATTEMPT);

    // 2 of 6 pieces in place.
    expect(scores).toEqual({
      score: 2,
      metrics: { scenarios: 0, pieces_in_place: 2 }
    });
  });

  it("scores every metric 0 when no scenario runs are available", () => {
    const scores = runProgressionMirror(progressionMetrics, buildScenarioRuns([]), "jikiscript");

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, pieces_in_place: 0 }
    });
  });
});
