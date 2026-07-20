import type { Task, VisualScenario } from "../types";
import type SpaceInvadersConditionalExercise from "./Exercise";

export const tasks = [
  {
    id: "conditional-shoot" as const,
    name: "tasks.conditionalShoot.name",
    description: "tasks.conditionalShoot.description",
    hints: [],
    requiredScenarios: ["conditional-1", "conditional-2", "conditional-3", "conditional-4", "conditional-5"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "conditional-1",
    name: "scenarios.conditional1.name",
    description: "scenarios.conditional1.description",
    taskId: "conditional-shoot",

    setup(exercise) {
      const ex = exercise as SpaceInvadersConditionalExercise;
      ex.setupAliens([
        [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0],
        [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0]
      ]);
    },

    expectations(exercise) {
      const ex = exercise as SpaceInvadersConditionalExercise;
      const state = ex.getState();
      return [
        {
          pass: state.gameStatus === "won",
          errorHtml: ex.t("checks.notShotAllAliens")
        }
      ];
    }
  },
  {
    slug: "conditional-2",
    name: "scenarios.conditional2.name",
    description: "scenarios.conditional2.description",
    taskId: "conditional-shoot",

    setup(exercise) {
      const ex = exercise as SpaceInvadersConditionalExercise;
      ex.setupAliens([
        [0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0]
      ]);
    },

    expectations(exercise) {
      const ex = exercise as SpaceInvadersConditionalExercise;
      const state = ex.getState();
      return [
        {
          pass: state.gameStatus === "won",
          errorHtml: ex.t("checks.notShotAllAliens")
        }
      ];
    }
  },
  {
    slug: "conditional-3",
    name: "scenarios.conditional3.name",
    description: "scenarios.conditional3.description",
    taskId: "conditional-shoot",

    setup(exercise) {
      const ex = exercise as SpaceInvadersConditionalExercise;
      ex.setupAliens([
        [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
        [0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0]
      ]);
    },

    expectations(exercise) {
      const ex = exercise as SpaceInvadersConditionalExercise;
      const state = ex.getState();
      return [
        {
          pass: state.gameStatus === "won",
          errorHtml: ex.t("checks.notShotAllAliens")
        }
      ];
    }
  },
  {
    slug: "conditional-4",
    name: "scenarios.conditional4.name",
    description: "scenarios.conditional4.description",
    taskId: "conditional-shoot",

    setup(exercise) {
      const ex = exercise as SpaceInvadersConditionalExercise;
      ex.setupAliens([
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
        [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0]
      ]);
    },

    expectations(exercise) {
      const ex = exercise as SpaceInvadersConditionalExercise;
      const state = ex.getState();
      return [
        {
          pass: state.gameStatus === "won",
          errorHtml: ex.t("checks.notShotAllAliens")
        }
      ];
    }
  },
  {
    slug: "conditional-5",
    name: "scenarios.conditional5.name",
    description: "scenarios.conditional5.description",
    taskId: "conditional-shoot",

    setup(exercise) {
      const ex = exercise as SpaceInvadersConditionalExercise;
      ex.setupAliens([
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0],
        [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0]
      ]);
    },

    expectations(exercise) {
      const ex = exercise as SpaceInvadersConditionalExercise;
      const state = ex.getState();
      return [
        {
          pass: state.gameStatus === "won",
          errorHtml: ex.t("checks.notShotAllAliens")
        }
      ];
    }
  }
];
