import type { Task, VisualScenario } from "../types";
import type BattleProceduresExercise from "./Exercise";

export const tasks = [
  {
    id: "battle-procedures" as const,
    name: "Create a shootIfAlienAbove function and use it to win the game",
    description:
      "Extract the shooting logic into a shootIfAlienAbove() function, then use it alongside the movement logic to defeat all aliens.",
    hints: [],
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
          errorHtml: "You didn't shoot down all the aliens."
        }
      ];
    },

    codeChecks: [
      {
        pass: (result) => result.assertors.assertFunctionDefined("shoot_if_alien_above"),
        errorHtml: "You need to define a <code>shootIfAlienAbove</code> function."
      },
      {
        pass: (result) => result.assertors.assertFunctionCalledOutsideOwnDefinition("shoot_if_alien_above"),
        errorHtml: "You've defined <code>shootIfAlienAbove</code>, but you need to actually call it in your solution."
      }
    ]
  }
];
