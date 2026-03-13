import type { Task, VisualScenario } from "../types";
import type PlantTheFlowersExercise from "./Exercise";

export const tasks = [
  {
    id: "plant-flowers" as const,
    name: "Plant 9 flowers",
    description: "Use a variable and a repeat loop to plant 9 flowers at positions 10, 20, 30, ..., 90.",
    hints: [],
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

    setup(exercise) {
      const ex = exercise as PlantTheFlowersExercise;
      ex.setupBackground("/static/images/exercise-assets/plant-the-flowers/background.svg");
    },
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
    },

    codeChecks: [
      {
        pass: (result, language) => {
          const limit = language === "python" ? 4 : 5;
          return result.assertors.assertMaxLinesOfCode(limit);
        },
        errorHtml: "Your solution has too many lines of code. Try to find a way to make it shorter."
      }
    ]
  }
];
