import type { Task, VisualScenario } from "../types";
import type { RelationalSnowmanExercise } from "./Exercise";

export const tasks = [
  {
    id: "build-relational-snowman" as const,
    name: "Build the relational snowman",
    description: "Derive all sizes and positions from head_radius and ground_y so the snowman scales correctly.",
    hints: [
      "body_radius = head_radius * 2, base_radius = head_radius * 3",
      "base_y = ground_y - base_radius",
      "body_y = base_y - base_radius - body_radius",
      "head_y = body_y - body_radius - head_radius"
    ],
    requiredScenarios: ["build-relational-snowman"],
    bonus: false
  }
] as const satisfies readonly Task[];

// TODO: Add a background image for this exercise
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
          pass: ex.hasCircleAt(50, 65, 15),
          errorHtml: "The base (bottom) circle is not correct. base_y should be ground_y - base_radius."
        },
        {
          pass: ex.hasCircleAt(50, 40, 10),
          errorHtml: "The body (middle) circle is not correct. body_y should be base_y - base_radius - body_radius."
        },
        {
          pass: ex.hasCircleAt(50, 25, 5),
          errorHtml: "The head (top) circle is not correct. head_y should be body_y - body_radius - head_radius."
        }
      ];
    },

    codeChecks: [
      {
        pass: (result) => result.assertors.assertNoLiteralNumberAssignments(["head_radius", "snowman_x", "ground_y"]),
        errorHtml:
          "All sizes and positions should be calculated from head_radius and ground_y, not set to plain numbers."
      }
    ]
  }
];
