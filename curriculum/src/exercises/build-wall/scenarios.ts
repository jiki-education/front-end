import type { Task, VisualScenario } from "../types";
import type { BuildWallExercise } from "./Exercise";

export const tasks = [
  {
    id: "build-wall" as const,
    name: "Build the wall",
    description: "Build a complete wall of 55 bricks using nested loops.",
    hints: [
      "Use nested repeat loops for rows and columns",
      "Alternate row starting positions based on odd/even rows",
      "The rectangle function should only appear once in your code"
    ],
    requiredScenarios: ["build-wall"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "build-wall",
    name: "Build a wall of 55 bricks",
    description: "Create a complete brick wall pattern using nested loops.",
    taskId: "build-wall",

    setup(exercise) {
      const ex = exercise as BuildWallExercise;
      ex.setupStroke(0.4, "#7f3732");
    },

    expectations(exercise) {
      const ex = exercise as BuildWallExercise;

      return [
        {
          pass: ex.hasRectangleAt(0, 0, 20, 10),
          errorHtml: "The top left rectangle isn't correct."
        },
        {
          pass: ex.hasRectangleAt(80, 0, 20, 10),
          errorHtml: "The top right rectangle isn't correct."
        },
        {
          pass: ex.hasRectangleAt(-10, 10, 20, 10),
          errorHtml: "The first rectangle on the second row isn't correct."
        },
        {
          pass: ex.hasRectangleAt(90, 10, 20, 10),
          errorHtml: "The last rectangle on the second row isn't correct."
        },
        {
          pass: ex.hasRectangleAt(40, 20, 20, 10),
          errorHtml: "The middle rectangle on the third row isn't correct."
        },
        {
          pass: ex.hasRectangleAt(30, 30, 20, 10),
          errorHtml: "One of the middle rectangles on the fourth row isn't correct."
        },
        {
          pass: ex.hasRectangleAt(-10, 90, 20, 10),
          errorHtml: "The bottom left rectangle isn't correct."
        },
        {
          pass: ex.hasRectangleAt(90, 90, 20, 10),
          errorHtml: "The bottom right rectangle isn't correct."
        }
      ];
    }
  }
];
