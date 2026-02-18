import type { Task, VisualScenario } from "../types";
import type SpaceInvadersRepeatExercise from "./Exercise";

export const tasks = [
  {
    id: "repeat-shoot" as const,
    name: "Use a repeat loop to shoot all the aliens",
    description:
      "Find the pattern in the alien positions and use a repeat loop to destroy them all in 7 lines of code or fewer.",
    hints: [
      "The aliens are at every other column",
      "Each column has 3 aliens stacked vertically",
      "You need to move twice then shoot three times for each group",
      "Count how many groups there are to set your repeat count"
    ],
    requiredScenarios: ["repeat-shoot"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "repeat-shoot",
    name: "Repeat and Shoot",
    description: "Use a repeat loop to shoot all the aliens",
    taskId: "repeat-shoot",

    setup(exercise) {
      const ex = exercise as SpaceInvadersRepeatExercise;
      ex.setupAliens([
        [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
      ]);
    },

    expectations(exercise) {
      const ex = exercise as SpaceInvadersRepeatExercise;
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
          const limit = language === "python" ? 6 : 7;
          return result.assertors.assertMaxLinesOfCode(limit);
        },
        errorHtml: "Your solution has too many lines of code. Try using a repeat loop to make it shorter!"
      }
    ]
  }
];
