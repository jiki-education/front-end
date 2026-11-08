import { describe, expect, it } from "vitest";
import bouncerDressCodeExercise from "../../src/exercises/bouncer-dress-code";
import { progressionMetrics } from "../../src/exercises/bouncer-dress-code/progressionMetrics";
import solutionJavascript from "../../src/exercises/bouncer-dress-code/solution.javascript?raw";
import solutionJiki from "../../src/exercises/bouncer-dress-code/solution.jiki?raw";
import solutionPy from "../../src/exercises/bouncer-dress-code/solution.py?raw";
import stubJiki from "../../src/exercises/bouncer-dress-code/stub.jiki?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language = "jikiscript") {
  const results = runExerciseTests(bouncerDressCodeExercise, studentCode, language);
  const runs = buildScenarioRuns(results, bouncerDressCodeExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

const SOLUTIONS: Partial<Record<Language, string>> = {
  jikiscript: solutionJiki,
  javascript: solutionJavascript,
  python: solutionPy
};

// Reads the inputs and decides for everyone, but always the same decision.
const TURN_ALL_AWAY_ATTEMPT = `set outfit to get_outfit()
set age to get_age()
turn_away()`;

// Handles smart wear with an "or", but no formal or guest-list rules yet.
const SMART_ONLY_ATTEMPT = `set outfit to get_outfit()
set age to get_age()

if outfit == "suit" or outfit == "dress" do
  offer_canapes()
  let_in()
else do
  turn_away()
end`;

describe("bouncer-dress-code progression", () => {
  for (const [language, solution] of Object.entries(SOLUTIONS)) {
    it(`scores the full anchor plus all metrics for the ${language} solution`, () => {
      const scores = runProgression(solution, language as Language);

      // The casual-adult-listed codeCheck only accepts the && / || lexemes,
      // so the jikiscript and python solutions (and / or) fail that one
      // scenario: 8 of 9 for them, 9 of 9 for javascript.
      const scenarios = language === "javascript" ? 10 : 9;
      expect(scores).toEqual({
        score: 13 + scenarios,
        metrics: { scenarios, read_the_inputs: 2, combined_conditions: 8, made_a_decision: 3 }
      });
    });
  }

  it("scores 0 for the stub", () => {
    const scores = runProgression(stubJiki);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, read_the_inputs: 0, combined_conditions: 0, made_a_decision: 0 }
    });
  });

  it("credits reading and deciding, but not combining, for turning everyone away", () => {
    const scores = runProgression(TURN_ALL_AWAY_ATTEMPT);

    // Only casual-child-unlisted passes outright (the other turn-away
    // scenario carries the and/or codeCheck, which fails).
    expect(scores).toEqual({
      score: 6,
      metrics: { scenarios: 1, read_the_inputs: 2, combined_conditions: 0, made_a_decision: 3 }
    });
  });

  it("scores combined_conditions as soon as an 'or' rule appears", () => {
    const scores = runProgression(SMART_ONLY_ATTEMPT);

    // suit, dress, smart-teen and casual-child-unlisted pass (4 of 9;
    // casual-adult-listed would too, but its codeCheck only accepts &&/||).
    expect(scores).toEqual({
      score: 17,
      metrics: { scenarios: 4, read_the_inputs: 2, combined_conditions: 8, made_a_decision: 3 }
    });
  });
});
