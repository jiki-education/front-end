import type { Task, VisualScenario } from "../types";
import type { SunshineExercise } from "./Exercise";

export const tasks = [
  {
    id: "draw-sun" as const,
    name: "Draw the sunshine",
    description:
      "Draw 8 yellow triangle spikes and a yellow circle in the center of the canvas to create a sunshine picture.",
    hints: [
      "Use the triangle function with 7 arguments: x1, y1, x2, y2, x3, y3, color",
      "Use the circle function with 4 arguments: x, y, radius, color",
      "The center of the canvas is at (50, 50)",
      'Use "yellow" for the color of both the spikes and the sun'
    ],
    requiredScenarios: ["draw-sun"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "draw-sun",
    name: "Draw the sunshine",
    description: "Draw 8 triangle spikes and a yellow circle to create the sun.",
    taskId: "draw-sun",

    expectations(exercise) {
      const ex = exercise as SunshineExercise;

      return [
        {
          pass: ex.hasTriangleAt(10, 10, 29, 33, 33, 29),
          errorHtml:
            "The top-left spike is missing or incorrect. It should have corners at (10, 10), (29, 33), and (33, 29)."
        },
        {
          pass: ex.hasTriangleAt(50, 2, 47, 23, 53, 23),
          errorHtml: "The top spike is missing or incorrect. It should have corners at (50, 2), (47, 23), and (53, 23)."
        },
        {
          pass: ex.hasTriangleAt(90, 10, 71, 33, 67, 29),
          errorHtml:
            "The top-right spike is missing or incorrect. It should have corners at (90, 10), (71, 33), and (67, 29)."
        },
        {
          pass: ex.hasTriangleAt(98, 50, 77, 47, 77, 53),
          errorHtml:
            "The right spike is missing or incorrect. It should have corners at (98, 50), (77, 47), and (77, 53)."
        },
        {
          pass: ex.hasTriangleAt(90, 90, 71, 67, 67, 71),
          errorHtml:
            "The bottom-right spike is missing or incorrect. It should have corners at (90, 90), (71, 67), and (67, 71)."
        },
        {
          pass: ex.hasTriangleAt(10, 90, 29, 67, 33, 71),
          errorHtml:
            "The bottom-left spike is missing or incorrect. It should have corners at (10, 90), (29, 67), and (33, 71)."
        },
        {
          pass: ex.hasTriangleAt(50, 98, 47, 77, 53, 77),
          errorHtml:
            "The bottom spike is missing or incorrect. It should have corners at (50, 98), (47, 77), and (53, 77)."
        },
        {
          pass: ex.hasTriangleAt(2, 50, 23, 47, 23, 53),
          errorHtml:
            "The left spike is missing or incorrect. It should have corners at (2, 50), (23, 47), and (23, 53)."
        },
        {
          pass: ex.hasCircleAt(50, 50, 25),
          errorHtml: "The sun circle isn't in the right place. It should be centered at (50, 50) with a radius of 25."
        }
      ];
    }
  }
];
