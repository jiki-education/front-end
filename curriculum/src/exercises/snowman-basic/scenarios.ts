import type { Task, VisualScenario } from "../types";
import type { SnowmanBasicExercise } from "./Exercise";

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
      const ex = exercise as SnowmanBasicExercise;
      ex.setupBackground("/static/images/exercise-assets/snowman-basic/background.webp");
    },

    expectations(exercise) {
      const ex = exercise as SnowmanBasicExercise;

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
