import type { Task, VisualScenario } from "../types";
import type SpaceInvadersSolveBasicExercise from "./Exercise";

export const tasks = [
  {
    id: "shoot-the-aliens" as const,
    name: "Shoot all the aliens",
    description:
      "Move your laser cannon to the right and shoot each alien as you pass underneath it. Don't miss or move off the edge!",
    hints: [
      "Count the positions between aliens carefully",
      "You start at position 0 on the far left",
      "Only shoot when you're directly below an alien"
    ],
    requiredScenarios: ["shoot-the-aliens"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "shoot-the-aliens",
    name: "Shoot the Aliens",
    description: "Move right and shoot all the aliens",
    taskId: "shoot-the-aliens",

    setup(exercise) {
      const ex = exercise as SpaceInvadersSolveBasicExercise;
      ex.setupAliens([
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0]
      ]);
    },

    expectations(exercise) {
      const ex = exercise as SpaceInvadersSolveBasicExercise;
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
