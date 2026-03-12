import type { Task, VisualScenario } from "../types";
import type { SnowmanBasicExercise } from "./Exercise";

export const tasks = [
  {
    id: "build-snowman" as const,
    name: "Build the snowman",
    description: "Draw three circles to build the snowman.",
    hints: [],
    requiredScenarios: ["build-snowman"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "build-snowman",
    name: "Build the snowman",
    description: "Draw three circles to build the snowman.",
    taskId: "build-snowman",

    setup(exercise) {
      const ex = exercise as SnowmanBasicExercise;
      ex.setupBackground("/static/images/exercise-assets/snowman-basic/background.png");
    },

    expectations(exercise) {
      const ex = exercise as SnowmanBasicExercise;

      return [
        {
          pass: ex.hasCircleAt(50, 70, 20),
          errorHtml: "The base (bottom) circle isn't right."
        },
        {
          pass: ex.hasCircleAt(50, 40, 15),
          errorHtml: "The body (middle) circle isn't right."
        },
        {
          pass: ex.hasCircleAt(50, 20, 10),
          errorHtml: "The head (top) circle isn't right."
        }
      ];
    }
  }
];
