import { describe, expect, it } from "vitest";
import checkerboardExercise from "../../src/exercises/checkerboard";
import { progressionMetrics } from "../../src/exercises/checkerboard/progressionMetrics";
import solution from "../../src/exercises/checkerboard/solution.javascript?raw";
import stub from "../../src/exercises/checkerboard/stub.javascript?raw";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string) {
  const results = runExerciseTests(checkerboardExercise, studentCode, "javascript");
  const runs = buildScenarioRuns(results, checkerboardExercise);
  return runProgressionMirror(progressionMetrics, runs, "javascript");
}

// Border and looped grid of squares, no pieces yet.
const SQUARES_ONLY_ATTEMPT = `let boardSize = getBoardSize()
let squareSize = (100 - 4) / boardSize
rectangle(0, 0, 100, 100, "black")
let row = 0
repeat(boardSize) {
  let col = 0
  repeat(boardSize) {
    let color = "white"
    if ((row + col) % 2 === 1) {
      color = "dark brown"
    }
    rectangle(2 + col * squareSize, 2 + row * squareSize, squareSize, squareSize, color)
    col = col + 1
  }
  row = row + 1
}`;

// The same grid but with the board size hardcoded to 8.
const HARDCODED_SIZE_ATTEMPT = SQUARES_ONLY_ATTEMPT.replace("getBoardSize()", "8");

describe("checkerboard progression", () => {
  it("scores the full anchor plus full metric marks for the model solution", () => {
    const scores = runProgression(solution);

    expect(scores).toEqual({
      score: 25,
      metrics: { scenarios: 10, board_progress: 4, looped_grid: 8, reads_board_size: 3 }
    });
  });

  it("scores 0 for the stub", () => {
    const scores = runProgression(stub);

    expect(scores).toEqual({
      score: 0,
      metrics: { scenarios: 0, board_progress: 0, looped_grid: 0, reads_board_size: 0 }
    });
  });

  it("scores partial board progress plus both concept metrics for a pieceless grid", () => {
    const scores = runProgression(SQUARES_ONLY_ATTEMPT);

    // 65 of 113 elements drawn (border + 64 squares), no scenario passes yet.
    expect(scores).toEqual({
      score: 13,
      metrics: { scenarios: 0, board_progress: 2, looped_grid: 8, reads_board_size: 3 }
    });
  });

  it("scores no reads_board_size when the size is hardcoded", () => {
    const scores = runProgression(HARDCODED_SIZE_ATTEMPT);

    expect(scores).toEqual({
      score: 10,
      metrics: { scenarios: 0, board_progress: 2, looped_grid: 8, reads_board_size: 0 }
    });
  });
});
