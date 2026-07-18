import type { Task, VisualScenario } from "../types";
import type { CheckerboardExercise } from "./Exercise";

export const tasks = [
  {
    id: "set-up-the-board" as const,
    name: "tasks.setUpTheBoard.name",
    description: "tasks.setUpTheBoard.description",
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
      errorHtml: ex.t("checks.border")
    },
    {
      pass: ex.hasRectangleAtWithColor(sx(0), sy(0), c, c, "white"),
      errorHtml: ex.t("checks.topLeftWhite")
    },
    {
      pass: ex.hasRectangleAtWithColor(sx(1), sy(0), c, c, "dark brown"),
      errorHtml: ex.t("checks.rightOfTopLeftDark")
    },
    {
      pass: ex.hasRectangleAtWithColor(sx(0), sy(last), c, c, "dark brown"),
      errorHtml: ex.t("checks.bottomLeftDark")
    },
    {
      pass: ex.hasRectangleAtWithColor(sx(last), sy(last), c, c, "white"),
      errorHtml: ex.t("checks.bottomRightWhite")
    },

    // A charcoal piece (with a rim) on the dark square in the top row.
    {
      pass: ex.hasCircleCenteredAtWithColor(cx(1), cy(0), "charcoal"),
      errorHtml: ex.t("checks.charcoalPiece")
    },
    {
      pass: ex.hasCircleCenteredAtWithColor(cx(1), cy(0), "black"),
      errorHtml: ex.t("checks.topRim")
    },

    // A white piece (with a rim) on the dark square in the bottom row.
    {
      pass: ex.hasCircleCenteredAtWithColor(cx(0), cy(last), "white"),
      errorHtml: ex.t("checks.whitePiece")
    },
    {
      pass: ex.hasCircleCenteredAtWithColor(cx(0), cy(last), "grey"),
      errorHtml: ex.t("checks.bottomRim")
    },

    // The pieces must be sized relationally: the rim (outer circle) is 40% of the cell and the
    // inner face is 30% of the cell (75% of the piece). Check one piece of each colour - the
    // sizing is uniform, so a single sample per colour catches a wrong ratio.
    {
      pass: ex.hasCircleAtWithColor(cx(1), cy(0), rimRadius, "black"),
      errorHtml: ex.t("checks.rimRatio")
    },
    {
      pass: ex.hasCircleAtWithColor(cx(1), cy(0), innerRadius, "charcoal"),
      errorHtml: ex.t("checks.innerRatio")
    },
    {
      pass: ex.hasCircleAtWithColor(cx(0), cy(last), rimRadius, "grey"),
      errorHtml: ex.t("checks.rimRatio")
    },
    {
      pass: ex.hasCircleAtWithColor(cx(0), cy(last), innerRadius, "white"),
      errorHtml: ex.t("checks.innerRatio")
    },

    // Pieces only go on dark squares, and the middle rows stay empty.
    {
      pass: !ex.hasCircleCenteredAt(cx(0), cy(0)),
      errorHtml: ex.t("checks.noPieceOnLight")
    },
    {
      pass: !ex.hasCircleCenteredAt(cx(midDarkCol), cy(midRow)),
      errorHtml: ex.t("checks.middleRowsEmpty")
    }
  ];
}

export const scenarios: VisualScenario[] = [
  {
    slug: "board-8",
    name: "scenarios.board8.name",
    description: "scenarios.board8.description",
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
    name: "scenarios.board6.name",
    description: "scenarios.board6.description",
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
    name: "scenarios.board10.name",
    description: "scenarios.board10.description",
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
