import type { Task, VisualScenario } from "../types";
import type { StructuredHouseExercise } from "./Exercise";

export const tasks = [
  {
    id: "arrange-house-with-variables" as const,
    name: "Build the house using variables",
    description:
      "Use variables for all function inputs. Define variables at the top, then use them in the drawing functions.",
    hints: [
      "Define color variables for each element",
      "Calculate positions using formulas, not hard-coded numbers",
      "The roof left position is house_left minus the overhang"
    ],
    requiredScenarios: ["draw-the-house"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "draw-the-house",
    name: "Draw the house using variables",
    description: "All function arguments must use variables, not hard-coded values.",
    taskId: "arrange-house-with-variables",

    expectations(exercise) {
      const ex = exercise as StructuredHouseExercise;

      return [
        {
          pass: ex.hasRectangleAt(20, 50, 60, 40),
          errorHtml: "The frame of the house is not correct."
        },
        {
          pass: ex.hasTriangleAt(16, 50, 50, 30, 84, 50),
          errorHtml: "The roof of the house is not at the correct position."
        },
        {
          pass: ex.hasRectangleAt(30, 55, 12, 13),
          errorHtml: "The left window frame isn't positioned correctly."
        },
        {
          pass: ex.hasRectangleAt(58, 55, 12, 13),
          errorHtml: "The right window frame isn't positioned correctly."
        },
        {
          pass: ex.hasRectangleAt(43, 72, 14, 18),
          errorHtml: "The door frame isn't positioned correctly."
        },
        {
          pass: ex.hasCircleAt(55, 81, 1),
          errorHtml: "The door knob isn't positioned correctly."
        }
      ];
    },

    codeChecks: [
      {
        pass: (result) => result.assertors.assertAllArgumentsAreVariables(),
        errorHtml: "There still seem to be some inputs to functions that are not variables."
      }
    ]
  }
];
