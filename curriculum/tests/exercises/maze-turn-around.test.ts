import { describe, it, expect } from "vitest";
import MazeTurnAroundExercise from "../../src/exercises/maze-turn-around/Exercise";
import { scenarios } from "../../src/exercises/maze-turn-around/scenarios";
import { runAllVisualScenarios } from "../runScenarioTest";

const LEVEL = "make-your-own-functions";

// A solution that defines turnAround() but never calls it, inlining two turnLeft()s
// instead. It solves every maze, so only the code checks should reject it.
const CHEAT = `function turnAround() {
}

repeat() {
  if (canTurnLeft()) {
    turnLeft()
    move()
  } else if (canMove()) {
    move()
  } else if (canTurnRight()) {
    turnRight()
    move()
  } else {
    turnLeft()
    turnLeft()
  }
}`;

describe("maze-turn-around code checks", () => {
  it("rejects a solution that inlines turnLeft() twice instead of calling turnAround()", () => {
    const results = runAllVisualScenarios(MazeTurnAroundExercise, scenarios, CHEAT, LEVEL, "javascript");

    // Every scenario must fail, and it must be the "call it" check that trips.
    for (const result of results) {
      expect(result.status, `${result.slug} should fail`).toBe("fail");
      const messages = result.expects.map((e) => e.errorHtml ?? "").join(" ");
      expect(messages).toContain("actually call it");
    }
  });
});
