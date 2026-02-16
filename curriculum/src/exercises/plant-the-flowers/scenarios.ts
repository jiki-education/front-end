import type { Task, VisualScenario } from "../types";
import type PlantTheFlowersExercise from "./Exercise";

export const tasks = [
  {
    id: "plant-flowers" as const,
    name: "Plant 9 flowers",
    description: "Use a variable and a repeat loop to plant 9 flowers at positions 10, 20, 30, ..., 90.",
    hints: [
      "Start with a position variable set to 10",
      "Use repeat 9 times do ... end",
      "Plant at the current position, then increase it by 10"
    ],
    requiredScenarios: ["plant-flowers"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "plant-flowers",
    name: "Plant 9 flowers",
    description: "Plant flowers at positions 10, 20, 30, 40, 50, 60, 70, 80, and 90.",
    taskId: "plant-flowers",

    expectations(exercise) {
      const ex = exercise as PlantTheFlowersExercise;
      return [
        {
          pass: ex.flowers.length === 9,
          errorHtml: `Expected 9 flowers, but found ${ex.flowers.length}.`
        },
        {
          pass: ex.hasFlowerAt(10),
          errorHtml: "Missing a flower at position 10."
        },
        {
          pass: ex.hasFlowerAt(50),
          errorHtml: "Missing a flower at position 50."
        },
        {
          pass: ex.hasFlowerAt(90),
          errorHtml: "Missing a flower at position 90."
        }
      ];
    }
  }
];
