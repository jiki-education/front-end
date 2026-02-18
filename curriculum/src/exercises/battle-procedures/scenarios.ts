import type { Task, VisualScenario } from "../types";
import type BattleProceduresExercise from "./Exercise";
import { getSourceCode } from "../../utils/code-checks";

export const tasks = [
  {
    id: "battle-procedures" as const,
    name: "Create a shoot_if_alien_above function and use it to win the game",
    description:
      "Extract the shooting logic into a shoot_if_alien_above() function, then use it alongside the movement logic to defeat all aliens.",
    hints: [
      "Define shoot_if_alien_above() before the repeat loop",
      "Inside the function, check is_alien_above() and call shoot() if true",
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
    description: "Defeat all aliens using your shoot_if_alien_above function",
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
        pass: (result, language) => {
          const sourceCode = getSourceCode(result);
          if (!sourceCode) return true;
          if (language === "javascript") {
            return sourceCode.includes("function shootIfAlienAbove");
          } else if (language === "python") {
            return sourceCode.includes("def shoot_if_alien_above");
          }
          return sourceCode.includes("function shoot_if_alien_above");
        },
        errorHtml: "You should define a <code>shoot_if_alien_above</code> function and use it in your solution."
      }
    ]
  }
];
