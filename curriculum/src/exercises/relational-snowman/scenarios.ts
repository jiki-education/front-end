import type { Task, VisualScenario } from "../types";
import type { RelationalSnowmanExercise } from "./Exercise";

export const tasks = [
  {
    id: "build-relational-snowman" as const,
    name: "Build the relational snowman",
    description: "Derive all sizes and positions from the size variable so the snowman scales correctly.",
    hints: [
      "head_radius = size * 2, body_radius = size * 3, base_radius = size * 4",
      "body_y = head_y + head_radius + body_radius",
      "base_y = body_y + body_radius + base_radius"
    ],
    requiredScenarios: ["build-relational-snowman"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "build-relational-snowman",
    name: "Build the relational snowman",
    description: "Derive sizes and positions using arithmetic so the snowman scales.",
    taskId: "build-relational-snowman",

    setup(exercise) {
      const ex = exercise as RelationalSnowmanExercise;
      ex.setupBackground("https://assets.exercism.org/bootcamp/graphics/relational-snowman.png");
    },

    expectations(exercise) {
      const ex = exercise as RelationalSnowmanExercise;

      return [
        {
          pass: ex.hasRectangleAt(0, 0, 100, 60),
          errorHtml: "The sky rectangle is not correct. It should be at (0, 0) with width 100 and height 60."
        },
        {
          pass: ex.hasRectangleAt(0, 60, 100, 40),
          errorHtml: "The snowy ground rectangle is not correct. It should be at (0, 60) with width 100 and height 40."
        },
        {
          pass: ex.hasCircleAt(50, 80, 20),
          errorHtml: "The base (bottom) circle is not correct. base_y should be body_y + body_radius + base_radius."
        },
        {
          pass: ex.hasCircleAt(50, 45, 15),
          errorHtml: "The body (middle) circle is not correct. body_y should be head_y + head_radius + body_radius."
        },
        {
          pass: ex.hasCircleAt(50, 20, 10),
          errorHtml: "The head (top) circle is not correct. head_radius should be size * 2."
        }
      ];
    }
  }
];
