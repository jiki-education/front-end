import type { Task, VisualScenario } from "../types";
import type { RelationalSnowmanExercise } from "./Exercise";

export const tasks = [
  {
    id: "build-relational-snowman" as const,
    name: "Build the relational snowman",
    description: "Derive all sizes and positions from headRadius and groundY so the snowman scales correctly.",
    hints: [
      "bodyRadius = headRadius * 2, baseRadius = headRadius * 3",
      "baseY = groundY - baseRadius",
      "bodyY = baseY - baseRadius - bodyRadius",
      "headY = bodyY - bodyRadius - headRadius"
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
          errorHtml: "The base (bottom) circle is not correct. baseY should be groundY - baseRadius."
        },
        {
          pass: ex.hasCircleAt(50, 40, 10),
          errorHtml: "The body (middle) circle is not correct. bodyY should be baseY - baseRadius - bodyRadius."
        },
        {
          pass: ex.hasCircleAt(50, 25, 5),
          errorHtml: "The head (top) circle is not correct. headY should be bodyY - bodyRadius - headRadius."
        }
      ];
    },

    codeChecks: [
      {
        pass: (result) => result.assertors.assertNoLiteralNumberAssignments(["head_radius", "snowman_x", "ground_y"]),
        errorHtml: "All sizes and positions should be calculated from headRadius and groundY, not set to plain numbers."
      }
    ]
  }
];
