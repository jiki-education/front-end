import type { Task, VisualScenario } from "../types";
import type { RainbowBallExercise } from "./Exercise";

export const tasks = [
  {
    id: "rainbow-ball" as const,
    name: "Create a bouncing rainbow ball",
    description:
      "Create a ball that bounces around the canvas, leaving a trail of colorful circles that cycle through rainbow colors.",
    hints: [
      "Set up position variables (x, y) and direction variables (x_direction, y_direction)",
      "Set up hue and hue_direction variables to cycle through colors",
      "Use a repeat loop with 1000 iterations",
      "Update positions and hue each iteration, then check for edge bounces",
      "Use random_number() to get a new random speed when bouncing off edges"
    ],
    requiredScenarios: ["rainbow-ball"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "rainbow-ball",
    name: "Rainbow ball",
    description: "A bouncing ball that leaves a rainbow trail of 1000 circles.",
    taskId: "rainbow-ball",
    randomSeed: 42,
    expectations(exercise) {
      const ex = exercise as RainbowBallExercise;

      return [
        {
          pass: ex.checkUniqueColoredCircles(50),
          errorHtml: "Expected at least 50 uniquely colored circles."
        },
        {
          pass: ex.checkUniquePositionedCircles(30),
          errorHtml: "Expected at least 30 different positions."
        }
      ];
    }
  }
];
