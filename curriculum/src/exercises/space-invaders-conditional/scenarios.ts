import type { Task, VisualScenario } from "../types";
import type SpaceInvadersConditionalExercise from "./Exercise";

export const tasks = [
  {
    id: "conditional-shoot" as const,
    name: "Use an if statement to shoot only when there's an alien above",
    description:
      "Move across the screen, checking each position. If there's an alien above you, shoot it. If not, just move on.",
    hints: [
      "Use is_alien_above() to check before shooting",
      "Wrap the check-and-move pattern in a repeat loop",
      "The pattern is: check, maybe shoot, then move"
    ],
    requiredScenarios: ["conditional-1", "conditional-2", "conditional-3", "conditional-4", "conditional-5"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "conditional-1",
    name: "Scattered aliens",
    description: "Aliens scattered across two rows with gaps",
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
          errorHtml: "You didn't shoot down all the aliens."
        }
      ];
    }
  },
  {
    slug: "conditional-2",
    name: "Sparse aliens",
    description: "Fewer aliens with wider gaps",
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
          errorHtml: "You didn't shoot down all the aliens."
        }
      ];
    }
  },
  {
    slug: "conditional-3",
    name: "Alternating rows",
    description: "Aliens alternating between top and bottom rows",
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
          errorHtml: "You didn't shoot down all the aliens."
        }
      ];
    }
  },
  {
    slug: "conditional-4",
    name: "Bottom-heavy",
    description: "Most aliens in the bottom row",
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
          errorHtml: "You didn't shoot down all the aliens."
        }
      ];
    }
  },
  {
    slug: "conditional-5",
    name: "Dense formation",
    description: "Many aliens packed together across both rows",
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
          errorHtml: "You didn't shoot down all the aliens."
        }
      ];
    }
  }
];
