import type { Task, VisualScenario } from "../types";
import type ScrollAndShootExercise from "./ScrollAndShootExercise";

export const tasks = [
  {
    id: "scroll-and-shoot" as const,
    name: "Scroll across the screen and shoot every alien",
    description:
      "Move the laser back and forth across the screen, checking for an alien above you and shooting it down. Don't move off the edge or shoot when there's no alien, or you'll lose! The waves get busier as you go.",
    hints: [],
    requiredScenarios: ["one-alien", "one-row", "two-rows", "three-rows", "full-rows"],
    bonus: false
  }
] as const satisfies readonly Task[];

function wonExpectation(exercise: ScrollAndShootExercise) {
  return [
    {
      pass: exercise.getState().gameStatus === "won",
      errorHtml: "You didn't shoot down all the aliens."
    }
  ];
}

export const scenarios: VisualScenario[] = [
  {
    slug: "one-alien",
    name: "One alien",
    description: "A single alien to hunt down",
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
    name: "One sparse row",
    description: "A scattering of aliens in the bottom row",
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
    name: "Two rows",
    description: "Aliens spread across two rows",
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
    name: "Three rows",
    description: "Aliens across all three rows",
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
    name: "Full rows",
    description: "Three packed rows. The aliens keep coming back!",
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
        errorHtml:
          "You can't use <code>repeat(n) {}</code> in this exercise. You should only use <code>repeat() {}</code> loops without inputs."
      }
    ]
  }
];
