import type { Task, VisualScenario } from "../types";
import type AlienDetectorExercise from "./Exercise";

export const tasks = [
  {
    id: "shoot-the-aliens" as const,
    name: "tasks.shootTheAliens.name",
    description: "tasks.shootTheAliens.description",
    hints: [],
    requiredScenarios: ["one-alien", "one-row", "two-rows", "full-rows"],
    bonus: false
  },
  {
    id: "fire-the-fireworks" as const,
    name: "tasks.fireTheFireworks.name",
    description: "tasks.fireTheFireworks.description",
    hints: [],
    requiredScenarios: ["three-rows", "full-rows-fireworks"],
    bonus: false
  },
  {
    id: "fireworks-inside-loop" as const,
    name: "tasks.fireworksInsideLoop.name",
    description: "tasks.fireworksInsideLoop.description",
    hints: [],
    requiredScenarios: ["fireworks-inside-loop"],
    bonus: true
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
  },
  {
    slug: "three-rows",
    name: "scenarios.threeRows.name",
    description: "scenarios.threeRows.description",
    taskId: "fire-the-fireworks",

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

    // codeChecks: [
    //   {
    //     pass: (result) => result.assertors.assertMethodCalled("fire_fireworks"),
    //     errorHtml: "The fireworks didn't fire. You need to celebrate your victory!"
    //   }
    // ]
  },
  {
    slug: "full-rows-fireworks",
    name: "scenarios.fullRowsFireworks.name",
    description: "scenarios.fullRowsFireworks.description",
    taskId: "fire-the-fireworks",

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

    // codeChecks: [
    //   {
    //     pass: (result) => result.assertors.assertMethodCalled("fire_fireworks"),
    //     errorHtml: "The fireworks didn't fire. You need to celebrate your victory!"
    //   }
    // ]
  },
  {
    slug: "fireworks-inside-loop",
    name: "scenarios.fireworksInsideLoop.name",
    description: "scenarios.fireworksInsideLoop.description",
    taskId: "fireworks-inside-loop",

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
          errorHtml: ex.t("checks.notShotAllAliens")
        }
      ];
    }

    // codeChecks: [
    //   {
    //     pass: (result) => result.assertors.assertMethodCalled("fire_fireworks"),
    //     errorHtml: "The fireworks didn't fire. You need to celebrate your victory!"
    //   }
    // ]
  }
];
