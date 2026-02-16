import type { Task, VisualScenario } from "../types";
import type { SunshineExercise } from "./Exercise";

export const tasks = [
  {
    id: "draw-sun" as const,
    name: "Draw the sun",
    description: "Draw a yellow circle in the center of the canvas to complete the sunshine picture.",
    hints: [
      "Use the circle function with 4 arguments",
      "The center of the canvas is at (50, 50)",
      "The radius should be 25",
      'Use "#ffed06" for the color'
    ],
    requiredScenarios: ["draw-sun"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "draw-sun",
    name: "Draw the sun",
    description: "Draw a yellow circle in the center of the canvas.",
    taskId: "draw-sun",

    expectations(exercise) {
      const ex = exercise as SunshineExercise;

      return [
        {
          pass: ex.hasCircleAt(50, 50, 25),
          errorHtml: "The sun circle isn't in the right place. It should be centered at (50, 50) with a radius of 25."
        }
      ];
    }
  }
];
