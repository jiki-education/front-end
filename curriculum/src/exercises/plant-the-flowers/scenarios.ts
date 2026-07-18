import type { Task, VisualScenario } from "../types";
import type PlantTheFlowersExercise from "./Exercise";

export const tasks = [
  {
    id: "plant-flowers" as const,
    name: "tasks.plantFlowers.name",
    description: "tasks.plantFlowers.description",
    hints: [],
    requiredScenarios: ["plant-flowers"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "plant-flowers",
    name: "scenarios.plantFlowers.name",
    description: "scenarios.plantFlowers.description",
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
          errorHtml: ex.t("checks.flowerCount", { got: ex.flowers.length })
        },
        {
          pass: ex.hasFlowerAt(10),
          errorHtml: ex.t("checks.missingFlowerAt10")
        },
        {
          pass: ex.hasFlowerAt(50),
          errorHtml: ex.t("checks.missingFlowerAt50")
        },
        {
          pass: ex.hasFlowerAt(90),
          errorHtml: ex.t("checks.missingFlowerAt90")
        }
      ];
    },

    codeChecks: [
      {
        pass: (result, language) => {
          const limit = language === "python" ? 4 : 5;
          return result.assertors.assertMaxLinesOfCode(limit);
        },
        errorKey: "checks.tooManyLines"
      }
    ]
  }
];
