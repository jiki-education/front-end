import type { Task, VisualScenario } from "../types";
import type SpaceInvadersNestedRepeatExercise from "./Exercise";

export const tasks = [
  {
    id: "nested-repeat-shoot" as const,
    name: "tasks.nestedRepeatShoot.name",
    description: "tasks.nestedRepeatShoot.description",
    hints: [],
    requiredScenarios: ["nested-repeat-shoot"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "nested-repeat-shoot",
    name: "scenarios.nestedRepeatShoot.name",
    description: "scenarios.nestedRepeatShoot.description",
    taskId: "nested-repeat-shoot",

    setup(exercise) {
      const ex = exercise as SpaceInvadersNestedRepeatExercise;
      ex.setupAliens([
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
      ]);
    },

    expectations(exercise) {
      const ex = exercise as SpaceInvadersNestedRepeatExercise;
      const state = ex.getState();
      return [
        {
          pass: state.gameStatus === "won",
          errorHtml: ex.t("checks.notShotAllAliens")
        }
      ];
    },

    codeChecks: [
      {
        pass: (result, language) => {
          const limit = language === "python" ? 5 : 7;
          return result.assertors.assertMaxLinesOfCode(limit);
        },
        errorKey: "checks.tooManyLines"
      }
    ]
  }
];
