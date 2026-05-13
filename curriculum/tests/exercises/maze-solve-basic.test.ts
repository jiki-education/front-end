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

  describe("setupMaze", () => {
    it("should set grid, position, and direction", () => {
      const grid = [
        [0, 1, 0],
        [0, 0, 0],
        [1, 0, 3]
      ];
      exercise.setupMaze(grid, 2, 1, "right");
      expect(exercise.grid).toEqual(grid);
      expect(exercise.characterRow).toBe(2);
      expect(exercise.characterCol).toBe(1);
      expect(exercise.direction).toBe("right");
      expect(exercise.rotation).toBe(90);
    });

    it("should set rotation to 0 for up", () => {
      exercise.setupMaze([[0]], 0, 0, "up");
      expect(exercise.rotation).toBe(0);
    });

    it("should set rotation to 180 for down", () => {
      exercise.setupMaze([[0]], 0, 0, "down");
      expect(exercise.rotation).toBe(180);
    });

    it("should set rotation to -90 for left", () => {
      exercise.setupMaze([[0]], 0, 0, "left");
      expect(exercise.rotation).toBe(-90);
    });
  });

  describe("getGameResult", () => {
    it("should return null when grid is empty", () => {
      expect(exercise.getGameResult()).toBeNull();
    });

    it("should return 'win' when on target cell", () => {
      exercise.setupMaze(
        [
          [0, 0],
          [0, 3]
        ],
        1,
        1,
        "down"
      );
      expect(exercise.getGameResult()).toBe("win");
    });

    it("should return null when not on target cell", () => {
      exercise.setupMaze(
        [
          [0, 0],
          [0, 3]
        ],
        0,
        0,
        "down"
      );
      expect(exercise.getGameResult()).toBeNull();
    });
  });

  describe("getState", () => {
    it("should return current state", () => {
      exercise.setupMaze([[0, 3]], 0, 1, "right");

      const state = exercise.getState();
      expect(state.position).toBe("0,1");
      expect(state.direction).toBe("right");
      expect(state.gameResult).toBe("win");
    });
  });
});
