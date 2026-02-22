import type { Task, VisualScenario } from "../types";
import type BattleProceduresExercise from "./Exercise";

export const tasks = [
  {
    id: "battle-procedures" as const,
    name: "Create a shootIfAlienAbove function and use it to win the game",
    description:
      "Extract the shooting logic into a shootIfAlienAbove() function, then use it alongside the movement logic to defeat all aliens.",
    hints: [
      "Define shootIfAlienAbove() before the loop",
      "Inside the function, check isAlienAbove() and call shoot() if true",
      "The movement logic is the same as scroll-and-shoot"
    ],
    requiredScenarios: ["battle-procedures"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "battle-procedures",
    name: "Battle Procedures",
    description: "Defeat all aliens using your shootIfAlienAbove function",
    taskId: "battle-procedures",

    setup(exercise) {
      const ex = exercise as BattleProceduresExercise;
      ex.setupAliens([
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
      ]);
      ex.enableAlienRespawning();
    },

    expectations(exercise) {
      const ex = exercise as BattleProceduresExercise;
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
        pass: (result) => result.assertors.assertFunctionDefined("shoot_if_alien_above"),
        errorHtml: "You should define a <code>shootIfAlienAbove</code> function and use it in your solution."
      }
    ]
  }
];
