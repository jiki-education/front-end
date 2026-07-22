import type { Task, VisualScenario } from "../types";
import type ScrollAndShootExercise from "./ScrollAndShootExercise";

export const tasks = [
  {
    id: "scroll-and-shoot" as const,
    name: "tasks.scrollAndShoot.name",
    description: "tasks.scrollAndShoot.description",
    hints: [],
    requiredScenarios: ["one-alien", "one-row", "two-rows", "three-rows", "full-rows"],
    bonus: false
  }
] as const satisfies readonly Task[];

function wonExpectation(exercise: ScrollAndShootExercise) {
  return [
    {
      pass: exercise.getState().gameStatus === "won",
      errorHtml: exercise.t("checks.notShotAllAliens")
    }
  ];
}

export const scenarios: VisualScenario[] = [
  {
    slug: "one-alien",
    name: "scenarios.oneAlien.name",
    description: "scenarios.oneAlien.description",
    taskId: "scroll-and-shoot",

    setup(exercise) {
      (exercise as ScrollAndShootExercise).setupAliens([
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ]);
    },

    expectations: (exercise) => wonExpectation(exercise as ScrollAndShootExercise)
  },
  {
    slug: "one-row",
    name: "scenarios.oneRow.name",
    description: "scenarios.oneRow.description",
    taskId: "scroll-and-shoot",

    setup(exercise) {
      (exercise as ScrollAndShootExercise).setupAliens([
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0]
      ]);
    },

    expectations: (exercise) => wonExpectation(exercise as ScrollAndShootExercise)
  },
  {
    slug: "two-rows",
    name: "scenarios.twoRows.name",
    description: "scenarios.twoRows.description",
    taskId: "scroll-and-shoot",

    setup(exercise) {
      (exercise as ScrollAndShootExercise).setupAliens([
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
      ]);
    },

    expectations: (exercise) => wonExpectation(exercise as ScrollAndShootExercise)
  },
  {
    slug: "three-rows",
    name: "scenarios.threeRows.name",
    description: "scenarios.threeRows.description",
    taskId: "scroll-and-shoot",

    setup(exercise) {
      (exercise as ScrollAndShootExercise).setupAliens([
        [0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0],
        [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
      ]);
    },

    expectations: (exercise) => wonExpectation(exercise as ScrollAndShootExercise)
  },
  {
    slug: "full-rows",
    name: "scenarios.fullRows.name",
    description: "scenarios.fullRows.description",
    taskId: "scroll-and-shoot",

    setup(exercise) {
      const ex = exercise as ScrollAndShootExercise;
      ex.setupAliens([
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
      ]);
      ex.enableAlienRespawning();
    },

    expectations: (exercise) => wonExpectation(exercise as ScrollAndShootExercise),

    codeChecks: [
      {
        pass: (result) => result.assertors.assertStatement("RepeatStatement", { args: [undefined], count: 0 }),
        errorKey: "checks.noRepeatWithArg"
      }
    ]
  }
];
