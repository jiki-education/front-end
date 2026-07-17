import { describe, expect, it } from "vitest";
import dndRollExercise from "../../src/exercises/dnd-roll";
import { progressionMetrics } from "../../src/exercises/dnd-roll/progressionMetrics";
import solution from "../../src/exercises/dnd-roll/solution.jiki?raw";
import stub from "../../src/exercises/dnd-roll/stub.jiki?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

// The rolls are random every run, so the metrics only measure structural
// properties (calls made, argument shapes) - never exact values.
function runProgression(studentCode: string) {
  const results = runExerciseTests(dndRollExercise, studentCode, "jikiscript");
  const runs = buildScenarioRuns(results, dndRollExercise);
  return runProgressionMirror(progressionMetrics, runs, "jikiscript");
}

// Only got as far as the attack roll.
const FIRST_ROLL_ONLY = `set attack to roll(20)
announce(attack)`;

// Rolled and announced everything, but struck with made-up literal numbers.
const LITERAL_STRIKE = `set attack to roll(20)
announce(attack)
set base to roll(12)
announce(base)
set bonus to roll(10)
announce(bonus)
strike(0, 0)`;

describe("dnd-roll progression", () => {
  it("scores the full 10-point anchor plus full metric marks for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 24,
      metrics: { scenarios: 10, strike_uses_rolls: 8, dice_rolled: 3, announced: 3 }
    });
  });

  it("scores 0 for the stub", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, strike_uses_rolls: 0, dice_rolled: 0, announced: 0 }
    });
  });

  it("scores one die and one announcement for an attack-roll-only attempt", () => {
    const scores = runProgression(FIRST_ROLL_ONLY);

    expect(scores).toEqual({
      score: 2,
      metrics: { scenarios: 0, strike_uses_rolls: 0, dice_rolled: 1, announced: 1 }
    });
  });

  it("scores rolls and announcements but NOT strike-uses-rolls for a literal strike", () => {
    const scores = runProgression(LITERAL_STRIKE);

    // strike(0, 0) can never match the rolls, so the scenario fails too.
    expect(scores).toEqual({
      score: 6,
      metrics: { scenarios: 0, strike_uses_rolls: 0, dice_rolled: 3, announced: 3 }
    });
  });
});
