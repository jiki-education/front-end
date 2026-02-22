import type { Task, VisualScenario } from "../types";
import type { CloudRainSunExercise } from "./Exercise";

export const tasks = [
  {
    id: "draw-scene" as const,
    name: "Draw the weather scene",
    description: "Create a weather scene with a light blue sky, a yellow sun, a white cloud, and blue rain drops.",
    hints: [
      "Draw the background first so other shapes appear on top",
      "The cloud is a rectangle with circles on the edges",
      "Rain drops are ellipses that are taller than they are wide"
    ],
    requiredScenarios: ["draw-scene"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "draw-scene",
    name: "Draw the weather scene",
    description: "Create the complete weather scene with sky, sun, cloud, and rain.",
    taskId: "draw-scene",

    expectations(exercise) {
      const ex = exercise as CloudRainSunExercise;

      return [
        {
          pass: ex.hasRectangleAt(0, 0, 100, 100),
          errorHtml: "The light blue background is missing. Draw a rectangle at (0, 0) with width 100 and height 100."
        },
        {
          pass: ex.hasCircleAt(75, 30, 15),
          errorHtml: "The sun isn't right. It should be a circle at (75, 30) with radius 15."
        },
        {
          pass: ex.hasRectangleAt(25, 50, 50, 10),
          errorHtml: "The cloud body rectangle is missing. It should be at (25, 50) with width 50 and height 10."
        },
        {
          pass: ex.hasCircleAt(25, 50, 10),
          errorHtml: "The left cloud circle is missing. It should be at (25, 50) with radius 10."
        },
        {
          pass: ex.hasCircleAt(40, 40, 15),
          errorHtml: "The left-center cloud circle is missing. It should be at (40, 40) with radius 15."
        },
        {
          pass: ex.hasCircleAt(55, 40, 20),
          errorHtml: "The right-center cloud circle is missing. It should be at (55, 40) with radius 20."
        },
        {
          pass: ex.hasCircleAt(75, 50, 10),
          errorHtml: "The right cloud circle is missing. It should be at (75, 50) with radius 10."
        },
        {
          pass: ex.hasEllipseAt(30, 70, 3, 5),
          errorHtml: "A rain drop is missing at (30, 70)."
        },
        {
          pass: ex.hasEllipseAt(50, 70, 3, 5),
          errorHtml: "A rain drop is missing at (50, 70)."
        },
        {
          pass: ex.hasEllipseAt(70, 70, 3, 5),
          errorHtml: "A rain drop is missing at (70, 70)."
        },
        {
          pass: ex.hasEllipseAt(40, 80, 3, 5),
          errorHtml: "A rain drop is missing at (40, 80)."
        },
        {
          pass: ex.hasEllipseAt(60, 80, 3, 5),
          errorHtml: "A rain drop is missing at (60, 80)."
        }
      ];
    }
  }
];
