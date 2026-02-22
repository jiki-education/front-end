import type { Task, VisualScenario } from "../types";
import type AlienDetectorExercise from "./Exercise";

export const tasks = [
  {
    id: "shoot-the-aliens" as const,
    name: "Track and shoot down all the aliens",
    description:
      "Use getStartingAliensInRow() to get the alien positions, then move across the screen shooting them down. Track which aliens you've already shot by updating the arrays.",
    hints: [
      "Get all three rows of aliens at the start",
      "Use your position variable to index into the row arrays",
      "When you shoot an alien, set that position to false in the array",
      "Only shoot the lowest alien in each column first"
    ],
    requiredScenarios: ["one-alien", "one-row", "two-rows", "full-rows"],
    bonus: false
  },
  {
    id: "fire-the-fireworks" as const,
    name: "Fire the fireworks when all aliens are shot down",
    description:
      "After shooting all the aliens, call fireFireworks() to celebrate. This must happen in the same loop iteration as shooting the final alien.",
    hints: [
      "Write a helper function that checks if all aliens are dead across all rows",
      "After each shooting pass, check if all aliens are dead",
      "Call fireFireworks() immediately when all aliens are gone"
    ],
    requiredScenarios: ["three-rows", "full-rows-fireworks"],
    bonus: false
  },
  {
    id: "fireworks-inside-loop" as const,
    name: "Fire fireworks inside the loop",
    description: "Can you solve it by putting fireFireworks() within the repeat loop, rather than after it?",
    hints: ["Check if all aliens are dead inside the loop", "If they are, fire the fireworks instead of moving"],
    requiredScenarios: ["fireworks-inside-loop"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "one-alien",
    name: "Shoot the alien",
    description: "A single alien in the bottom row",
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
          errorHtml: "You didn't shoot down the alien."
        }
      ];
    }
  },
  {
    slug: "one-row",
    name: "One sparse row",
    description: "Sparse aliens in the bottom row",
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
          errorHtml: "You didn't shoot down all the aliens."
        }
      ];
    }
  },
  {
    slug: "two-rows",
    name: "Two busy rows",
    description: "Aliens across two rows",
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
          errorHtml: "You didn't shoot down all the aliens."
        }
      ];
    }
  },
  {
    slug: "full-rows",
    name: "Three packed rows",
    description: "Three full rows of aliens",
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
          errorHtml: "You didn't shoot down all the aliens."
        }
      ];
    }
  },
  {
    slug: "three-rows",
    name: "Three rows with fireworks",
    description: "Three rows of aliens — fire the fireworks when done!",
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
          errorHtml: "You didn't shoot down all the aliens."
        }
      ];
    },

    codeChecks: [
      {
        pass: (result) => result.assertors.assertMethodCalled("fire_fireworks"),
        errorHtml: "The fireworks didn't fire. You need to celebrate your victory!"
      }
    ]
  },
  {
    slug: "full-rows-fireworks",
    name: "Three packed rows with fireworks",
    description: "A full grid — fire the fireworks when done!",
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
          errorHtml: "You didn't shoot down all the aliens."
        }
      ];
    },

    codeChecks: [
      {
        pass: (result) => result.assertors.assertMethodCalled("fire_fireworks"),
        errorHtml: "The fireworks didn't fire. You need to celebrate your victory!"
      }
    ]
  },
  {
    slug: "fireworks-inside-loop",
    name: "Fireworks inside the loop",
    description: "Can you fire the fireworks from within the repeat loop?",
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
          errorHtml: "You didn't shoot down all the aliens."
        }
      ];
    },

    codeChecks: [
      {
        pass: (result) => result.assertors.assertMethodCalled("fire_fireworks"),
        errorHtml: "The fireworks didn't fire. You need to celebrate your victory!"
      }
    ]
  }
];
