import { describe, it, expect } from "vitest";
import exercise from "../../src/exercises/checkerboard";
import { runExerciseTests } from "../runScenarioTest";

// Board-drawing body shared by both variants (draws squares + pieces for boardSize).
const board = `
let boardSize = getBoardSize()
let margin = 2
let squareSize = (100 - 2 * margin) / boardSize
let row = 0
repeat(boardSize) {
  let col = 0
  repeat(boardSize) {
    let isDark = (row + col) % 2 === 1
    let x = margin + col * squareSize
    let y = margin + row * squareSize
    let squareColor = "white"
    if (isDark) {
      squareColor = "dark brown"
    }
    rectangle(x, y, squareSize, squareSize, squareColor)
    if (isDark) {
      let cx = x + squareSize / 2
      let cy = y + squareSize / 2
      if (row < boardSize / 2 - 1) {
        circle(cx, cy, squareSize * 0.4, "black")
        circle(cx, cy, squareSize * 0.3, "charcoal")
      } else if (row >= boardSize / 2 + 1) {
        circle(cx, cy, squareSize * 0.4, "grey")
        circle(cx, cy, squareSize * 0.3, "white")
      }
    }
    col = col + 1
  }
  row = row + 1
}
`;

const bigSquareBorder = `rectangle(0, 0, 100, 100, "black")\n` + board;
const fourRectBorder =
  `rectangle(0, 0, 100, 2, "black")\n` +
  `rectangle(0, 98, 100, 2, "black")\n` +
  `rectangle(0, 0, 2, 100, "black")\n` +
  `rectangle(98, 0, 2, 100, "black")\n` +
  board;

describe("checkerboard border can be one big square or four rectangles", () => {
  for (const [label, source] of [
    ["one big square", bigSquareBorder],
    ["four frame rectangles", fourRectBorder]
  ] as const) {
    it(`passes all scenarios with ${label}`, () => {
      const results = runExerciseTests(exercise, source, "javascript");
      const failed = results.filter((r) => r.status !== "pass");
      expect(
        failed.map(
          (f) =>
            `${f.slug}: ${f.expects
              .filter((e) => !e.pass)
              .map((e) => e.errorHtml)
              .join("; ")}`
        )
      ).toEqual([]);
    });
  }
});
