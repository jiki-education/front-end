import type { Task, VisualScenario } from "../types";
import type { StructuredHouseExercise } from "./Exercise";

export const tasks = [
  {
    id: "draw-house" as const,
    name: "Draw the house",
    description: "Draw the house using variables for all positions, sizes, and colors.",
    hints: [
      "Define houseLeft and houseTop first, then derive other positions from them",
      "The roof overhangs the house by 4 on each side",
      "Windows are 10 inset from the sides and 5 below the top of the frame",
      "The door is centered at the bottom of the house"
    ],
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
          errorHtml: "The frame of the house is not correct. It should be at (20, 50) with width 60 and height 40."
        },
        {
          pass: ex.hasTriangleAt(16, 50, 50, 30, 84, 50),
          errorHtml:
            "The roof is not correct. It should overhang the house by 4 on each side, with the peak centered at x=50."
        },
        {
          pass: ex.hasRectangleAt(30, 55, 12, 13),
          errorHtml: "The left window is not correct. It should be at (30, 55) with width 12 and height 13."
        },
        {
          pass: ex.hasRectangleAt(58, 55, 12, 13),
          errorHtml: "The right window is not correct. It should be at (58, 55) with width 12 and height 13."
        },
        {
          pass: ex.hasRectangleAt(43, 72, 14, 18),
          errorHtml: "The door is not correct. It should be centered at the bottom of the house."
        },
        {
          pass: ex.hasCircleAt(55, 81, 1),
          errorHtml:
            "The door knob is not correct. It should be inset 1 from the right of the door, vertically centered."
        }
      ];
    }
  }
];
