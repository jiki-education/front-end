import type { Task, VisualScenario } from "../types";
import type { CheckerboardExercise } from "./Exercise";

export const tasks = [
  {
    id: "set-up-the-board" as const,
    name: "Set up the board",
    description:
      "Draw the checkerboard and place the pieces on the dark squares of the top and bottom rows - and make it work for any board size.",
    hints: [],
    requiredScenarios: ["board-8", "board-6", "board-10"],
    bonus: false
  }
] as const satisfies readonly Task[];

// Board: n x n, 2-unit border, so cell = (100 - 2 * 2) / n. Square (row, col) sits at
// (2 + col * cell, 2 + row * cell). Dark squares are where (row + col) is odd. Pieces sit on
// the dark squares of the top rows (row < n / 2 - 1) and bottom rows (row >= n / 2 + 1),
// leaving the middle two rows empty. Each piece is a ridged disc - a rim circle with a
// slightly smaller face circle of the piece colour centred on top. The piece radii scale
// with the cell, so we match pieces by centre + colour rather than by exact radius.
//
// Coordinates are rounded to the interpreter's display precision (5 dp) before matching.
// When n doesn't divide 96 evenly (e.g. n = 10 -> cell = 9.6) the student's arithmetic is
// rounded to 5 dp by the interpreter, so the expected values must be rounded the same way
// or the exact (===) shape lookups would spuriously miss.
function boardExpectations(ex: CheckerboardExercise, n: number) {
  const round5 = (v: number) => Math.round(v * 100000) / 100000;

  const margin = 2;
  const cell = (100 - 2 * margin) / n;
  const mid = cell / 2;
  const last = n - 1;

  // Top-left corner and centre of square (row, col).
  const sx = (col: number) => round5(margin + col * cell);
  const sy = (row: number) => round5(margin + row * cell);
  const cx = (col: number) => round5(margin + col * cell + mid);
  const cy = (row: number) => round5(margin + row * cell + mid);
  const c = round5(cell);

  // Expected piece radii: the full piece is 80% as wide as the square (rim radius = 40% of
  // the cell) and the inner face is 75% as wide as the full piece (inner radius = 30% of the
  // cell). These scale with the board, so we round them the same way as every other value.
  const rimRadius = round5(cell * 0.4);
  const innerRadius = round5(cell * 0.3);

  // A dark square in one of the (empty) middle rows - the column that is dark there
  // depends on whether the middle row index is odd or even.
  const midRow = n / 2;
  const midDarkCol = midRow % 2 === 0 ? 1 : 0;

  // Points in the border margin (outside the board, which spans margin..98). Each must be
  // covered by a black rectangle - however the student chose to draw the border (one big
  // filled square behind the board, or a frame of separate rectangles).
  const borderPoints = [
    [0, 0],
    [100, 0],
    [0, 100],
    [100, 100],
    [50, 0],
    [50, 100],
    [0, 50],
    [100, 50]
  ];

  return [
    {
      pass: borderPoints.every(([px, py]) => ex.hasRectangleCoveringPointWithColor(px, py, "black")),
      errorHtml: "The board should have a black border all the way around the edge."
    },
    {
      pass: ex.hasRectangleAtWithColor(sx(0), sy(0), c, c, "white"),
      errorHtml: "The top-left square should be white (it's a light square)."
    },
    {
      pass: ex.hasRectangleAtWithColor(sx(1), sy(0), c, c, "dark brown"),
      errorHtml: "The square to the right of the top-left one should be dark brown (a dark square)."
    },
    {
      pass: ex.hasRectangleAtWithColor(sx(0), sy(last), c, c, "dark brown"),
      errorHtml: "The bottom-left square should be dark brown (a dark square)."
    },
    {
      pass: ex.hasRectangleAtWithColor(sx(last), sy(last), c, c, "white"),
      errorHtml: "The bottom-right square should be white."
    },

    // A charcoal piece (with a rim) on the dark square in the top row.
    {
      pass: ex.hasCircleCenteredAtWithColor(cx(1), cy(0), "charcoal"),
      errorHtml: "There should be a charcoal piece on the dark square in the top row."
    },
    {
      pass: ex.hasCircleCenteredAtWithColor(cx(1), cy(0), "black"),
      errorHtml: "The pieces in the top rows should have a rim around them."
    },

    // A white piece (with a rim) on the dark square in the bottom row.
    {
      pass: ex.hasCircleCenteredAtWithColor(cx(0), cy(last), "white"),
      errorHtml: "There should be a white piece on the dark square in the bottom row."
    },
    {
      pass: ex.hasCircleCenteredAtWithColor(cx(0), cy(last), "grey"),
      errorHtml: "The pieces in the bottom rows should have a rim around them."
    },

    // The pieces must be sized relationally: the rim (outer circle) is 40% of the cell and the
    // inner face is 30% of the cell (75% of the piece). Check one piece of each colour - the
    // sizing is uniform, so a single sample per colour catches a wrong ratio.
    {
      pass: ex.hasCircleAtWithColor(cx(1), cy(0), rimRadius, "black"),
      errorHtml: "The rim of a piece should be 80% as wide as its square - check the outer circle's radius."
    },
    {
      pass: ex.hasCircleAtWithColor(cx(1), cy(0), innerRadius, "charcoal"),
      errorHtml: "The centre of a piece should be 75% as wide as the whole piece - check the inner circle's radius."
    },
    {
      pass: ex.hasCircleAtWithColor(cx(0), cy(last), rimRadius, "grey"),
      errorHtml: "The rim of a piece should be 80% as wide as its square - check the outer circle's radius."
    },
    {
      pass: ex.hasCircleAtWithColor(cx(0), cy(last), innerRadius, "white"),
      errorHtml: "The centre of a piece should be 75% as wide as the whole piece - check the inner circle's radius."
    },

    // Pieces only go on dark squares, and the middle rows stay empty.
    {
      pass: !ex.hasCircleCenteredAt(cx(0), cy(0)),
      errorHtml: "There shouldn't be a piece on the top-left square - pieces only go on the dark squares."
    },
    {
      pass: !ex.hasCircleCenteredAt(cx(midDarkCol), cy(midRow)),
      errorHtml: "The middle rows should be empty - only the top and bottom rows have pieces."
    }
  ];
}

export const scenarios: VisualScenario[] = [
  {
    slug: "board-8",
    name: "Set up an 8×8 board",
    description: "Draw the classic 8×8 checkerboard and lay out the pieces ready to play.",
    taskId: "set-up-the-board",

    setup(exercise) {
      const ex = exercise as CheckerboardExercise;
      ex.setupBoardSize(8);
      ex.setDrawDelayMs(8);
    },

    expectations(exercise) {
      return boardExpectations(exercise as CheckerboardExercise, 8);
    }
  },
  {
    slug: "board-6",
    name: "Set up a 6×6 board",
    description: "The same code should scale down to a smaller 6×6 board.",
    taskId: "set-up-the-board",

    setup(exercise) {
      const ex = exercise as CheckerboardExercise;
      ex.setupBoardSize(6);
      ex.setDrawDelayMs(12);
    },

    expectations(exercise) {
      return boardExpectations(exercise as CheckerboardExercise, 6);
    }
  },
  {
    slug: "board-10",
    name: "Set up a 10×10 board",
    description: "And it should scale up to a larger 10×10 board.",
    taskId: "set-up-the-board",

    setup(exercise) {
      const ex = exercise as CheckerboardExercise;
      ex.setupBoardSize(10);
      ex.setDrawDelayMs(5);
    },

    expectations(exercise) {
      return boardExpectations(exercise as CheckerboardExercise, 10);
    }
  }
];
