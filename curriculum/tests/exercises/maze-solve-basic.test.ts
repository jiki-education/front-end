import { describe, it, expect, beforeEach } from "vitest";
import MazeSolveBasicExercise from "../../src/exercises/maze-solve-basic/Exercise";

describe("MazeSolveBasicExercise", () => {
  let exercise: MazeSolveBasicExercise;

  beforeEach(() => {
    exercise = new MazeSolveBasicExercise();
  });

  describe("initialization", () => {
    it("should start with default position at origin", () => {
      expect(exercise.characterRow).toBe(0);
      expect(exercise.characterCol).toBe(0);
    });

    it("should start facing down", () => {
      expect(exercise.direction).toBe("down");
    });

    it("should have empty grid initially", () => {
      expect(exercise.grid).toEqual([]);
    });
  });

  describe("setupGrid", () => {
    it("should set the grid", () => {
      const grid = [
        [0, 1, 0],
        [0, 0, 0],
        [1, 0, 3]
      ];
      exercise.setupGrid(grid);
      expect(exercise.grid).toEqual(grid);
    });
  });

  describe("setupPosition", () => {
    it("should set character position", () => {
      exercise.setupPosition(2, 3);
      expect(exercise.characterRow).toBe(2);
      expect(exercise.characterCol).toBe(3);
    });
  });

  describe("setupDirection", () => {
    it("should set direction and rotation for up", () => {
      exercise.setupDirection("up");
      expect(exercise.direction).toBe("up");
      expect(exercise.rotation).toBe(0);
    });

    it("should set direction and rotation for right", () => {
      exercise.setupDirection("right");
      expect(exercise.direction).toBe("right");
      expect(exercise.rotation).toBe(90);
    });

    it("should set direction and rotation for left", () => {
      exercise.setupDirection("left");
      expect(exercise.direction).toBe("left");
      expect(exercise.rotation).toBe(-90);
    });
  });

  describe("getGameResult", () => {
    it("should return null when grid is empty", () => {
      expect(exercise.getGameResult()).toBeNull();
    });

    it("should return 'win' when on target cell", () => {
      exercise.setupGrid([
        [0, 0],
        [0, 3]
      ]);
      exercise.setupPosition(1, 1);
      expect(exercise.getGameResult()).toBe("win");
    });

    it("should return null when not on target cell", () => {
      exercise.setupGrid([
        [0, 0],
        [0, 3]
      ]);
      exercise.setupPosition(0, 0);
      expect(exercise.getGameResult()).toBeNull();
    });
  });

  describe("getState", () => {
    it("should return current state", () => {
      exercise.setupGrid([[0, 3]]);
      exercise.setupPosition(0, 1);
      exercise.setupDirection("right");

      const state = exercise.getState();
      expect(state.position).toBe("0,1");
      expect(state.direction).toBe("right");
      expect(state.gameResult).toBe("win");
    });
  });
});
