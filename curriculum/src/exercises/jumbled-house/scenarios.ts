import type { Task, VisualScenario } from "../types";
import type { JumbledHouseExercise } from "./Exercise";

export const tasks = [
  {
    id: "arrange-house" as const,
    name: "Correctly arrange the house",
    description:
      "Rearrange all the shapes to their correct positions to form a house. Work through each piece methodically.",
    hints: [
      "Start with the sky and grass backgrounds",
      "Position the house frame at (20, 50) with size 60x40",
      "The roof overhangs by 4 on each side",
      "Calculate window positions: 10 in from edges, 5 down from frame top"
    ],
    requiredScenarios: ["draw-the-house"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "draw-the-house",
    name: "Draw the house",
    description: "Arrange all shapes in their correct positions to form a complete house.",
    taskId: "arrange-house",

    expectations(exercise) {
      const ex = exercise as JumbledHouseExercise;

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
    }
  }
];
