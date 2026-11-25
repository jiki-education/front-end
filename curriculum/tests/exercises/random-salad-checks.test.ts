import { describe, expect, it } from "vitest";
import type { InterpretResult } from "@jiki/interpreters";
import randomSaladExercise from "../../src/exercises/random-salad";
import solutionJavascript from "../../src/exercises/random-salad/solution.javascript?raw";
import { runExerciseTests } from "../runScenarioTest";

const scenario = randomSaladExercise.scenarios[0];
const codeChecks = scenario.codeChecks ?? [];

// Runs every code check against a hand-written function call log.
function checkResults(log: Array<{ name: string; args: number[]; return?: number }>) {
  const result = { meta: { functionCallLog: log } } as unknown as InterpretResult;
  return codeChecks.map((check) => check.pass(result, "javascript"));
}

function randomInt(min: number, max: number, value: number) {
  return { name: "Math.randomInt", args: [min, max], return: value };
}

describe("random-salad code checks", () => {
  it("passes the javascript solution on every run", () => {
    for (let i = 0; i < 50; i++) {
      const results = runExerciseTests(randomSaladExercise, solutionJavascript, "javascript");
      expect(results[0].status).toBe("pass");
    }
  });

  it("fails the reported code in the coincidental case where a later call matches an earlier rule", () => {
    // leaves = 52, tomatoes = 5, croutons = 5, olives = 1. The croutons call
    // Math.randomInt(5, 10) has the same arguments as the tomatoes rule
    // (5, leaves / 5 = 10), and returns 5, which is also the tomatoes value.
    // The student's real tomatoes call is Math.randomInt(5, 52).
    const results = checkResults([
      randomInt(40, 100, 52),
      randomInt(5, 52, 5),
      randomInt(1, 2, 1),
      randomInt(5, 10, 5),
      { name: "makeSalad", args: [52, 5, 5, 1] }
    ]);

    // The croutons call is the only one matching the tomatoes rule, so it
    // can't also count as the croutons call.
    expect(results).toEqual([true, true, false, true]);
  });

  it("passes when each value comes from the call matching its rule", () => {
    const results = checkResults([
      randomInt(40, 100, 52),
      randomInt(5, 10, 7),
      randomInt(7, 14, 9),
      randomInt(1, 3, 2),
      { name: "makeSalad", args: [52, 7, 9, 2] }
    ]);

    expect(results).toEqual([true, true, true, true]);
  });

  it("fails a value that was not returned by a matching call", () => {
    const results = checkResults([
      randomInt(40, 100, 52),
      randomInt(5, 10, 7),
      randomInt(7, 14, 9),
      randomInt(1, 3, 2),
      { name: "makeSalad", args: [52, 7, 9, 3] }
    ]);

    expect(results).toEqual([true, true, true, false]);
  });

  it("fails every check when makeSalad is never called", () => {
    expect(checkResults([randomInt(40, 100, 52)])).toEqual([false, false, false, false]);
  });
});
