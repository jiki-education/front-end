import { describe, it, expect, beforeEach, vi } from "vitest";
import type { ExecutionContext } from "@jiki/interpreters";
import MazeSolveBasicExercise from "../../src/exercises/maze-solve-basic/Exercise";
import enDict from "../../src/exercise-categories/maze/messages.json";

/**
 * Fire cells (grid value 4) and poop cells (grid value 5) are hazards, not
 * walkable path. Moving into either must raise the matching pre-translated logic
 * error and leave the character where it stood, exactly as walls (value 1) do.
 */

function createMockExecutionContext(): ExecutionContext {
  return {
    getCurrentTimeInMs: vi.fn(() => 0),
    fastForward: vi.fn(),
    logicError: vi.fn()
  } as unknown as ExecutionContext;
}

describe("maze move into hazards", () => {
  let exercise: MazeSolveBasicExercise;
  let ctx: ExecutionContext;

  beforeEach(() => {
    ctx = createMockExecutionContext();
    exercise = new MazeSolveBasicExercise();
    exercise.setMessages(enDict);
  });

  it("blocks movement into a fire cell and raises the localized logic error", () => {
    exercise.setupMaze(
      [
        [2, 4, 3],
        [1, 1, 1],
        [1, 1, 1]
      ],
      0,
      0,
      "right"
    );

    exercise.move(ctx);

    expect(ctx.logicError).toHaveBeenCalledWith("Ouch! You walked into the fire!");
    expect(exercise.characterRow).toBe(0);
    expect(exercise.characterCol).toBe(0);
  });

  it("blocks movement into a poop cell and raises the localized logic error", () => {
    exercise.setupMaze(
      [
        [2, 5, 3],
        [1, 1, 1],
        [1, 1, 1]
      ],
      0,
      0,
      "right"
    );

    exercise.move(ctx);

    expect(ctx.logicError).toHaveBeenCalledWith("Ewww! You walked into the poop! 💩💩💩");
    expect(exercise.characterRow).toBe(0);
    expect(exercise.characterCol).toBe(0);
  });

  it("still allows movement onto open path and target cells", () => {
    exercise.setupMaze(
      [
        [2, 0, 3],
        [1, 1, 1],
        [1, 1, 1]
      ],
      0,
      0,
      "right"
    );

    exercise.move(ctx);
    exercise.move(ctx);

    expect(ctx.logicError).not.toHaveBeenCalled();
    expect(exercise.characterCol).toBe(2);
    expect(exercise.getGameResult()).toBe("win");
  });
});
