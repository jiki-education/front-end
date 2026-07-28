import type { Task, VisualScenario } from "../types";
import type AlienDetectorExercise from "./Exercise";

export const tasks = [
  {
    id: "shoot-the-aliens" as const,
    name: "tasks.shootTheAliens.name",
    description: "tasks.shootTheAliens.description",
    hints: [],
    requiredScenarios: ["one-alien", "one-row", "two-rows", "three-rows", "full-rows"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "one-alien",
    name: "scenarios.oneAlien.name",
    description: "scenarios.oneAlien.description",
    taskId: "shoot-the-aliens",

    setup(exercise) {
      const ex = exercise as AlienDetectorExercise;
      ex.setupAliens([
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ]);
    },

    expectations(exercise) {
      const ex = exercise as AlienDetectorExercise;
      const state = ex.getState();
      return [
        {
          pass: state.gameStatus === "won",
          errorHtml: ex.t("checks.notShotAlien")
        }
      ];
    }
  },
  {
    slug: "one-row",
    name: "scenarios.oneRow.name",
    description: "scenarios.oneRow.description",
    taskId: "shoot-the-aliens",

    setup(exercise) {
      const ex = exercise as AlienDetectorExercise;
      ex.setupAliens([
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0]
      ]);
    },

    expectations(exercise) {
      const ex = exercise as AlienDetectorExercise;
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
    slug: "two-rows",
    name: "scenarios.twoRows.name",
    description: "scenarios.twoRows.description",
    taskId: "shoot-the-aliens",

    setup(exercise) {
      const ex = exercise as AlienDetectorExercise;
      ex.setupAliens([
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
      ]);
    },

    expectations(exercise) {
      const ex = exercise as AlienDetectorExercise;
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
    slug: "three-rows",
    name: "scenarios.threeRows.name",
    description: "scenarios.threeRows.description",
    taskId: "shoot-the-aliens",

    setup(exercise) {
      const ex = exercise as AlienDetectorExercise;
      ex.setupAliens([
        [0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0],
        [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
      ]);
    },

    expectations(exercise) {
      const ex = exercise as AlienDetectorExercise;
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
    slug: "full-rows",
    name: "scenarios.fullRows.name",
    description: "scenarios.fullRows.description",
    taskId: "shoot-the-aliens",

    setup(exercise) {
      const ex = exercise as AlienDetectorExercise;
      ex.setupAliens([
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
      ]);
    },

    expectations(exercise) {
      const ex = exercise as AlienDetectorExercise;
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
