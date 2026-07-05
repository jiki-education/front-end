import type { Task, VisualScenario } from "../types";
import type { BuildWallExercise } from "./Exercise";

export const tasks = [
  {
    id: "build-wall" as const,
    name: "Build the wall",
    description: "Build a complete wall of 55 bricks using nested loops.",
    hints: [],
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
      ex.setDrawDelayMs(20);
    },

    expectations(exercise) {
      const ex = exercise as BuildWallExercise;

      return [
        {
          pass: ex.hasRectangleAt(0, 90, 20, 10),
          errorHtml: "The bottom left rectangle isn't correct."
        },
        {
          pass: ex.hasRectangleAt(80, 90, 20, 10),
          errorHtml: "The bottom right rectangle isn't correct."
        },
        {
          pass: ex.hasRectangleAt(-10, 80, 20, 10),
          errorHtml: "The first rectangle on the second row from the bottom isn't correct."
        },
        {
          pass: ex.hasRectangleAt(90, 80, 20, 10),
          errorHtml: "The last rectangle on the second row from the bottom isn't correct."
        },
        {
          pass: ex.hasRectangleAt(40, 70, 20, 10),
          errorHtml: "The middle rectangle on the third row from the bottom isn't correct."
        },
        {
          pass: ex.hasRectangleAt(30, 60, 20, 10),
          errorHtml: "One of the middle rectangles on the fourth row from the bottom isn't correct."
        },
        {
          pass: ex.hasRectangleAt(-10, 0, 20, 10),
          errorHtml: "The top left rectangle isn't correct."
        },
        {
          pass: ex.hasRectangleAt(90, 0, 20, 10),
          errorHtml: "The top right rectangle isn't correct."
        },
        {
          pass: ex.numElements() === 55,
          errorHtml: "The wall should be made of exactly 55 bricks."
        }
      ];
    },

    codeChecks: [
      {
        pass: (result) => result.assertors.numFunctionCallsInCode("rectangle") === 1,
        errorHtml:
          "You are using the <code>rectangle</code> function in multiple places in your code. It should only appear once!"
      }
    ]
  }
];
