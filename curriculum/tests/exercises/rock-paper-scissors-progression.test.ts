import { describe, expect, it } from "vitest";
import rockPaperScissorsExercise from "../../src/exercises/rock-paper-scissors";
import { progressionMetrics } from "../../src/exercises/rock-paper-scissors/progressionMetrics";
import solutionJavascript from "../../src/exercises/rock-paper-scissors/solution.javascript?raw";
import solutionJiki from "../../src/exercises/rock-paper-scissors/solution.jiki?raw";
import stubJiki from "../../src/exercises/rock-paper-scissors/stub.jiki?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language = "jikiscript") {
  const results = runExerciseTests(rockPaperScissorsExercise, studentCode, language);
  const runs = buildScenarioRuns(results, rockPaperScissorsExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

// Python is omitted: this exercise's external functions validate their
// arguments with isNumber/isString guards that don't recognise Python
// values, so the python solution fails at runtime in this harness.
const SOLUTIONS: Partial<Record<Language, string>> = {
  jikiscript: solutionJiki,
  javascript: solutionJavascript
};

// Spots ties, calls everything else for Yuki: announces in every game, but
// never pairs the two choices with a compound condition.
const TIE_OR_YUKI_ATTEMPT = `set yuki_choice to get_yuki_choice()
set ando_choice to get_ando_choice()

if yuki_choice == ando_choice do
  announce_result("tie")
else do
  announce_result("Yuki")
end`;

describe("rock-paper-scissors progression", () => {
  for (const [language, solution] of Object.entries(SOLUTIONS)) {
    it(`scores the full anchor plus all metrics for the ${language} solution`, () => {
      const scores = runProgression(solution, language as Language);

      expect(scores).toEqual({
        score: 23,
        metrics: { scenarios: 10, read_choices: 2, announced_result: 3, combined_conditions: 8 }
      });
    });
  }

  it("scores 0 for the stub", () => {
    const scores = runProgression(stubJiki);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, read_choices: 0, announced_result: 0, combined_conditions: 0 }
    });
  });

  it("credits reading and announcing, but not combining, for the tie-or-Yuki attempt", () => {
    const scores = runProgression(TIE_OR_YUKI_ATTEMPT);

    // The three ties and Yuki's three wins pass (6 of 9); a result was
    // announced in every game, even the wrong ones.
    expect(scores).toEqual({
      score: 12,
      metrics: { scenarios: 7, read_choices: 2, announced_result: 3, combined_conditions: 0 }
    });
  });
});
