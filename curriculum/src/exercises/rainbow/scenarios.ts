import type { Task, VisualScenario } from "../types";
import type { RainbowExercise } from "./Exercise";

export const tasks = [
  {
    id: "draw-rainbow" as const,
    name: "Draw the rainbow",
    description: "Draw 100 vertical bars across the canvas, each with a different hue to create a rainbow effect.",
    hints: [
      "Use a repeat loop that runs 100 times",
      "Increase x by 1 and hue by 3 each iteration",
      "Set the color before drawing each rectangle",
      "Each rectangle should be 1 wide and 100 tall"
    ],
    requiredScenarios: ["draw-rainbow"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "draw-rainbow",
    name: "Draw the rainbow",
    description: "Paint 100 beautiful rectangles to create a rainbow.",
    taskId: "draw-rainbow",

    expectations(exercise) {
      const ex = exercise as RainbowExercise;

      return [
        {
          pass: ex.hasRectangleAt(1, 0, 1, 100),
          errorHtml: "The first rectangle is missing."
        },
        {
          pass: ex.hasRectangleAt(99, 0, 1, 100),
          errorHtml: "The last rectangle is missing."
        },
        {
          pass: ex.checkUniqueColoredRectangles(100),
          errorHtml: "There are not 100 different colored rectangles."
        }
      ];
    }
  }
];
