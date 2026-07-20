import type { Task, VisualScenario } from "../types";
import type BattleProceduresExercise from "./Exercise";

export const tasks = [
  {
    id: "battle-procedures" as const,
    name: "tasks.battleProcedures.name",
    description: "tasks.battleProcedures.description",
    hints: [],
    requiredScenarios: ["battle-procedures"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "battle-procedures",
    name: "scenarios.battleProcedures.name",
    description: "scenarios.battleProcedures.description",
    taskId: "battle-procedures",

    setup(exercise) {
      const ex = exercise as BattleProceduresExercise;
      ex.setupAliens([
        [0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0]
      ]);
      ex.enableAlienRespawning();
    },

    expectations(exercise) {
      const ex = exercise as BattleProceduresExercise;
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
        pass: (result) => result.assertors.assertFunctionDefined("shoot_if_alien_above"),
        errorKey: "checks.functionNotDefined"
      },
      {
        pass: (result) => result.assertors.assertFunctionCalledOutsideOwnDefinition("shoot_if_alien_above"),
        errorKey: "checks.functionNotCalled"
      }
    ]
  }
];
