import type { Task, VisualScenario } from "../types";
import type SpaceInvadersRepeatExercise from "./Exercise";

export const tasks = [
  {
    id: "repeat-shoot" as const,
    name: "tasks.repeatShoot.name",
    description: "tasks.repeatShoot.description",
    hints: [],
    requiredScenarios: ["repeat-shoot"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "repeat-shoot",
    name: "scenarios.repeatShoot.name",
    description: "scenarios.repeatShoot.description",
    taskId: "repeat-shoot",

    setup(exercise) {
      const ex = exercise as SpaceInvadersRepeatExercise;
      ex.setupAliens([
        [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
      ]);
    },

    expectations(exercise) {
      const ex = exercise as SpaceInvadersRepeatExercise;
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
          const limit = language === "python" ? 6 : 7;
          return result.assertors.assertMaxLinesOfCode(limit);
        },
        errorKey: "checks.tooManyLines"
      }
    ]
  }
];
