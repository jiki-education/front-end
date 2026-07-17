import { describe, expect, it } from "vitest";
import stripeyFabricExercise from "../../src/exercises/stripey-fabric";
import { progressionMetrics } from "../../src/exercises/stripey-fabric/progressionMetrics";
import solutionJavascript from "../../src/exercises/stripey-fabric/solution.javascript?raw";
import solutionJiki from "../../src/exercises/stripey-fabric/solution.jiki?raw";
import stubJiki from "../../src/exercises/stripey-fabric/stub.jiki?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language = "jikiscript") {
  const results = runExerciseTests(stripeyFabricExercise, studentCode, language);
  const runs = buildScenarioRuns(results, stripeyFabricExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// Python is omitted: this exercise's external functions validate their
// arguments with isNumber/isString guards that don't recognise Python
// values, so the python solution fails at runtime in this harness.
const SOLUTIONS: Partial<Record<Language, string>> = {
  jikiscript: solutionJiki,
  javascript: solutionJavascript
};

// A loop that draws every stripe, all in one colour.
const ALL_YELLOW_ATTEMPT = `set i to 1

repeat 20 times do
  rectangle((i - 1) * 5, 0, 5, 100, "yellow")
  change i to i + 1
end`;

// Modulo rules working, but the purple end stripes are missing.
const NO_END_STRIPES_ATTEMPT = `set i to 1
set color to "white"

repeat 20 times do
  if i % 4 == 0 do
    change color to "green"
  else if i % 2 == 0 do
    change color to "blue"
  else do
    change color to "yellow"
  end
  rectangle((i - 1) * 5, 0, 5, 100, color)
  change i to i + 1
end`;

describe("stripey-fabric progression", () => {
  for (const [language, solution] of Object.entries(SOLUTIONS)) {
    it(`scores the full anchor plus all metrics for the ${language} solution`, () => {
      const scores = runProgression(solution, language as Language);

      expect(scores).toEqual({
        score: 25,
        metrics: { scenarios: 10, used_modulo: 8, stripes_drawn: 3, distinct_colors: 4 }
      });
    });
  }

  it("scores 0 for the stub", () => {
    const scores = runProgression(stubJiki);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, used_modulo: 0, stripes_drawn: 0, distinct_colors: 0 }
    });
  });

  it("credits drawing all the stripes even when they're all one colour", () => {
    const scores = runProgression(ALL_YELLOW_ATTEMPT);

    // The single scenario is all-or-nothing, so the anchor stays 0.
    expect(scores).toEqual({
      score: 4,
      metrics: { scenarios: 0, used_modulo: 0, stripes_drawn: 3, distinct_colors: 1 }
    });
  });

  it("credits modulo and three colours when only the end stripes are missing", () => {
    const scores = runProgression(NO_END_STRIPES_ATTEMPT);

    expect(scores).toEqual({
      score: 14,
      metrics: { scenarios: 0, used_modulo: 8, stripes_drawn: 3, distinct_colors: 3 }
    });
  });
});
