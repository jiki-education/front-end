import type { Task, VisualScenario } from "../types";
import type { SunsetExercise } from "./Exercise";

export const tasks = [
  {
    id: "draw-scene" as const,
    name: "Animate the sunset",
    description:
      "Animate the sun and the sky to make it look like the sun is setting. The sun should grow larger and move down, while both the sun and sky change colors.",
    hints: [
      "Use variables to track the sun's position, size, and colors",
      "Change the variables inside the repeat loop, before drawing",
      "The sun radius starts at 5 and increases by 0.2 each iteration",
      "The sun's y-position starts at 10 and increases by 1 each iteration"
    ],
    requiredScenarios: ["draw-scene"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "draw-scene",
    name: "Make the sun set",
    description: "Animate the sun and the sky to make it look like the sun is setting.",
    taskId: "draw-scene",

    expectations(exercise) {
      const ex = exercise as SunsetExercise;

      return [
        {
          pass: ex.hasCircleAt(50, 11, 5.2),
          errorHtml: "The sun seems wrong near the beginning."
        },
        {
          pass: ex.hasCircleAt(50, 20, 7),
          errorHtml: "The sun seems wrong near the middle."
        },
        {
          pass: ex.hasCircleAt(50, 109, 24.8),
          errorHtml: "The sun seems wrong near the end."
        },
        {
          pass: ex.checkUniqueColoredRectangles(10),
          errorHtml: "The sky doesn't seem to be changing color."
        },
        {
          pass: ex.checkUniqueColoredCircles(10),
          errorHtml: "The sun doesn't seem to be changing color."
        }
      ];
    }
  }
];
