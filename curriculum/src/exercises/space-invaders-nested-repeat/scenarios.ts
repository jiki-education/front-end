import type { Task, VisualScenario } from "../types";
import type SpaceInvadersNestedRepeatExercise from "./Exercise";
import { countLinesOfCode, getSourceCode } from "../../utils/code-checks";

export const tasks = [
  {
    id: "nested-repeat-shoot" as const,
    name: "Use nested repeat loops to shoot all the aliens",
    description:
      "Find the pattern in the alien positions and use a repeat loop inside another repeat loop to destroy them all in 7 lines of code or fewer.",
    hints: [
      "The aliens are at every other column",
      "Each column has 4 aliens stacked vertically",
      "You need to move, shoot four times, then move again for each group",
      "Use a repeat loop for the columns and another for the shots"
    ],
    requiredScenarios: ["nested-repeat-shoot"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "nested-repeat-shoot",
    name: "Nested Repeat and Shoot",
    description: "Use nested repeat loops to shoot all the aliens",
    taskId: "nested-repeat-shoot",

    setup(exercise) {
      const ex = exercise as SpaceInvadersNestedRepeatExercise;
      ex.setupAliens([
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
      ]);
    },

    expectations(exercise) {
      const ex = exercise as SpaceInvadersNestedRepeatExercise;
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
          const loc = countLinesOfCode(sourceCode, language);
          const limit = language === "python" ? 5 : 7;
          return loc <= limit;
        },
        errorHtml:
          "Your solution has too many lines of code. Try using a repeat loop inside another repeat loop to make it shorter!"
      }
    ]
  }
];
