import type { Task, VisualScenario } from "../types";
import type { RainbowSplodgesExercise } from "./Exercise";

export const tasks = [
  {
    id: "draw-splodges" as const,
    name: "Draw rainbow splodges",
    description: "Draw 500 circles at random positions with random colors.",
    hints: [
      "Use a repeat loop that runs 500 times",
      "Get random x and y positions using randomNumber(0, 100)",
      "Get a random hue using randomNumber(0, 360)",
      "Use hsl to convert the hue to a color, then draw with circle()"
    ],
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
    randomSeed: 42,
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
