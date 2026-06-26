import type { Task, VisualScenario } from "../types";
import type { CheckerboardExercise } from "./Exercise";

export const tasks = [
  {
    id: "set-up-the-board" as const,
    name: "Set up the board",
    description:
      "Draw an 8x8 checkerboard with a 2-unit border, then place the pieces on the dark squares of the top and bottom three rows.",
    hints: [],
    requiredScenarios: ["set-up-the-board"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "set-up-the-board",
    name: "Set up the checkerboard",
    description: "Draw the board and lay out the pieces ready to play.",
    taskId: "set-up-the-board",

    setup(exercise) {
      const ex = exercise as CheckerboardExercise;
      ex.setDrawDelayMs(8);
    },

    expectations(exercise) {
      const ex = exercise as CheckerboardExercise;

      // Board: 8x8, 2-unit border, 12-unit squares. Square (row, col) is at
      // (2 + col * 12, 2 + row * 12). Dark squares are where (row + col) is odd.
      return [
        {
          pass: ex.hasRectangleAtWithColor(2, 2, 12, 12, "white"),
          errorHtml: "The top-left square should be white. Light squares are where (row + col) is even."
        },
        {
          pass: ex.hasRectangleAtWithColor(14, 2, 12, 12, "charcoal"),
          errorHtml: "The square to the right of the top-left one should be charcoal (a dark square)."
        },
        {
          pass: ex.hasRectangleAtWithColor(50, 50, 12, 12, "white"),
          errorHtml: "The squares in the middle of the board aren't placed or coloured correctly."
        },
        {
          pass: ex.hasRectangleAtWithColor(2, 86, 12, 12, "charcoal"),
          errorHtml: "The bottom-left square should be charcoal (a dark square)."
        },
        {
          pass: ex.hasRectangleAtWithColor(86, 86, 12, 12, "white"),
          errorHtml: "The bottom-right square should be white."
        },

        // Pieces: red on dark squares in the top three rows, blue on dark squares in
        // the bottom three rows. Each piece is a circle of radius 5 centred in its square.
        {
          pass: ex.hasCircleAtWithColor(20, 8, 5, "red"),
          errorHtml: "There should be a red piece on the dark square in the top row."
        },
        {
          pass: ex.hasCircleAtWithColor(8, 20, 5, "red"),
          errorHtml: "There should be a red piece on the dark square in the second row."
        },
        {
          pass: ex.hasCircleAtWithColor(8, 92, 5, "skyblue"),
          errorHtml: "There should be a blue piece on the dark square in the bottom row."
        },
        {
          pass: ex.hasCircleAtWithColor(20, 80, 5, "skyblue"),
          errorHtml: "There should be a blue piece on the dark square in the seventh row."
        },

        // The pieces must only sit on dark squares, and the middle two rows stay empty.
        {
          pass: !ex.hasCircleAt(8, 8, 5),
          errorHtml: "There shouldn't be a piece on the top-left square - pieces only go on the dark squares."
        },
        {
          pass: !ex.hasCircleAt(8, 44, 5),
          errorHtml: "The middle two rows should be empty - only the top and bottom three rows have pieces."
        }
      ];
    }
  }
];
