import type { Task, VisualScenario } from "../types";
import type { RainbowSplodgesExercise } from "./Exercise";

export const tasks = [
  {
    id: "draw-splodges" as const,
    name: "Draw rainbow splodges",
    description: "Draw 200 circles at random positions with random colors.",
    hints: [],
    requiredScenarios: ["rainbow-splodges"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "rainbow-splodges",
    name: "Rainbow splodges",
    description: "Draw 200 randomly colored circles at random positions.",
    taskId: "draw-splodges",
    randomSeed: true,
    expectations(exercise) {
      const ex = exercise as RainbowSplodgesExercise;

      return [
        {
          pass: ex.checkUniqueColoredCircles(50),
          errorHtml: "Expected at least 50 uniquely colored circles. Make sure each circle has a random color."
        },
        {
          pass: ex.checkUniquePositionedCircles(30),
          errorHtml: "Expected at least 30 different positions. Make sure each circle has a random position."
        },
        {
          pass: ex.checkAllRadiiInRange(1, 30),
          errorHtml: "All circle radii must be at least 1 and less than 30."
        },
        {
          pass: ex.checkAllCirclesInsideBox(),
          errorHtml: "Circles must not go outside the box. Account for each circle's radius when choosing its position."
        },
        {
          pass: ex.checkCirclesTouchEdges(),
          errorHtml:
            "None of your circles touched the edges of the canvas. If you're confident your code is correct, it might be that the random numbers didn't happen to land a circle exactly on an edge. Try running it again!"
        },
        {
          pass: ex.checkSaturationAndLuminosityInRange(20, 80),
          errorHtml: "Saturation and luminosity must both be between 20 and 80."
        }
      ];
    }
  }
];
