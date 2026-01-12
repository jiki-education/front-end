import type { Task, VisualScenario } from "../types";
import type ScrollAndShootExercise from "./Exercise";

export const tasks = [
  {
    id: "scroll-and-shoot" as const,
    name: "Move your laser from left to right and shoot the aliens",
    description:
      "Move the laser left and right across the screen, checking for aliens above you and shooting them down. Don't move off the edge or shoot when there's no alien, or you'll lose!",
    hints: [
      "Track your position with a variable",
      "Keep track of which direction you're moving",
      "Use boundaries (0 and 10) to know when to turn around",
      "Check is_alien_above() before shooting",
      "Use repeat_until_game_over to keep the game running"
    ],
    requiredScenarios: ["scroll-and-shoot"],
    bonus: false
  },
  {
    id: "bonus-challenges" as const,
    name: "Bonus challenges",
    description: "Can you solve this without using repeat, and with only one shoot() call?",
    hints: [
      "Use repeat_until_game_over instead of repeat",
      "Put shoot() in one place and control when it gets called with conditionals"
    ],
    requiredScenarios: ["no-repeat", "one-shoot"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "scroll-and-shoot",
    name: "Scroll and Shoot",
    description: "Move your laser from left to right and shoot all the aliens",
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

    expectations(exercise) {
      const ex = exercise as ScrollAndShootExercise;
      const state = ex.getState();
      return [
        {
          pass: state.gameStatus === "won",
          errorHtml: "You didn't shoot down all the aliens."
        }
      ];
    }
  },

  {
    slug: "no-repeat",
    name: "No Repeat",
    description: "Solve without using the repeat keyword (repeat_until_game_over is allowed)",
    taskId: "bonus-challenges",

    setup(exercise) {
      const ex = exercise as ScrollAndShootExercise;
      ex.setupAliens([
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
      ]);
      ex.enableAlienRespawning();
    },

    expectations(exercise) {
      const ex = exercise as ScrollAndShootExercise;
      const state = ex.getState();
      return [
        {
          pass: state.gameStatus === "won",
          errorHtml: "You didn't shoot down all the aliens."
        }
        // Note: The "no repeat" check would need AST analysis which is handled
        // by the test runner, not the scenario expectations
      ];
    }
  },

  {
    slug: "one-shoot",
    name: "One Shoot",
    description: "Only have shoot() appear once in your code",
    taskId: "bonus-challenges",

    setup(exercise) {
      const ex = exercise as ScrollAndShootExercise;
      ex.setupAliens([
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
      ]);
      ex.enableAlienRespawning();
    },

    expectations(exercise) {
      const ex = exercise as ScrollAndShootExercise;
      const state = ex.getState();
      return [
        {
          pass: state.gameStatus === "won",
          errorHtml: "You didn't shoot down all the aliens."
        }
        // Note: The "one shoot() call" check would need AST analysis which is
        // handled by the test runner, not the scenario expectations
      ];
    }
  }
];
