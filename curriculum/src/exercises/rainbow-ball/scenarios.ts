import type { Task, VisualScenario } from "../types";
import type { RainbowBallExercise } from "./Exercise";

export const tasks = [
  {
    id: "animate-ball" as const,
    name: "Animate the rainbow ball",
    description:
      "Create a bouncing ball that paints the canvas with a rainbow of colors. The ball should bounce off edges and change direction randomly.",
    hints: [
      "Start with variables for position (x, y) and direction (x_direction, y_direction)",
      "Update position each iteration: x = x + x_direction",
      "Check if ball hits edge and reverse/randomize direction",
      "Increment hue each iteration, reverse when hitting 255 or 0"
    ],
    requiredScenarios: ["animate-ball"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "animate-ball",
    name: "Animate and draw",
    description: "Animate the ball - make a rainbow!",
    taskId: "animate-ball",

    expectations(exercise) {
      const ex = exercise as RainbowBallExercise;

      return [
        {
          pass: ex.hasCircleAt(5, 5, 10),
          errorHtml: "The first circle is not right."
        },
        {
          pass: ex.hasCircleAt(7, 6, 10),
          errorHtml: "The second circle is not right."
        },
        {
          pass: ex.checkCanvasCoverage(80),
          errorHtml: "Less than 80% of the canvas is painted."
        },
        {
          pass: ex.checkUniqueColoredCircles(255),
          errorHtml: "There are not 255 different colored circles."
        }
      ];
    }
  }
];
