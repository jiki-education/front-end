import type { Task, VisualScenario } from "../types";
import type { StructuredHouseExercise } from "./Exercise";

export const tasks = [
  {
    id: "draw-house" as const,
    name: "Draw the house",
    description: "Draw the house using variables for all positions, sizes, and colors.",
    hints: [],
    requiredScenarios: ["draw-the-house"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "draw-the-house",
    name: "Draw the house",
    description: "Draw the house matching the specifications.",
    taskId: "draw-house",

    expectations(exercise) {
      const ex = exercise as StructuredHouseExercise;

      return [
        {
          pass: ex.hasRectangleAt(20, 50, 60, 40),
          errorHtml: "The frame of the house is not at the correct position."
        },
        {
          pass: ex.hasTriangleAt(16, 50, 50, 30, 84, 50),
          errorHtml: "The roof of the house is not at the correct position."
        },
        {
          pass: ex.hasRectangleAt(30, 55, 12, 13),
          errorHtml: "The left window isn't positioned correctly."
        },
        {
          pass: ex.hasRectangleAt(58, 55, 12, 13),
          errorHtml: "The right window isn't positioned correctly."
        },
        {
          pass: ex.hasRectangleAt(43, 72, 14, 18),
          errorHtml: "The door isn't positioned correctly."
        },
        {
          pass: ex.hasCircleAt(55, 81, 1),
          errorHtml: "The door knob isn't positioned correctly."
        }
      ];
    }
  }
];
