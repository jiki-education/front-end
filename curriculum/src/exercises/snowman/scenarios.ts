import type { Task, VisualScenario } from "../types";
import type { SnowmanExercise } from "./Exercise";

export const tasks = [
  {
    id: "build-snowman" as const,
    name: "tasks.buildSnowman.name",
    description: "tasks.buildSnowman.description",
    hints: [],
    requiredScenarios: ["build-snowman"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "build-snowman",
    name: "scenarios.buildSnowman.name",
    description: "scenarios.buildSnowman.description",
    taskId: "build-snowman",

    setup(exercise) {
      const ex = exercise as SnowmanExercise;
      ex.setupBackground("/static/images/exercise-assets/snowman/background.webp");
    },

    expectations(exercise) {
      const ex = exercise as SnowmanExercise;

      return [
        {
          pass: ex.hasCircleAt(50, 70, 20),
          errorHtml: ex.t("checks.baseCircle")
        },
        {
          pass: ex.hasCircleAt(50, 40, 15),
          errorHtml: ex.t("checks.bodyCircle")
        },
        {
          pass: ex.hasCircleAt(50, 20, 10),
          errorHtml: ex.t("checks.headCircle")
        }
      ];
    }
  }
];
