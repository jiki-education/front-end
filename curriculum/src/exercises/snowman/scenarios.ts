import type { Task, VisualScenario } from "../types";
import type { SnowmanExercise } from "./Exercise";

export const tasks = [
  {
    id: "build-snowman" as const,
    name: "Build the snowman",
    description: "Set the variable values so the snowman matches the target image.",
    hints: [
      "The snowman is centered horizontally at x = 50",
      "The base is the largest circle, near the bottom of the canvas",
      "Each circle gets smaller as you go up"
    ],
    requiredScenarios: ["build-snowman"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "build-snowman",
    name: "Build the snowman",
    description: "Set the correct variable values to draw the snowman.",
    taskId: "build-snowman",

    setup(exercise) {
      const ex = exercise as SnowmanExercise;
      ex.setupBackground("https://assets.exercism.org/bootcamp/graphics/snowman.png");
    },

    expectations(exercise) {
      const ex = exercise as SnowmanExercise;

      return [
        {
          pass: ex.hasRectangleAt(0, 0, 100, 60),
          errorHtml: "The sky rectangle is not correct. It should be at (0, 0) with width 100 and height 60."
        },
        {
          pass: ex.hasRectangleAt(0, 60, 100, 40),
          errorHtml: "The snowy ground rectangle is not correct. It should be at (0, 60) with width 100 and height 40."
        },
        {
          pass: ex.hasCircleAt(50, 72, 20),
          errorHtml: "The base (bottom) circle is not correct. Check snowman_x, base_y, and base_size."
        },
        {
          pass: ex.hasCircleAt(50, 42, 10),
          errorHtml: "The body (middle) circle is not correct. Check snowman_x, body_y, and body_size."
        },
        {
          pass: ex.hasCircleAt(50, 27, 5),
          errorHtml: "The head (top) circle is not correct. Check snowman_x, head_y, and head_size."
        }
      ];
    }
  }
];
