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
          pass: ex.checkCirclesTouchEdges(),
          errorHtml: "Some circles should touch the edges of the canvas. Make sure your positions cover the full range."
        },
        {
          pass: ex.checkSaturationAndLuminosityInRange(20, 80),
          errorHtml: "Saturation and luminosity must both be between 20 and 80."
        }
      ];
    }
  }
];
