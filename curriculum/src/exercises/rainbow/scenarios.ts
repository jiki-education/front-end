import type { Task, VisualScenario } from "../types";
import type { RainbowExercise } from "./Exercise";

export const tasks = [
  {
    id: "draw-rainbow" as const,
    name: "Draw the rainbow",
    description: "Draw 100 vertical bars across the canvas, each with a different hue to create a rainbow effect.",
    hints: [],
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
          pass: ex.hasRectangleAt(0, 0, 1, 100),
          errorHtml: "The first rectangle is missing."
        },
        {
          pass: ex.hasRectangleAt(99, 0, 1, 100),
          errorHtml: "The last rectangle is missing."
        },
        {
          pass: ex.allRectanglesHaveMinSaturationAndLuminosity(20, 20),
          errorHtml: "All rectangles should have saturation and luminosity of at least 20."
        },
        {
          pass: ex.checkUniqueColoredRectangles(100),
          errorHtml: "There are not 100 different colored rectangles."
        },
        {
          pass: ex.hasRectangleWithHue(0),
          errorHtml: "There should be a rectangle with a hue close to 0 (red)."
        },
        {
          pass: ex.hasRectangleWithHue(300),
          errorHtml: "There should be a rectangle with a hue close to 300 (purple)."
        }
      ];
    }
  }
];
