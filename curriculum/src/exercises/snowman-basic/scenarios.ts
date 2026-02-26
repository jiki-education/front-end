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
      ex.setupBackground("https://assets.exercism.org/bootcamp/graphics/snowman-basic.png");
    },

    expectations(exercise) {
      const ex = exercise as SnowmanBasicExercise;

      return [
        {
          pass: ex.hasCircleAt(50, 72, 20),
          errorHtml: "The base (bottom) circle is not correct. It should be centered at (50, 72) with a radius of 20."
        },
        {
          pass: ex.hasCircleAt(50, 50, 15),
          errorHtml: "The body (middle) circle is not correct. It should be centered at (50, 50) with a radius of 15."
        },
        {
          pass: ex.hasCircleAt(50, 33, 10),
          errorHtml: "The head (top) circle is not correct. It should be centered at (50, 33) with a radius of 10."
        }
      ];
    }
  }
];
