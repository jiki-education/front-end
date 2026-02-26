import type { Task, VisualScenario } from "../types";
import type { RainbowSplodgesExercise } from "./Exercise";

export const tasks = [
  {
    id: "draw-splodges" as const,
    name: "Draw rainbow splodges",
    description: "Draw 500 circles at random positions with random colors.",
    hints: [],
    requiredScenarios: ["rainbow-splodges"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "rainbow-splodges",
    name: "Rainbow splodges",
    description: "Draw 500 randomly colored circles at random positions.",
    taskId: "draw-splodges",
    randomSeed: true,
    expectations(exercise) {
      const ex = exercise as RainbowSplodgesExercise;

      return [
        {
          pass: ex.checkUniqueColoredCircles(100),
          errorHtml: "Expected at least 100 uniquely colored circles."
        },
        {
          pass: ex.checkUniquePositionedCircles(30),
          errorHtml: "Expected at least 30 different positions."
        }
      ];
    }
  }
];
